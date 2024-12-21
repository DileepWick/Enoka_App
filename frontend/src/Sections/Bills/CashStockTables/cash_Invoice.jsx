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

//Emitter
import emitter from "../../../../util/emitter.js";

//Buttons
import RemoveButon from "./remove_button.jsx";
import EditButton from "./update_cash_bill_item_btn.jsx";
import DeleteCashBillButton from "./delete_cash_bill.jsx"

const CashInvoice = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billType, setBillType] = useState("Cash Bill");
  const [cashBill, setCashBill] = useState(null);

  // Function to fetch invoice data
  const fetchInvoiceData = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/cashbills/getLatestPendingCashBill"
      );
      const data = response.data;

      if (data && data.cashBillItems) {
        setInvoiceData(data.cashBillItems);
        setCashBill(data.cashBill)
        //Set Billtype
        setBillType(data.billType);
      } else {
        setError("No items found in the invoice.");
      }
    } catch (error) {
      setError("Error fetching invoice data.");
    } finally {
      setLoading(false);
    }
  };

  //Register the emitter for new cash bill creation
  emitter.on("CashBillCreated", fetchInvoiceData);

  //Clean up the emitter on component unmount
  useEffect(() => {
    return () => {
      emitter.off("CashBillCreated", fetchInvoiceData);
    };
  }, []);

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

  // Fetch invoice data on component mount
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const calculateGrossPrice = (unitPrice, discount) => {
    const discountAmount = (unitPrice * discount) / 100;
    return unitPrice - discountAmount;
  };

  const calculateTotalPrice = (grossPrice, quantity) => grossPrice * quantity;

  const handleIssueCashBill = () => {
    updateCashBillStatus();
    fetchInvoiceData();
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return invoiceData.reduce((subtotal, item) => {
      const grossPrice = calculateGrossPrice(item.unitPrice, item.discount);
      const totalPrice = calculateTotalPrice(grossPrice, item.quantity);
      return subtotal + totalPrice;
    }, 0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Create New Cash Bill</div>;
  }

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-gray-50 relative">
      {/* Bill Type Label at the top right */}
      <div className="absolute top-4 right-4  px-4 py-2 ">
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
                <TableCell>
                  {itemName} - {item._id}
                </TableCell>{" "}
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
      <div className="mt-6 flex justify-between">
        <Button onClick={handleIssueCashBill} color="success">
          Issue Cash Bill
        </Button>
        <DeleteCashBillButton cashBillId={cashBill._id} />
      </div>
    </div>
  );
};

export default CashInvoice;
