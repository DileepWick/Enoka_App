import React, { useState } from "react";
import { createDelivery } from "../../services/deliveryServices.jsx";
import { Select, SelectItem, Button } from "@nextui-org/react";
import CurrentDelivery from "../Delivery_Components/currentDelivery.jsx";

const ResponsiveDeliveryForm = () => {
  // State variables
  const [senderBranch, setSenderBranch] = useState("");
  const [receiverBranch, setReceiverBranch] = useState("");

  // Handle creating a new delivery
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const deliveryData = await createDelivery(senderBranch, receiverBranch); // Create a new delivery
      console.log("Delivery created:", deliveryData);
      callCurrentDeliveryApi();
    } catch (error) {
      console.error("Error creating delivery:", error.message);
    }
  };

    // Notify CurrentDelivery to fetch new delivery data
    const callCurrentDeliveryApi = () => {
      // This triggers the update in the CurrentDelivery component
      // It can be a state change or a prop change
      // Since `CurrentDelivery` already listens to prop change, no need to do anything here.
    };

  // Branch options
  const branches = [
    { label: "Kandy", value: "Kandy" },
    { label: "Colombo", value: "Colombo" },
    { label: "Gampaha", value: "Gampaha" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 font-f1">
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Delivery creation form */}
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-f1 mb-6">Create Delivery</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="FROM"
              placeholder="Select sender branch"
              value={senderBranch}
              onChange={(e) => setSenderBranch(e.target.value)}
              className="w-full"
            >
              {branches.map((branch) => (
                <SelectItem
                  key={branch.value}
                  value={branch.value}
                  className="font-f1"
                >
                  {branch.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="TO"
              placeholder="Select receiver branch"
              value={receiverBranch}
              onChange={(e) => setReceiverBranch(e.target.value)}
              className="w-full"
            >
              {branches.map((branch) => (
                <SelectItem
                  key={branch.value}
                  value={branch.value}
                  className="font-f1"
                >
                  {branch.label}
                </SelectItem>
              ))}
            </Select>
            <Button type="submit" className="w-full mt-4 bg-black text-white">
              Create Delivery
            </Button>
          </form>
        </div>

        {/* Current delivery details */}
        <div className="w-full lg:w-6/8">
          <CurrentDelivery onNewPendingDeliveryCreation={callCurrentDeliveryApi}/>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDeliveryForm;
