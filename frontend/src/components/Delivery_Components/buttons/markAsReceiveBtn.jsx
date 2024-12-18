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
  Item,
  quantity,
  itemId,
  itemType,
  receivingBranchId,
  senderBranchId,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track if confirmation is completed
  const [receivedQuantity, setReceivedQuantity] = useState(quantity); // State for user-input quantity

  // Handle the confirmation of marking the delivery as received
  const handleConfirm = async () => {
    try {
      const returnedQuantity = quantity - receivedQuantity;

      // Update the received items
      const receivedStatus = "Received";
      const returnedStatus = "Returned";

      if (receivedQuantity > 0) {
        // Mark the delivery as received
        await axiosInstance.put(
          `/api/deliveryItems/updateStatusOfDeliveryItem/${deliveryItemId}`,
          { status: receivedStatus, quantity: receivedQuantity }
        );

        // Add received items to the receiving branch stock
        if (itemType === "Gasket") {
          await axiosInstance.put(`/api/gaskets/increaseGasketQty/${itemId}`, {
            quantity: receivedQuantity,
            branchId: receivingBranchId,
          });
        } else {
          alert("Unknown Item Type : " + itemType);
        }
      }

      if (returnedQuantity > 0) {
        // Create a new delivery item for returned items
        await axiosInstance.post(`/api/deliveryItems`, {
          itemId,
          itemType,
          quantity: returnedQuantity,
          status: returnedStatus,
          senderBranchId,
          receivingBranchId,
        });

        // Add returned items to the sender branch stock
        if (itemType === "Gasket") {
          await axiosInstance.put(`/api/gaskets/increaseGasketQty/${itemId}`, {
            quantity: returnedQuantity,
            branchId: senderBranchId,
          });
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
      <Button onPress={onOpen} disabled={isConfirmed} className="bg-black text-white">
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
                  You have <Chip color="danger">{quantity}</Chip> items of <Chip>{Item}</Chip>.
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
                    handleConfirm();
                    onClose();
                  }}
                  className="bg-black"
                  disabled={isConfirmed || receivedQuantity <= 0 || receivedQuantity > quantity}
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
