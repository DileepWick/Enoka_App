import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axiosInstance from '@/config/axiosInstance'; // Adjust the path to where axiosInstance is configured
import { toast } from 'react-toastify';

const deleteCashBill = async (cashBillId) => {
  try {
    const response = await axiosInstance.delete(`/api/cashbills/deleteCashBill/${cashBillId}`);
    
    if (response.status === 200) {
      console.log('CashBill deleted successfully');
      toast.success('CashBill deleted successfully');
    } else {
      console.error('Error deleting CashBill');
    }
  } catch (error) {
    console.error('Error deleting CashBill:', error);
  }
};

const DeleteCashBillModal = ({ cashBillId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = () => {
    deleteCashBill(cashBillId);
    onOpenChange(false); // Close the modal after deletion
  };

  return (
    <>
      <Button onPress={onOpen}>Delete Invoice</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Invoice</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this invoice?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteCashBillModal;
