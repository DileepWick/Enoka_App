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
import { deleteGasket } from "@/services/inventoryServices.jsx";

//Emitter
import emitter from "../../../util/emitter.js";

const Delete_Gasket = ({
  gasketId,
  engine,
  packing,
  material,
  brand,
  vendor,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);

  // Handle stock update
  const handleDeleteGasket = async () => {
    setLoading(true); // Start loading
    try {
      // Delete the gasket
      const response = await deleteGasket(gasketId);

      // Emit an event to notify other components
      emitter.emit("gasketDeleted");

      // Close the modal after successful update
      onOpenChange(false);
    } catch (err) {
      // Handle error if the deletion fails
      console.error("Error deleting gasket:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      {/* Conditional Progress Bar */}
      {loading && (
        <Progress
          isIndeterminate
          aria-label="Deleting..."
          className="max-w-md mb-2"
          size="sm"
        />
      )}
      <Button onPress={onOpen} color="danger" size="sm" variant="bordered">
        Delete
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h3 className="font-f1">Delete Gasket</h3>
          </ModalHeader>
          <ModalBody>
            <p className="font-f1">
              Are you sure you want to delete this gasket?
            </p>
            <p className="font-f1">
              <strong>Gasket ID:</strong> {gasketId}
            </p>
            <p className="font-f1">
              <strong>Engine:</strong> {engine}
            </p>
            <p className="font-f1">
              <strong>Packing:</strong> {packing}
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
                aria-label="Deleting gasket..."
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
              onPress={handleDeleteGasket}
              className="bg-black text-white font-f1"
              isDisabled={loading} // Disable delete button while loading
            >
              {loading ? "Deleting..." : "Delete Gasket"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Delete_Gasket;
