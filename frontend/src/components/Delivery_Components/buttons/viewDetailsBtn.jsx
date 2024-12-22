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
  Progress,
} from "@nextui-org/react";
import { getDeliveryItemsByDeliveryId } from "../../../services/deliveryServices";

const ViewDetailsBtn = ({ deliveryId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Delivery Items when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDeliveryItems = async () => {
        setIsLoading(true);
        try {
          const response = await getDeliveryItemsByDeliveryId(deliveryId);
          setDeliveryItems(response.data.data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch delivery items.");
          console.error("Error fetching delivery items:", err.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDeliveryItems();
    }
  }, [isOpen, deliveryId]);

  return (
    <>
      <Button onPress={onOpen} className="mr-2 bg-black text-white">
        View Items
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="full"
        className="font-f1"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Delivery Information</h3>
              </ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <div>
                    <Progress
                      isIndeterminate
                      aria-label="Loading data..."
                      className="w-full"
                      size="sm"
                      label="Retrieving information, just a moment..."
                    />
                  </div>
                ) : error ? (
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
                    <Table
                      aria-label="Delivery Items Table"
                      className="font-f1"
                    >
                      <TableHeader>
                        <TableColumn>PART NUMBER</TableColumn>
                        <TableColumn>ITEM</TableColumn>
                        <TableColumn>DELIVERED</TableColumn>
                        <TableColumn>RECEIVED</TableColumn>
                        <TableColumn>RETURNED</TableColumn>
                        <TableColumn>STATUS</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {deliveryItems.map((item) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.item.part_number}</TableCell>
                            <TableCell>
                              {item.itemType === "Gasket" ? (
                                <>
                                  {item.item.engine?.engine_name}{" "}
                                  {item.item.packing_type}{" "}
                                  {item.item.material_type}{" "}
                                  {item.item.vendor?.vendor_name}{" "}
                                  {item.itemType}
                                  <Chip color="primary" className="ml-4" variant="bordered">
                                    {item.item.brand?.brand_name}
                                  </Chip>
                                </>
                              ) : item.itemType === "Ring" ? (
                                <>
                                  {item.item.engine?.engine_name}{" "}
                                  {item.item.sizes}{" "} {item.item.material}
                                  {item.item.vendor?.vendor_name}{" "}
                                  {item.itemType}
                                  <Chip color="primary" className="ml-4" variant="bordered">
                                    {item.item.brand}
                                  </Chip>
                                </>
                              ) : null}
                            </TableCell>

                            <TableCell>{item.delivery_quantity}</TableCell>
                            <TableCell>{item.received_quantity}</TableCell>
                            <TableCell>{item.returned_quantity}</TableCell>
                            <TableCell>
                              <Chip color="primary">{item.status}</Chip>
                            </TableCell>
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
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewDetailsBtn;
