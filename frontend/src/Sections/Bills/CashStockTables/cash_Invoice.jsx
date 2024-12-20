import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button } from "@nextui-org/react";

const CashInvoice = () => {
  // Dummy invoice data
  const invoiceData = [
    { name: "Item 1", quantity: 2, unitPrice: 100, discount: 10 },
    { name: "Item 2", quantity: 1, unitPrice: 150, discount: 5 },
    { name: "Item 3", quantity: 3, unitPrice: 200, discount: 20 },
  ];

  const calculateGrossPrice = (unitPrice, discount) => {
    const discountAmount = (unitPrice * discount) / 100;
    return unitPrice - discountAmount;
  };

  const calculateTotalPrice = (grossPrice, quantity) => grossPrice * quantity;

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">Invoice</h1>
      <Table aria-label="Invoice Table">
        <TableHeader>
          <TableColumn>Item Name</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Unit Price</TableColumn>
          <TableColumn>Discount (%)</TableColumn>
          <TableColumn>Gross Price</TableColumn>
          <TableColumn>Total Price</TableColumn>
          <TableColumn className="colspan">Action</TableColumn>
        </TableHeader>
        <TableBody>
          {invoiceData.map((item, index) => {
            const grossPrice = calculateGrossPrice(
              item.unitPrice,
              item.discount
            );
            const totalPrice = calculateTotalPrice(grossPrice, item.quantity);

            return (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                <TableCell>{item.discount}%</TableCell>
                <TableCell>${grossPrice.toFixed(2)}</TableCell>
                <TableCell>${totalPrice.toFixed(2)}</TableCell>
                <TableCell><Button>Remove</Button></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CashInvoice;
