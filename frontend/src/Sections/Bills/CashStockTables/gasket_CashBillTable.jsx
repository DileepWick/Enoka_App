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
import { Button, Input } from "@nextui-org/react";
import { Chip } from "@nextui-org/react";

//Buttons
import AddButton from "./add_cashbillitem_btn.jsx";

const Gasket_CashBillTable = () => {
  const [stocks, setStocks] = useState([]); // State to hold the stock data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [filteredStocks, setFilteredStocks] = useState([]); // State to hold filtered stocks
  const [userBranch, setUserBranch] = useState("Kandy"); // Assuming logged-in user's branch (replace with actual logic)

  // Fetching the stocks data from the backend API
  useEffect(() => {
    axiosInstance
      .get("/api/stocks/getAllStocks") // Make sure this matches your backend API URL
      .then((response) => {
        setStocks(response.data); // Set the received data to state
        setFilteredStocks(
          response.data.filter((stock) => stock.branch.name === userBranch)
        ); // Filter stocks by user branch
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
        setError("An error occurred while fetching stocks.");
        setLoading(false);
      });

      
  }, [userBranch]); // Re-fetch data when userBranch changes

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);

    // Filter stocks by description, brand, engine, etc.
    const filtered = stocks.filter((stock) => {
      // Filtering based on the description and the brand name, engine, and vendor fields
      const description =
        stock.item.engine.engine_name +
        " " +
        stock.item.packing_type +
        " " +
        stock.item.material_type +
        " " +
        stock.item.vendor.vendor_name;

      return (
        description.toLowerCase().includes(query.toLowerCase()) ||
        stock.item.brand.brand_name.toLowerCase().includes(query.toLowerCase())
      );
    });

    // Also filter by the user's branch
    setFilteredStocks(
      filtered.filter((stock) => stock.branch.name === userBranch)
    );
  };

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

      {/* Search Bar */}
      <Input
        clearable
        bordered
        label="Search Description"
        placeholder="Search by description, brand, engine, etc."
        className="w-[300px] mb-8"

        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)} // Handle search input change
      />

      <Table aria-label="Example static collection table" >
        <TableHeader>
          <TableColumn>Description</TableColumn>
          <TableColumn>Brand</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredStocks.map((stock) => (
            <TableRow key={stock._id}>
              <TableCell>
                {stock.item.engine.engine_name} {stock.item.packing_type}{" "}
                {stock.item.material_type}
                <Chip variant="bordered" color="primary" className="ml-4">
                  {stock.item.vendor.vendor_name}
                </Chip>
              </TableCell>
              <TableCell>{stock.item.brand.brand_name}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
              <TableCell>
                <AddButton StockId={stock._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Gasket_CashBillTable;
