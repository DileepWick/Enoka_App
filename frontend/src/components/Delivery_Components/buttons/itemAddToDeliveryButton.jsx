import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import axios from "axios";


//Emmiter
import emitter from "../../../../util/emitter.js";

const ItemAddToDeliveryButton = ({ item_id, delivery_id ,item_description }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission for new delivery item creation
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please provide a valid quantity.");
      return;
    }

    try {
      const response = await axios.post(
        "https://enokaback-7e8aa9803d2c.herokuapp.com/api/deliveryItems/createDeliveryItem",
        {
          item: item_id, // Use the item_id passed as a prop
          quantity: quantity,
          deliveryId: delivery_id, // Use the delivery_id passed as a prop
        }
      );

      // Check if the delivery item creation was successful
      if (response.status === 201) {
        setError(""); // Clear error message if the request is successful
        setQuantity(""); // Clear the quantity field after success
        onOpenChange(false);

        // Emit an event to notify the parent component that the delivery item was added
        emitter.emit("deliveryItemAdded");
      
      }
    } catch (error) {
      console.error("Error creating delivery item:", error.message);
      setError("Failed to add item to delivery. Please try again.");
    }
  };

  // Reset form when the modal is closed
  const handleClose = () => {
    setQuantity(""); // Reset quantity
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message
  };

  return (
    <>
      <Button onPress={onOpen}>Add + </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-f1">
             {item_description}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Input
                type="number"
                size="lg"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="font-f1"
                label="Quantity" placeholder="Enter your quantity"
                required
              />
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              <Button type="submit" className="mt-8 mb-8 font-f1 bg-black text-white">Add Item</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemAddToDeliveryButton;
