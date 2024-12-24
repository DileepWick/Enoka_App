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

const deliveryItemQuantityEditBtn = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button onPress={onOpen}>Button</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>{(onClose) => <> 
         
        
        </>}
        </ModalContent>
      </Modal>
    </>
  );
};

export default deliveryItemQuantityEditBtn;
