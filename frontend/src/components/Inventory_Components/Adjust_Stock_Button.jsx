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
import { updateStock } from "@/services/inventoryServices"; // Import your service function
import { toast } from "react-toastify";

const Adjust_Stock_Button = ({ stockid, currentStock }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newQuantity, setNewQuantity] = useState(currentStock); // To store the new quantity
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle stock update
  const handleUpdateStock = async () => {
    setLoading(true);
    setError(null); // Reset error before starting the update
    try {
      // Call the service to update the stock quantity
      const response = await updateStock(stockid, newQuantity, "Session User");

      // Handle the successful update (e.g., show a success message)
      console.log("Stock updated successfully:", response);
      toast.success("Stock updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
      });

      // Close the modal after successful update
      onOpenChange(false);
    } catch (err) {
      // Handle error if the update fails
      console.error("Error updating stock:", err);
      setError("Failed to update stock. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="bg-black text-white">
        Adjust Stock
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h3 className="font-f1">Adjust Stock Quantity</h3>
          </ModalHeader>
          <ModalBody>
            <div>
              <Input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                label="Adjust Stock Quantity"
                min={0}
                size="lg"
                fullWidth
                className="font-f1"
                aria-label="Adjust Stock Quantity"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
              {/* Display error message */}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => onOpenChange(false)}
              color="danger"
              flat
              className="font-f1"
              variant="bordered"
            >
              Cancel
            </Button>
            <Button
              onPress={handleUpdateStock}
              className="bg-black text-white font-f1"
              disabled={loading || newQuantity < 0} // Disable button if loading or quantity is invalid
            >
              {loading ? "Updating..." : "Update Stock"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Adjust_Stock_Button;
