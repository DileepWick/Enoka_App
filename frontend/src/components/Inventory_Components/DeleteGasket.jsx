import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { deleteGasket } from "@/services/inventoryServices.jsx";

//Emiiter
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
    setLoading(true);
    try {
      //Delete the gasket
      const response = await deleteGasket(gasketId);

      // Handle the successful update (e.g., show a success message)
      console.log("Gasket Deleted Successfully:", response);
      alert("Gasket Deleted Successfully");

      // Emit an event to notify other components
      emitter.emit("stockUpdated");

      // Close the modal after successful update
      onOpenChange(false);
    } catch (err) {
      // Handle error if the update fails
      console.error("Error updating stock:", err);

    } finally {
      setLoading(false); // Set loading to false after the request completes
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
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => onOpenChange(false)}
              color="danger"
              flat
              className="font-f1"
              variant="bordered"
            >
              Cancel
            </Button>
            <Button
              onPress={handleDeleteGasket}
              className="bg-black text-white font-f1"
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
