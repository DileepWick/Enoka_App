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
import emitter from "../../../../../util/emitter.js";

const AddCashBillItemBtn = ({ StockId ,description}) => {
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
      <Button onPress={onOpen} className="font-f1 bg-black text-white" size="sm">
        Add To Bill
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="font-f1">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {description}
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-row gap-4">
              <Input
                label="Unit Price"
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                fullWidth
                labelPlacement="outside"
              />
              <Input
                label="Discount"
                type="number"
                labelPlacement="outside"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                fullWidth
              />
              <Input
                label="Quantity"
                type="number"
                value={quantity}
                labelPlacement="outside"
                onChange={(e) => setQuantity(e.target.value)}
                fullWidth
              />
            </div>
          </ModalBody>
          <ModalFooter>
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
