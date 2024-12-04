import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  Input,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";

const DeliveryItemQuantityEditBtn = ({ deliveryItemId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // State to store the quantity input and error message
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Handle edit quantity action
  const handleEditQuantity = async (onClose) => {
    // Validate quantity input
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please provide a valid quantity.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8098/api/deliveryItems/editDeliveryItemQuantity/${deliveryItemId}`,
        {
          quantity: quantity,
        }
      );

      // Check if the update was successful
      if (response.status === 200) {
        setSuccessMessage("Quantity updated successfully!");
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

  return (
    <>
      <Button onPress={onOpen}>Change Quantity</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <h3>Edit Delivery Item Quantity</h3>

              {/* Display success message */}
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

              {/* Display error message */}
              {error && <p style={{ color: "red" }}>{error}</p>}

              {/* Input field for quantity */}
              <Input
                placeholder="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                type="number"
                min="1"
              />

              {/* Update Button */}
              <Button onPress={() => handleEditQuantity(onClose)}>Update Quantity</Button>

              {/* Close Button */}
              <Button onPress={onClose} variant="ghost" style={{ marginTop: "10px" }}>
                Close
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeliveryItemQuantityEditBtn;
