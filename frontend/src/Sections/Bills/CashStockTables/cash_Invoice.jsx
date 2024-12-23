import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";
import axiosInstance from "@/config/axiosInstance";
import { toast } from "react-toastify";

// Emitter
import emitter from "../../../../util/emitter";

// Buttons
import RemoveButon from "./remove_button.jsx";
import EditButton from "./update_cash_bill_item_btn.jsx";
import DeleteCashBillButton from "./delete_cash_bill.jsx";

const CashInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cashBill, setCashBill] = useState(null);
  const [newInvoiceCreated, setNewInvoiceCreated] = useState(false); // New state to handle re-fetch

  // Function to fetch invoice data
  const fetchInvoiceData = async () => {
    setLoading(true); // Start loading before fetching data

    try {
      console.log("Fetching invoice data..."); // Log before fetching
      const response = await axiosInstance.get(
        "/api/cashbills/getLatestPendingCashBill"
      );
      const data = response.data;

      if (data && data.cashBillItems) {
        console.log("Invoice data fetched:", data); // Log when data is successfully fetched
        setInvoiceData(data.cashBillItems);
        setCashBill(data.cashBill);
      } else {
        setError("No items found in the invoice.");
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error); // Log error details
      setError("Error fetching invoice data.");
    } finally {
      setLoading(false); // End loading after fetching data
    }
  };

  // Fetch invoice data when the component mounts
  useEffect(() => {
    // Fetch the initial data on component mount
    fetchInvoiceData();

    // Event listener for CashBillCreated
    const cashBillCreatedListener = () => {
      console.log("CashBillCreated event triggered");
      fetchInvoiceData(); // Refetch data on "CashBillCreated" event
    };

    //Event Listner for CashBillDeleted
    const cashBillDeletedListener = () => {
      console.log("CashBillDeleted event triggered");
      fetchInvoiceData(); // Refetch data on "CashBillDeleted" event
      setCashBill(null);
      setInvoiceData([]);
    };

    // Subscribe to the events
    console.log("Subscribing to CashBillCreated and CashBillDeleted events...");
    emitter.on("CashBillCreated", cashBillCreatedListener);
    //Subscribe to cash bill Item created event
    emitter.on("CashBillItemAdded", cashBillCreatedListener);
    emitter.on("CashBillItemUpdated", cashBillCreatedListener);
    emitter.on("CashBillItemRemoved", cashBillCreatedListener);
    emitter.on("CashBillDeleted", cashBillDeletedListener);

    // Cleanup: Unsubscribe from the events when the component unmounts
    return () => {
      console.log("Unsubscribing from events...");
      emitter.off("CashBillCreated", cashBillCreatedListener);
      emitter.off("CashBillItemAdded", cashBillCreatedListener);
      emitter.off("CashBillItemRemoved", cashBillCreatedListener);
      emitter.off("CashBillItemUpdated", cashBillCreatedListener);
      emitter.off("CashBillDeleted", cashBillDeletedListener);
    };
  }, []); // Empty dependency array means this effect runs only once (on mount)

  // API call to change the status of the cash bill
  const updateCashBillStatus = async () => {
    try {
      const response = await axiosInstance.put(
        "/api/cashbills/updateCashBillStatus"
      );
      console.log(response.data);
      toast.success("Bill issued successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error issuing the bill.");
    }
  };

  // Helper functions
  const calculateGrossPrice = (unitPrice, discount) => {
    const discountAmount = (unitPrice * discount) / 100;
    return unitPrice - discountAmount;
  };

  const calculateTotalPrice = (grossPrice, quantity) => grossPrice * quantity;

  // Handle issue cash bill
  const handleIssueCashBill = async () => {
    await updateCashBillStatus(); // Issue the cash bill
    setNewInvoiceCreated(true); // Set the flag to trigger fetching new data
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return invoiceData.reduce((subtotal, item) => {
      const grossPrice = calculateGrossPrice(item.unitPrice, item.discount);
      const totalPrice = calculateTotalPrice(grossPrice, item.quantity);
      return subtotal + totalPrice;
    }, 0);
  };

  // Ensure the data is re-fetched after new invoice creation
  useEffect(() => {
    if (newInvoiceCreated) {
      fetchInvoiceData(); // Fetch the latest data after a new invoice is created
      setNewInvoiceCreated(false); // Reset the flag
    }
  }, [newInvoiceCreated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (cashBill === null) {
    return <div className="text-2xl font-f1 ml-2 italic" >Create New Cash Bill To Add Items</div>;
  }

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-gray-50 relative">
      {/* Bill Type Label at the top right */}
      <div className="absolute top-4 right-4 px-4 py-2">
        <Chip className="font-f1" color="primary">
          {" "}
          {cashBill.billType}
        </Chip>
      </div>

      <h1 className="text-2xl font-f1 mb-6 text-center">
        Invoice - {cashBill.invoiceNumber}
      </h1>
      <Table aria-label="Invoice Table" className="font-f1">
        <TableHeader>
          <TableColumn>Item Name</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Unit Price</TableColumn>
          <TableColumn>Discount (%)</TableColumn>
          <TableColumn>Gross Price</TableColumn>
          <TableColumn>Total Price</TableColumn>
          <TableColumn>Action</TableColumn>
          <TableColumn>Action</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {invoiceData.map((item, index) => {
            const grossPrice = calculateGrossPrice(
              item.unitPrice,
              item.discount
            );
            const totalPrice = calculateTotalPrice(grossPrice, item.quantity);

            // Conditional rendering based on itemModel
            let itemName = "";
            if (item.stock.itemModel === "Gasket") {
              itemName =
                item.stock.item.engine.engine_name +
                " " +
                item.stock.item.packing_type +
                " " +
                item.stock.item.material_type +
                " " +
                item.stock.item.vendor.vendor_name +
                " " +
                item.stock.item.brand.brand_name; // Show relevant name for Gasket
            } else {
              itemName = item.stock.item.part_number; // Default item name (can be customized based on your data)
            }

            return (
              <TableRow key={index}>
                <TableCell>{itemName}</TableCell>{" "}
                <TableCell>{item.quantity}</TableCell>
                <TableCell>Rs.{item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{item.discount}%</TableCell>
                <TableCell>Rs.{grossPrice.toFixed(2)}</TableCell>
                <TableCell>Rs.{totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  <RemoveButon
                    StockId={item.stock._id}
                    cashBillItemId={item._id}
                  />
                </TableCell>
                <TableCell>
                  <EditButton
                    cashBillItemId={item._id}
                    stockId={item.stock._id}
                    quantity={item.quantity}
                    unitPrice={item.unitPrice}
                    discount={item.discount}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Subtotal Section */}
      <div className="mt-6 flex ">
        <h2 className="text-xl font-f1">Subtotal - </h2>
        <p className="text-xl font-f1"> Rs. {calculateSubtotal().toFixed(2)}</p>
      </div>

      {/* Issue and Delete Buttons */}
      <div className="mt-6 flex justify-between font-f1">
        <Button onClick={handleIssueCashBill} color="primary" >
          Issue Cash Bill
        </Button>
        <DeleteCashBillButton cashBillId={cashBill._id} />
      </div>
    </div>
  );
};

export default CashInvoice;
