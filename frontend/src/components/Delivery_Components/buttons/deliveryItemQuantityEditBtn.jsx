import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  Input,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";

// Emmiter
import emitter from "../../../../util/emitter.js";

const DeliveryItemQuantityEditBtn = ({ deliveryItemId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State to store the quantity input and error message
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Handle edit quantity action
  const handleEditQuantity = async () => {
    // Validate quantity input
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please provide a valid quantity.");
      return;
    }

    try {
      const response = await axios.put(
        `https://enokaback-6acbbcbf5c24.herokuapp.com/api/deliveryItems/editDeliveryItemQuantity/${deliveryItemId}`,
        {
          quantity: quantity,
        }
      );

      // Check if the update was successful
      if (response.status === 200) {
        emitter.emit("deliveryItemQuantityUpdated");
        setError(""); // Clear error message if the request is successful
        setQuantity(""); // Clear the quantity field after success
        onClose(); // Close the modal after successful update
      } else {
        setError("Failed to update item quantity. Please try again.");
      }
    } catch (error) {
      console.error("Error updating delivery item:", error.message);
      setError("Failed to update item quantity. Please try again.");
    }
  };

  const handleClose = () => {
    setQuantity(""); // Reset quantity
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message
  };

  return (
    <>
      <Button onPress={onOpen}>Change Quantity</Button>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-f1">
            <h1 className="text-2xl font-bold">Edit Quantity</h1>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={(e) => {
              e.preventDefault();  // Prevent default form submission
              handleEditQuantity();
            }}>
              <Input
                type="number"
                size="lg"
                value={quantity}
                onChange={handleQuantityChange}
                className="font-f1"
                label="Enter New Quantity"
                required
              />
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              <Button
                type="submit"
                className="mt-8 mb-8 font-f1 bg-black text-white"
              >
                Update Quantity
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button auto flat color="error" onPress={handleClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeliveryItemQuantityEditBtn;
