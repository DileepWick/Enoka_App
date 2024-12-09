import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";

// Emitter
import emitter from "../../../../util/emitter.js";

const CompleteDeliveryBtn = ({ deliveryId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isConfirmed, setIsConfirmed] = useState(false); // State to track confirmation

  // Handle the confirmation of marking the delivery as received
  const handleConfirm = async () => {
    try {
      const status = "received";

      // Make the API call to change the delivery status
      const response = await axios.put(
        `http://localhost:8098/api/delivery/updateDeliveryStatus/${deliveryId}`,
        { status }
      );

      if (response.status === 200) {
        setIsConfirmed(true); // Mark the confirmation as completed
        onOpen(); // Open the modal to display confirmation message
      }
    } catch (error) {
      console.error("Error updating delivery status:", error.message);
    }
  };

  const handleOkClick = (onClose) => {
    emitter.emit("deliveryCompleted"); // Emit the event
    onClose(); // Close the modal
  };

  return (
    <div>
      <Button onPress={handleConfirm} className="bg-black text-white">Complete Delivery</Button>
      {isConfirmed && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="font-f1">Delivery Completed</ModalHeader>
                <ModalBody className="font-f1">
                  <p>Delivery Completed Successfully</p>
                </ModalBody>
                <ModalFooter className="font-f1">
                  <Button
                    color="danger"
                    variant="bordered"
                    onPress={() => handleOkClick(onClose)}
                  >
                    OK
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default CompleteDeliveryBtn;
