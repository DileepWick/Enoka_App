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
import { deleteBearing } from "../../services/inventoryServices"; // Adjusted service import for bearing deletion

// Emitter
import emitter from "../../../util/emitter.js";

const Delete_Bearing = ({
  bearingId,
  material,
  brand,
  vendor,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  // Handle bearing deletion
  const handleDeleteBearing = async () => {
    setLoading(true); // Start loading
    try {
      // Delete the bearing
      const response = await deleteBearing(bearingId);

      // Emit an event to notify other components
      emitter.emit("bearingDeleted");

      // Close the modal after successful deletion
      onOpenChange(false);
    } catch (err) {
      // Handle error if the deletion fails
      console.error("Error deleting bearing:", err);
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
            <h3 className="font-f1">Delete Bearing</h3>
          </ModalHeader>
          <ModalBody>
            <p className="font-f1">
              Are you sure you want to delete this bearing?
            </p>
            <p className="font-f1">
              <strong>Bearing ID:</strong> {bearingId}
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
                aria-label="Deleting bearing..."
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
              onPress={handleDeleteBearing}
              className="bg-black text-white font-f1"
              isDisabled={loading} // Disable delete button while loading
            >
              {loading ? "Deleting..." : "Delete Bearing"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Delete_Bearing;
