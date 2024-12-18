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
    <div className="w-full px-4 sm:px-6 lg:px-8 font-f1 text-black">
      <div className="max-w-3xl mx-auto">
        {newDelivery ? (
          <div className="bg-white text-black shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-2xl font-f1 mb-4 sm:mb-6 ">Delivery Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <p>
                <strong>From - </strong> {newDelivery.senderBranch}{" "}
                <strong>To - </strong> {newDelivery.receiverBranch}
                <br></br>
                <strong>Total Items - </strong> {totalItemsDelivered} -{" "}
                <strong>Item Types - </strong> {deliveryItems.length}
              </p>
            </div>
            <Divider className="my-4 border-gray-700" />

            <div className="flex flex-col sm:flex-row justify-between mt-4">
              <Button
                className="w-full sm:w-auto mb-4 sm:mb-0 bg-black text-white"
                isDisabled={
                  checkedCount < deliveryItems.length ||
                  deliveryItems.length === 0
                }
                onClick={handleStartDelivery}
              >
                Start Delivery
              </Button>
              <Button
                color="danger"
                className="w-full sm:w-auto"
                onClick={handleRemoveDelivery}
              >
                Cancel Delivery
              </Button>
            </div>

            {/* Delivery Items */}
            <Divider className="my-6 border-black" />
            <h2 className="text-2xl font-f1 mb-4 sm:mb-6 ">Delivery Items</h2>
            <div className="my-6">
              <Progress
                value={progressPercentage}
                color="danger"
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
                    <th className="border px-4 py-2 text-left" colSpan={2}>Item</th>
                    <th className="border px-4 py-2 text-center">Quantity</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                    <th className="border px-4 py-2 text-center">Sending Stock</th>
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
                          color="danger"
                          size="md"
                          isSelected={checkedItems[item._id] || false}
                          onValueChange={() => handleCheckboxChange(item._id)}
                        />
                      </td>

                      {/* Stock Column */}
                      <td className="border px-4 py-2 text-left">
                        {item.item.packing_type} {item.item.material_type}
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

                      {/* Sending Stock Column */}
                      <td className="border px-4 py-2 text-center">
                        {item.stock._id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
