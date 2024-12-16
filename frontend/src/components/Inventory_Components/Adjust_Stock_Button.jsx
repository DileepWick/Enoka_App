import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const Adjust_Stock_Button = ({ stockid, currentStock }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  return (
    <>
      <Button onPress={onOpen} className="bg-black text-white">Adjust Stock</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <div>
                <h1>Current Stock - {currentStock}</h1>
                <h1>Stock Id - {stockid}</h1>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Adjust_Stock_Button;
