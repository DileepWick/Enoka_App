import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
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

const CashBills = () => {
  const [stocks, setStocks] = useState([]); // State to hold the stock data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error

  // Fetching the stocks data from the backend API
  useEffect(() => {
    axiosInstance
      .get("/api/stocks/getAllStocks") // Make sure this matches your backend API URL
      .then((response) => {
        setStocks(response.data); // Set the received data to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
        setError("An error occurred while fetching stocks.");
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  // Render loading spinner or error message if data is not loaded yet
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if there's an error
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="font-f1">
      <h1>Stocks Table</h1>
      <Table aria-label="Example static collection table" className="w-[800px]">
        <TableHeader>
        <TableColumn>Branch</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Brand</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <TableRow key={stock._id}>
                <TableCell>{stock.branch.name}</TableCell>
                <TableCell>{stock.item.engine.engine_name} {stock.item.packing_type} {stock.item.material_type}<Chip>{stock.item.vendor.vendor_name}</Chip></TableCell>
                <TableCell>{stock.item.brand.brand_name}</TableCell>
                <TableCell>{stock.quantity}</TableCell>
                <TableCell>
                  <Button>Add</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CashBills;
