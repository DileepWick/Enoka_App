import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Progress,
} from "@nextui-org/react";
import { deleteRing } from "@/services/inventoryServices.jsx"; // Adjusted service import

// Emitter
import emitter from "../../../util/emitter.js";

const Delete_Ring = ({
  ringId,
  material,
  brand,
  vendor,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  // Handle stock update
  const handleDeleteRing = async () => {
    setLoading(true); // Start loading
    try {
      // Delete the ring
      const response = await deleteRing(ringId);

      // Emit an event to notify other components
      emitter.emit("ringDeleted");

      // Close the modal after successful update
      onOpenChange(false);
    } catch (err) {
      // Handle error if the deletion fails
      console.error("Error deleting ring:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="danger" size="sm" variant="bordered">
        Delete
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h3 className="font-f1">Delete Ring</h3>
          </ModalHeader>
          <ModalBody>
            <p className="font-f1">
              Are you sure you want to delete this ring?
            </p>
            <p className="font-f1">
              <strong>Ring ID:</strong> {ringId}
            </p>
            <p className="font-f1">
              <strong>Material:</strong> {material}
            </p>
            <p className="font-f1">
              <strong>Brand:</strong> {brand}
            </p>
            <p className="font-f1">
              <strong>Vendor:</strong> {vendor}
            </p>
            {/* Inline Progress Bar for Modal */}
            {loading && (
              <Progress
                isIndeterminate
                aria-label="Deleting ring..."
                size="sm"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => onOpenChange(false)}
              color="danger"
              flat
              className="font-f1"
              variant="bordered"
              isDisabled={loading} // Disable Cancel button while deleting
            >
              Cancel
            </Button>
            <Button
              onPress={handleDeleteRing}
              className="bg-black text-white font-f1"
              isDisabled={loading} // Disable delete button while loading
            >
              {loading ? "Deleting..." : "Delete Ring"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Delete_Ring;
