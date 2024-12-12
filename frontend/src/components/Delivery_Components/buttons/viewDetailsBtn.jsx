import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { getDeliveryItemsByDeliveryId } from "../../../services/deliveryServices";

const ViewDetailsBtn = ({ deliveryId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [error, setError] = useState(null);

  // Fetch Delivery Items when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDeliveryItems = async () => {
        try {
          const response = await getDeliveryItemsByDeliveryId(deliveryId);
          setDeliveryItems(response.data.data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch delivery items.");
          console.error("Error fetching delivery items:", err.message);
        }
      };

      fetchDeliveryItems();
    }
  }, [isOpen, deliveryId]);

  // Print the table as a report
  const handlePrintReport = () => {
    const printContent = document.getElementById("printableTable");
    const newWindow = window.open("", "_blank");
    newWindow.document.write("<html><head><title>Delivery Report</title></head><body>");
    newWindow.document.write(printContent.outerHTML);
    newWindow.document.write("</body></html>");
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <>
      <Button onPress={onOpen}  className="mr-2 bg-black text-white">
        View
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" className="font-f1">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Delivery Information</h3>
              </ModalHeader>
              <ModalBody>
                {error ? (
                  <p>{error}</p>
                ) : (
                  <div
                    id="printableTable"
                    style={{
                      maxHeight: "400px",
                      overflowY: "scroll",
                      padding: "10px",
                    }}
                  >
                    <Table aria-label="Delivery Items Table" className="font-f1">
                      <TableHeader>
                        <TableColumn>Item</TableColumn>
                        <TableColumn>Item Type</TableColumn>
                        <TableColumn>Quantity</TableColumn>
                        <TableColumn>Checking Status</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {deliveryItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.item.description}</TableCell>
                            <TableCell>{item.itemType}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell><Chip color="warning" variant="dot">{item.status}</Chip></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} color="danger" variant="bordered">
                  Close
                </Button>
                <Button onPress={handlePrintReport} className="bg-black text-white" >
                  Print Report
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewDetailsBtn;
