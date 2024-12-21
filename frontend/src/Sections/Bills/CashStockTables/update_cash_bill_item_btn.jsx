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
import axiosInstance from "@/config/axiosInstance"; // Assuming axiosInstance is configured correctly
import { toast } from "react-toastify";

const UpdateCashBillItemBtn = ({ stockId, cashBillItemId, quantity: initialQuantity, unitPrice: initialUnitPrice, discount: initialDiscount }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Initialize state with the values passed from props
  const [quantity, setQuantity] = useState(initialQuantity);
  const [unitPrice, setUnitPrice] = useState(initialUnitPrice);
  const [discount, setDiscount] = useState(initialDiscount);

  // Handle updating CashBillItem
  const handleUpdate = () => {
    const data = {
      quantity,
      unitPrice,
      discount,
    };

    axiosInstance
      .put(`/api/cashbillitems/updateCashBillItem/${cashBillItemId}`, data)
      .then((response) => {
        toast.success("CashBillItem updated successfully");
        onOpenChange(false); // Close modal
      })
      .catch((error) => {
        console.error("Error updating CashBillItem", error);
        toast.error("Failed to update CashBillItem");
      });
  };

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="font-f1" >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update CashBillItem - {cashBillItemId}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">

                  <Input
                    label="Unit Price"
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                  <Input
                    label="Discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                                    <Input
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleUpdate}>
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateCashBillItemBtn;
