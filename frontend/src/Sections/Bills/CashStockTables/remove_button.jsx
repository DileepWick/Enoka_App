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
      <Button onPress={onOpen} className="font-f1 bg-black text-white">
        Remove
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Remove Item - {StockId}
          </ModalHeader>
          <ModalBody>
            <p>Are you sure you want to remove this item from the bill?</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
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
