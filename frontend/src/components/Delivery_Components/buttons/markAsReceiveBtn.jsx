import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Input,
} from "@nextui-org/react";

// Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";

// Emitter
import emitter from "../../../../util/emitter.js";

export default function App({
  deliveryItemId,
  SenderStock,
  Item,
  quantity,
  itemId,
  itemType,
  receivingBranch,
  deliveryId,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track if confirmation is completed
  const [receivedQuantity, setReceivedQuantity] = useState(quantity); // State for user-input quantity

  // Handle the confirmation of marking the delivery as received
  const handleConfirm = async () => {
    try {
      // Calculate returned items
      const returnedQuantity = quantity - receivedQuantity;
      console.log(
        `Received Quantity: ${receivedQuantity}, Returned Quantity: ${returnedQuantity}`
      );

      // Update the received items
      const receivedStatus = "Received";
      const returnedStatus = "Returned";

      // Update stock for received items
      if (receivedQuantity > 0) {
        console.log(
          `Updating stock for received items: ${receivedQuantity} of ${Item}`
        );

        // Call the new route for updating stock
        const response = await axiosInstance.put(
          `/api/deliveryItems/updateStockForBranchAndItem`,
          {
            branchName: receivingBranch, // Branch name where items are received
            itemId: itemId, // Item ID
            quantity: receivedQuantity, // Received quantity
          }
        );
        console.log("Received stock update response:", response.data);

        //Update the delivery Item status
        const deliveryItemResponse = await axiosInstance.put(
          `/api/deliveryItems/updateStatusOfDeliveryItem/${deliveryItemId}`,
          {
            status: receivedStatus,
          }
        );
        console.log("Delivery item response:", deliveryItemResponse.data);
      }

      if (returnedQuantity > 0) {
        console.log(
          `Returning ${returnedQuantity} of ${Item} to sender branch`
        );

        // Add returned items to the sender branch stock
        if (itemType === "Gasket") {
          const senderStockResponse = await axiosInstance.put(
            `/api/stocks/increaseStockQuantity/${SenderStock}`,
            {
              quantity: returnedQuantity,
            }
          );
          console.log(
            "Returned items added to sender stock:",
            senderStockResponse.data
          );
        }
      }

      setIsConfirmed(true); // Mark the confirmation as completed
      emitter.emit("deliveryItemProcessed");
    } catch (error) {
      console.error("Error processing delivery item:", error);
      alert("Failed to process delivery item.");
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        disabled={isConfirmed}
        className="bg-black text-white"
      >
        Mark as Received
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 font-f1">
                Process Delivery Item
              </ModalHeader>
              <ModalBody className="font-f1">
                <p>
                  You have <Chip color="danger">{quantity}</Chip> items of{" "}
                  <Chip>{Item}</Chip>.
                  <br />
                  How many would you like to mark as received?
                </p>
                <Input
                  type="number"
                  value={receivedQuantity}
                  min={0}
                  max={quantity}
                  onChange={(e) => setReceivedQuantity(Number(e.target.value))}
                  fullWidth
                  placeholder="Enter quantity to mark as received"
                />
              </ModalBody>
              <ModalFooter className="font-f1">
                <Button
                  color="primary"
                  onPress={() => {
                    console.log(
                      `Confirming received quantity: ${receivedQuantity}`
                    );
                    handleConfirm();
                    onClose();
                  }}
                  className="bg-black"
                  disabled={
                    isConfirmed ||
                    receivedQuantity <= 0 ||
                    receivedQuantity > quantity
                  }
                >
                  Confirm
                </Button>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
