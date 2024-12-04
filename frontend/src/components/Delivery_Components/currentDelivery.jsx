"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { removeDelivery } from "@/services/deliveryServices";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  Progress
} from "@nextui-org/react";

//Components
import EditQtyBtn from "./buttons/deliveryItemQuantityEditBtn";

const CurrentDelivery = ({onNewPendingDeliveryCreation}) => {

  //States
  const [newDelivery, setNewDelivery] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  //Remove Delivery
  const handleRemoveDelivery = async () => {
    if (newDelivery) {
      try {
        await removeDelivery(newDelivery._id);
        alert("Delivery removed successfully.");
        setNewDelivery(null);
        setDeliveryItems([]);
        setCheckedItems({});

      } catch (error) {
        console.error("Error removing delivery:", error.message);
      }
    }
  };

  //Fetch Pending Delivery
  useEffect(() => {
    const fetchLatestPendingDelivery = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8098/api/delivery/deliveries/latest"
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
  }, [onNewPendingDeliveryCreation]);

  //Fetch Delivery Items
  const fetchDeliveryItems = async (deliveryId) => {
    try {
      const response = await axios.get(
        `http://localhost:8098/api/deliveryItems/getDeliveryItemsByDeliveryId/${deliveryId}`
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
      await axios.put(
        `http://localhost:8098/api/delivery/${newDelivery._id}/status`,
        { status: "on delivery" }
      );
      alert("Delivery started successfully.");
      setNewDelivery(null);
      setDeliveryItems([]);
      setCheckedItems({});
      window.location.reload();
    } catch (error) {
      console.error("Error starting delivery:", error.message);
    }
  };

  //Remove Item
  const handleRemoveItem = async (itemId) => {
    try {
      // Remove item from backend
      await axios.delete(
        `http://localhost:8098/api/deliveryItems/deleteDeliveryItem/${itemId}`
      );

      // Remove item locally from delivery items
      const updatedItems = deliveryItems.filter((item) => item._id !== itemId);
      setDeliveryItems(updatedItems);

      // Remove item from checkedItems state
      const updatedCheckedItems = { ...checkedItems };
      delete updatedCheckedItems[itemId];
      setCheckedItems(updatedCheckedItems);
    } catch (error) {
      console.error("Error removing item:", error.message);
      alert("Failed to remove item. Please try again.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 font-f1 text-black">
      <div className="max-w-3xl mx-auto">
        {newDelivery ? (
          <div className="bg-white text-black shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-2xl font-f1 mb-4 sm:mb-6 ">Delivery Details</h2>
            <Divider className="my-4 border-gray-700" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <p>
                <strong>From - </strong> {newDelivery.senderBranch}
              </p>
              <p>
                <strong>To - </strong> {newDelivery.receiverBranch}
              </p>
              <p>
                <strong>Delivery ID - </strong> <Chip>{newDelivery._id}</Chip>
              </p>
              <p>
                <strong>Item Types - </strong> {deliveryItems.length}
              </p>
              <p>
                <strong>Total Items - </strong> {totalItemsDelivered}
              </p>
            </div>
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
            <Divider className="my-6 border-black" />
            <h2 className="text-2xl font-f1 mb-4 sm:mb-6 ">Delivery Items</h2>
            <div
              className="overflow-x-auto overflow-y-auto max-h-64  rounded-lg p-2"
              style={{ scrollbarWidth: "thin" }}
            >
              <table className="min-w-full table-auto text-xs sm:text-sm">
                <thead>
                  <tr>
                    <th className="border px-2 py-2 text-left " colSpan={2}>
                      Item
                    </th>
                    <th className="border px-2 py-2 text-left ">Quantity</th>
                    <th className="border px-2 py-2 text-left ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryItems.map((item) => (
                    <tr key={item._id}>
                      <td className="border px-2 py-2">
                        <Checkbox
                          color="danger"
                          size="lg"
                          isSelected={checkedItems[item._id] || false}
                          onValueChange={() => handleCheckboxChange(item._id)}
                        />
                      </td>
                      <td className="border px-2 py-2">
                        {item.item.description}
                      </td>
                      <td className="border px-2 py-2">{item.quantity}</td>
                      <td className="border px-2 py-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            className="bg-black text-white text-xs"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            Remove
                          </Button>
                          <EditQtyBtn deliveryItemId={item._id} />
                        </div>
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
