import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axiosInstance from "@/config/axiosInstance"; // Assuming axiosInstance is already set up
import { toast } from "react-toastify";

//Emitter
import emitter from "../../../../util/emitter.js";

const RemoveButton = ({ StockId, cashBillItemId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.delete(
        `/api/cashbillitems/deleteCashBillItem/${cashBillItemId}`
      );

      emitter.emit("CashBillItemRemoved");
      toast.success("Item Removed Successfully!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error(error);
      toast.error(
        "Error removing CashBillItem: " + error?.response?.data?.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="font-f1" size="sm" color="danger" variant="ghost">
        Remove
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-f1">
            Remove Item From Bill
          </ModalHeader>
          <ModalBody className="font-f1">
            <p>Are you sure you want to remove this item from the bill?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="font-f1"
              onPress={handleRemove}
              isLoading={loading}
              disabled={loading}
            >
              Remove Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RemoveButton;
