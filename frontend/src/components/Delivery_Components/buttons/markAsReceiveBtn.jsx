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
} from "@nextui-org/react";
import axios from "axios";

//Emitter
import emitter from "../../../../util/emitter.js";

export default function App({
  deliveryItemId,
  Item,
  quantity,
  itemId,
  itemType,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track if confirmation is completed

  // Handle the confirmation of marking the delivery as received
  const handleConfirm = async () => {
    try {
      const status = "Received";

      // Make the API call to change the delivery status
      const response = await axios.put(
        `https://enoka-d025615470f3.herokuapp.com/api/deliveryItems/updateStatusOfDeliveryItem/${deliveryItemId}`,
        { status }
      );

      // Check if the response is successful
      if (response.status === 200) {
        console.log("Delivery marked as received successfully.");
        setIsConfirmed(true); // Mark the confirmation as completed

        // Update the quantity of the item if it's a gasket
        if (itemType === "Gasket") {
          const response = await axios.put(
            `https://enoka-d025615470f3.herokuapp.com/api/gaskets/increaseGasketQty/${itemId}`,
            { quantity }
          );

          if (response) {
            // Emit the event to notify
            emitter.emit("deliveryItemReceived");
          }
        } else {
          alert("Unknown Item Type : " + itemType);
        }
      }
    } catch (error) {
      console.error("Error marking delivery as received:", error);
      alert("Failed to mark delivery as received.");
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
                Do you want to mark this item as received ?
              </ModalHeader>
              <ModalBody className="font-f1">
                <p>
                  Once you confirm, <Chip color="danger">{Item}</Chip> will be
                  added to the system.
                </p>
              </ModalBody>
              <ModalFooter className="font-f1">
                <Button
                  color="primary"
                  onPress={() => {
                    handleConfirm();
                    onClose();
                  }}
                  className="bg-black"
                  disabled={isConfirmed} // Disable confirm button after confirmation
                >
                  Confirm
                </Button>
                <Button color="danger" variant="bordered" onPress={onClose}>
                  No
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
