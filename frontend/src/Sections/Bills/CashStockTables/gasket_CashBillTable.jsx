import React, { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { Button, Input, Chip } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";

//Buttons
import AddButton from "./add_cashbillitem_btn.jsx";

//Emitter
import emitter from "../../../../util/emitter";

const Gasket_CashBillTable = () => {
  const [stocks, setStocks] = useState([]); // State to hold the stock data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search query
  const [filteredStocks, setFilteredStocks] = useState([]); // State to hold filtered stocks
  const [userBranch, setUserBranch] = useState("Kandy"); // Assuming logged-in user's branch (replace with actual logic)

  // Fetching the stocks data from the backend API
  useEffect(() => {
    // Fetch stocks when the component mounts or when userBranch changes
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

    const handleCashBillItemAdded = () => {
      // Re-fetch data when CashBillItemAdded event is emitted
      setLoading(true); // Optionally, set loading to true while re-fetching
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
    };

    // Listen for the "CashBillItemAdded" event and trigger the handler
    emitter.on("CashBillItemAdded", handleCashBillItemAdded);
    emitter.on("CashBillItemRemoved", handleCashBillItemAdded);

    // Cleanup the event listener on component unmount
    return () => {
      emitter.off("CashBillItemAdded", handleCashBillItemAdded);
      emitter.off("CashBillItemRemoved", handleCashBillItemAdded);
    };
  }, [userBranch]); // Re-run the effect whenever userBranch changes
  // Re-fetch data when userBranch changes

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

      {/* Table */}
      <div className="overflow-y-auto max-h-[180px]">
        <table className="table-auto w-full border-collapse border border-gray-300 mb-8 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 p-2 text-left">Brand</th>
              <th className="border border-gray-300 p-2 text-left" colSpan={2}>
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => (
              <tr key={stock._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {stock.item.engine.engine_name} {stock.item.packing_type}{" "}
                  {stock.item.material_type}
                  <Chip variant="bordered" color="primary" className="ml-4">
                    {stock.item.vendor.vendor_name}
                  </Chip>
                </td>
                <td className="border border-gray-300 p-2">
                  {stock.item.brand.brand_name}
                </td>
                <td className="border border-gray-300 p-2">{stock.quantity}</td>
                <td className="border border-gray-300 p-2">
                  <AddButton
                    StockId={stock._id}
                    description={
                      stock.item.engine.engine_name +
                      " " +
                      stock.item.packing_type +
                      " " +
                      stock.item.material_type
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gasket_CashBillTable;
