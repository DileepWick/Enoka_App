'use client'

import axios from "axios";
import { useState, useEffect } from "react";
import { removeDelivery } from "@/services/deliveryServices";
import { Button, Checkbox } from "@nextui-org/react";

const CurrentDelivery = ({ refresh }) => {
  const [newDelivery, setNewDelivery] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const handleRemoveDelivery = async () => {
    if (newDelivery) {
      try {
        await removeDelivery(newDelivery._id);
        alert("Delivery removed successfully.");
        setNewDelivery(null);
        setDeliveryItems([]);
        setCheckedItems({});

        const response = await getLatestPendingDelivery();
      } catch (error) {
        console.error("Error removing delivery:", error.message);
      }
    }
  };

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
  }, [refresh]);

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

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [itemId]: !prev[itemId] };
      return newCheckedItems;
    });
  };

  const allItemsChecked = Object.values(checkedItems).every((isChecked) => isChecked);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {newDelivery ? (
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">New Delivery Details</h2>
            <div className="space-y-2 text-sm sm:text-base">
              <p>
                <strong>From:</strong> {newDelivery.senderBranch}
              </p>
              <p>
                <strong>To:</strong> {newDelivery.receiverBranch}
              </p>
              <p>
                <strong>Delivery ID:</strong> {newDelivery._id}
              </p>
            </div>
            <Button
              color="primary"
              className="mt-4 sm:mt-8 w-full sm:w-auto"
              variant="ghost"
              onClick={handleRemoveDelivery}
            >
              Remove Delivery
            </Button>
            <div className="mt-6 sm:mt-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Delivery Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="border px-2 py-2 text-left text-xs sm:text-sm">Check</th>
                      <th className="border px-2 py-2 text-left text-xs sm:text-sm">Item</th>
                      <th className="border px-2 py-2 text-left text-xs sm:text-sm">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryItems.length > 0 ? (
                      deliveryItems.map((item) => (
                        <tr key={item._id}>
                          <td className="border px-2 py-2">
                            <Checkbox
                              color="primary"
                              isSelected={checkedItems[item._id] || false}
                              onValueChange={() => handleCheckboxChange(item._id)}
                            />
                          </td>
                          <td className="border px-2 py-2 text-xs sm:text-sm">{item.item.description}</td>
                          <td className="border px-2 py-2 text-xs sm:text-sm">{item.quantity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="border px-2 py-2 text-center text-gray-500 text-xs sm:text-sm">
                          No items for this delivery.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Button
              color="primary"
              className="mt-4 sm:mt-8 w-full sm:w-auto"
              variant="shadow"
              isDisabled={!allItemsChecked}
            >
              Start Deliver
            </Button>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <p className="text-gray-500 italic text-sm sm:text-base">
              No pending deliveries available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentDelivery;
