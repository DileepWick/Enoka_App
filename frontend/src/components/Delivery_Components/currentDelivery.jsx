"use client";

//Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";

import { useState, useEffect } from "react";
import { removeDelivery } from "@/services/deliveryServices";
import { Button, Checkbox, Chip, Divider, Progress } from "@nextui-org/react";
import { toast } from "react-toastify";

//Components
import EditQtyBtn from "./buttons/deliveryItemQuantityEditBtn";

//Emitter
import emitter from "../../../util/emitter.js";

const CurrentDelivery = () => {
  //States
  const [newDelivery, setNewDelivery] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  //Remove Delivery
  const handleRemoveDelivery = async () => {
    if (newDelivery) {
      try {
        await removeDelivery(newDelivery._id);
        setNewDelivery(null);
        setDeliveryItems([]);
        setCheckedItems({});
        // Emit the event to notify GasketList
        emitter.emit("deliveryRemoved");
      } catch (error) {
        console.error("Error removing delivery:", error.message);
      }
    }
  };

  // Fetch latest pending delivery
  useEffect(() => {
    const fetchLatestPendingDelivery = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/delivery/deliveries/latest"
        );

        const delivery = response.data.data;
        if (delivery) {
          setNewDelivery(delivery);
          fetchDeliveryItems(delivery._id);
        } else {
          setNewDelivery(null);
          setDeliveryItems([]);
          setCheckedItems({});
        }
      } catch (error) {
        console.error("Error fetching latest pending delivery:", error.message);
      }
    };

    fetchLatestPendingDelivery();

    // Listen for the deliveryCreated event
    const handleDeliveryCreated = () => {
      console.log(
        "Delivery created event received! Fetching latest delivery in current delivery..."
      );
      fetchLatestPendingDelivery();
    };

    // Listen for the delivery item creation
    const handleDeliveryItemCreated = () => {
      console.log(
        "Delivery item created event received! Fetching latest delivery in current delivery..."
      );
      fetchLatestPendingDelivery();
    };

    // Subscribe to the events
    emitter.on("deliveryCreated", handleDeliveryCreated);
    emitter.on("deliveryItemCreated", handleDeliveryItemCreated);
    emitter.on("deliveryItemQuantityUpdated", handleDeliveryItemCreated);

    // Cleanup listeners on unmount
    return () => {
      emitter.off("deliveryCreated", handleDeliveryCreated);
      emitter.off("deliveryItemCreated", handleDeliveryItemCreated);
    };
  }, []);

  //Fetch Delivery Items
  const fetchDeliveryItems = async (deliveryId) => {
    try {
      const response = await axiosInstance.get(
        `/api/deliveryItems/getDeliveryItemsByDeliveryId/${deliveryId}`
      );
      const items = response.data.data;
      setDeliveryItems(items);
      const initialCheckedState = items.reduce((acc, item) => {
        acc[item._id] = false;
        return acc;
      }, {});
      setCheckedItems(initialCheckedState);
    } catch (error) {
      console.error("Error fetching delivery items:", error.message);
    }
  };

  //Check Box Change
  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [itemId]: !prev[itemId] };
      return newCheckedItems;
    });
  };

  // Calculate Progress
  const checkedCount = Object.values(checkedItems).filter(
    (isChecked) => isChecked
  ).length;

  // Ensure we handle edge cases where deliveryItems.length might be zero
  const progressPercentage =
    deliveryItems.length > 0 ? (checkedCount / deliveryItems.length) * 100 : 0;

  // Calculate Total Items Delivered
  const totalItemsDelivered = deliveryItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  //Start Delivery
  const handleStartDelivery = async () => {
    if (checkedCount < deliveryItems.length || deliveryItems.length === 0) {
      alert("All items must be checked before starting delivery!");
      return;
    }

    try {
      await axiosInstance.put(`/api/delivery/${newDelivery._id}/status`, {
        status: "on delivery",
      });
      toast.success("Delivery started successfully!");

      emitter.emit("deliveryStarted");
      setNewDelivery(null);
      setDeliveryItems([]);
      setCheckedItems({});
    } catch (error) {
      console.error("Error starting delivery:", error.message);
    }
  };

  //Remove Item
  const handleRemoveItem = async (itemId, stockId, quantity) => {
    try {
      // Perform both actions simultaneously
      await Promise.all([
        axiosInstance.delete(`/api/deliveryItems/deleteDeliveryItem/${itemId}`),
        axiosInstance.put(`/api/stocks/increaseStockQuantity/${stockId}`, {
          quantity,
        }),
      ]);

      toast.success("Item removed successfully!");

      // Emit the event to notify GasketList
      emitter.emit("deliveryItemRemoved");

      // Update frontend states
      const updatedItems = deliveryItems.filter((item) => item._id !== itemId);
      setDeliveryItems(updatedItems);
      const updatedCheckedItems = { ...checkedItems };
      delete updatedCheckedItems[itemId];
      setCheckedItems(updatedCheckedItems);
    } catch (error) {
      console.error("Error removing item:", error.message);
      toast.error("Error removing item. Please try again.");
    }
  };

  return (
    <div className="w-full  font-f1 text-black">
      <div className=" mx-auto">
        {newDelivery ? (
          <div className="bg-white text-black shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-2xl font-f1 mb-4 sm:mb-6 ">DELIVERY DETAILS</h2>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm sm:text-base">
                <div className="space-y-2">
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">From:</span>
                    <span className="text-black">
                      {newDelivery.senderBranch}
                    </span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">To:</span>
                    <span className="text-black">
                      {newDelivery.receiverBranch}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">
                      Total Items:
                    </span>
                    <span className="text-black">{totalItemsDelivered}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">
                      Item Types:
                    </span>
                    <span className="text-black">{deliveryItems.length}</span>
                  </p>
                </div>
              </div>
            </div>
            <Divider className="my-4 border-gray-700" />

            {/* Delivery Items */}
            <h2 className="text-2xl font-f1 mb-4 sm:mb-6 ">DELIVERY LIST</h2>
            <div className="my-6">
              <Progress
                value={progressPercentage}
                color="primary"
                size="sm"
                className="h-4 rounded-lg "
              />
              <p className="mt-2 text-center text-sm">
                {checkedCount} / {deliveryItems.length} items checked (
                {Math.round(progressPercentage)}%)
              </p>
            </div>
            <div
              className="overflow-x-auto overflow-y-auto max-h-64  rounded-lg p-2"
              style={{ scrollbarWidth: "thin" }}
            >
              <table className="min-w-full table-auto text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border px-4 py-2 text-center" colSpan={2}>
                      Item
                    </th>
                    <th className="border px-4 py-2 text-center">Brand</th>
                    <th className="border px-4 py-2 text-center">Quantity</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      {/* Checkbox Column */}
                      <td className="border px-4 py-2 text-center">
                        <Checkbox
                          color="primary"
                          size="sm"
                          isSelected={checkedItems[item._id] || false}
                          onValueChange={() => handleCheckboxChange(item._id)}
                        />
                      </td>

                      {/* Stock Column */}
                      <td className="border px-4 py-2 text-center whitespace-nowrap overflow-x-auto">
                        {item.item.engine?.engine_name}-{item.item.packing_type}{" "}
                        {item.item.material_type}{" "}
                        <Chip variant="bordered" color="primary" size="sm">
                          {item.item.vendor?.vendor_name}
                        </Chip>{" "}
                      </td>

                      {/* Quantity Column */}
                      <td className="border px-4 py-2 text-center">
                        {item.item.brand?.brand_name}
                      </td>

                      {/* Quantity Column */}
                      <td className="border px-4 py-2 text-center">
                        {item.delivery_quantity}
                      </td>

                      {/* Actions Column */}
                      <td className="border px-4 py-2 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <EditQtyBtn
                            deliveryItemId={item._id}
                            stockId={item.stock._id}
                            currentQuantity={item.delivery_quantity}
                          />
                          <Button
                            color="danger"
                            size="sm"
                            variant="bordered"
                            onClick={() =>
                              handleRemoveItem(
                                item._id,
                                item.stock._id,
                                item.delivery_quantity
                              )
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Divider className="my-6 border-black mt-8" />
              <div className="flex flex-col sm:flex-row justify-between mt-4">
                <Button
                  className=" bg-black text-white"
                  size="sm"
                  isDisabled={
                    checkedCount < deliveryItems.length ||
                    deliveryItems.length === 0
                  }
                  onClick={handleStartDelivery}
                >
                  START
                </Button>
                <Button color="danger" size="sm" onClick={handleRemoveDelivery}>
                  CANCEL
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-black text-white shadow-md rounded-lg p-4 sm:p-6">
            <p className=" italic text-sm sm:text-base">
              Create New Delivery To Add Items
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentDelivery;
