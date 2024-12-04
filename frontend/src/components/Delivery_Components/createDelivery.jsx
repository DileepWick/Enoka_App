import React, { useState } from "react";
import {
  createDelivery,
} from "../../services/deliveryServices.jsx";
import { Select, SelectItem, Button } from "@nextui-org/react";
import CurrentDelivery from "../Delivery_Components/currentDelivery.jsx";

const ResponsiveDeliveryForm = ({ onDeliveryCreated }) => {
  const [senderBranch, setSenderBranch] = useState("");
  const [receiverBranch, setReceiverBranch] = useState("");
  const [refreshDelivery, setRefreshDelivery] = useState(false);

  // Handle creating a new delivery
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const deliveryData = await createDelivery(senderBranch, receiverBranch); // Create a new delivery
      alert("New delivery created: " + deliveryData._id);
      onDeliveryCreated();
      setRefreshDelivery((prev) => !prev); 
    } catch (error) {
      console.error("Error creating delivery:", error.message);
    }
  };

  const branches = [
    { label: "Kandy", value: "Kandy" },
    { label: "Colombo", value: "Colombo" },
    { label: "Gampaha", value: "Gampaha" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Delivery creation form */}
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Create Delivery</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Sender Branch"
              placeholder="Select sender branch"
              value={senderBranch}
              onChange={(e) => setSenderBranch(e.target.value)}
              className="w-full"
            >
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={branch.value}>
                  {branch.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Receiver Branch"
              placeholder="Select receiver branch"
              value={receiverBranch}
              onChange={(e) => setReceiverBranch(e.target.value)}
              className="w-full"
            >
              {branches.map((branch) => (
                <SelectItem key={branch.value} value={branch.value}>
                  {branch.label}
                </SelectItem>
              ))}
            </Select>
            <Button type="submit" color="primary" className="w-full mt-4">
              Create Delivery
            </Button>
          </form>
        </div>

        {/* Current delivery details */}
        <div className="w-full lg:w-1/2">
          <CurrentDelivery refresh={refreshDelivery} />
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDeliveryForm;
