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
import axiosInstance from "@/config/axiosInstance";
import { toast } from "react-toastify";
import emitter from "../../../../util/emitter.js";

const AddCashBillItemBtn = ({ StockId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [unitPrice, setUnitPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/cashbillitems/createCashBillItem",
        {
          stockId: StockId,
          unitPrice,
          discount,
          quantity,
        }
      );
      toast.success("Item added successfully!");
      console.log(response.data); // Handle success if needed
      onOpenChange(false); // Close the modal
      emitter.emit("CashBillItemAdded");
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message);
        return;
      }

      toast.error("Error adding item to the bill.");
      console.error(error);
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="font-f1 bg-black text-white">
        ADD
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add Item To This Bill - {StockId}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Unit Price"
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              fullWidth
            />
            <Input
              label="Discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              fullWidth
            />
            <Input
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button color="primary" onPress={handleSubmit}>
              Add Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddCashBillItemBtn;
