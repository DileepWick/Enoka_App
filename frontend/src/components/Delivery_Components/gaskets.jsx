import React, { useState, useEffect, useMemo } from "react";
import { fetchGaskets } from "../../services/inventoryServices";

// Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";

import ItemAddToDeliveryButton from "./buttons/itemAddToDeliveryButton";
import { Chip, Progress } from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react";

// Util
import emitter from "../../../util/emitter.js";

const GasketList = ({}) => {
  // State variables
  const [gaskets, setGaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGaskets, setFilteredGaskets] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [senderBranch, setSenderBranch] = useState(""); // New state for sender branch

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 1000;

  // Pagination
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return Array.isArray(filteredGaskets)
      ? filteredGaskets.slice(start, end)
      : [];
  }, [page, filteredGaskets]);

  // Fetch the latest pending delivery
  useEffect(() => {
    const fetchLatestDelivery = async () => {
      setLoading(true);
      try {
        const latestDelivery = await axiosInstance.get(
          "/api/delivery/deliveries/latest"
        );
        const fetchedDeliveryData = latestDelivery.data.data;

        if (fetchedDeliveryData) {
          setDelivery(fetchedDeliveryData);
          setSenderBranch(fetchedDeliveryData.senderBranch);
        } else {
          //alert("No pending delivery found");//
        }
      } catch (error) {
        console.error("Error fetching the latest pending delivery:", error);
      }finally{
        setLoading(false);
      }
    };

    // Fetch gaskets
    const getGaskets = async () => {
      try {
        const data = await fetchGaskets();
        setGaskets(data);
        setFilteredGaskets(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch gaskets");
        setLoading(false);
      }
    };

    getGaskets();

    // Fetch the delivery initially
    fetchLatestDelivery();

    // Delivery created event handler
    const handleDeliveryCreated = () => {
      console.log(
        "Delivery created event received! Fetching latest delivery in gaskets...."
      );
      fetchLatestDelivery();
      getGaskets();
    };

    // Delivery removed event handler
    const handleDeliveryRemoved = () => {
      console.log(
        "Delivery removed event received! Fetching latest delivery in gaskets... "
      );
      setDelivery(null);
      fetchLatestDelivery();
      getGaskets();
    };

    // Subscribe to both events
    emitter.on("deliveryCreated", handleDeliveryCreated);
    emitter.on("deliveryRemoved", handleDeliveryRemoved);
    emitter.on("deliveryStarted", handleDeliveryRemoved);
    emitter.on("deliveryItemCreated", handleDeliveryCreated);
    emitter.on("deliveryItemQuantityUpdated", handleDeliveryCreated);
    emitter.on("deliveryItemRemoved", handleDeliveryCreated);

    // Subscribe to the sender branch change event
    emitter.on("fromBranchSelected", (branch) => {
      setSenderBranch(branch);
    });

    // Cleanup listeners on unmount
    return () => {
      emitter.off("deliveryCreated", handleDeliveryCreated);
      emitter.off("deliveryRemoved", handleDeliveryRemoved);
      emitter.off("fromBranchSelected");
    };
  }, []);

  // Search logic to filter gaskets based on the search term
  useEffect(() => {
    const filterGaskets = () => {
      // Apply branch filtering first
      let branchFilteredGaskets = gaskets;
  
      if (senderBranch) {
        branchFilteredGaskets = gaskets.map((gasket) => ({
          ...gasket,
          stock: gasket.stock.filter(
            (stock) => stock.branch?.name === senderBranch
          ),
        })).filter((gasket) => gasket.stock.length > 0); // Keep only gaskets with stock in the selected branch
      }
  
      // Apply search filtering on the branch-filtered gaskets
      if (searchTerm.trim()) {
        const searchWords = searchTerm.toLowerCase().split(/\s+/); // Split by spaces and convert to lowercase
  
        const searchFilteredGaskets = branchFilteredGaskets.filter((gasket) => {
          const itemContent = [
            gasket.engine?.engine_name,
            gasket.packing_type,
            gasket.material_type,
            gasket.vendor?.vendor_name,
          ]
            .filter(Boolean) // Remove null or undefined values
            .join(" ")
            .toLowerCase();
  
          return searchWords.every((word) => itemContent.includes(word));
        });
  
        setFilteredGaskets(searchFilteredGaskets);
      } else {
        setFilteredGaskets(branchFilteredGaskets); // If no search term, show only branch-filtered gaskets
      }
    };
  
    filterGaskets();
  }, [searchTerm, senderBranch, gaskets]);
  
  // Filter gaskets by sender branch
  useEffect(() => {
    if (senderBranch) {
      const filteredByBranch = gaskets.map((gasket) => ({
        ...gasket,
        stock: gasket.stock.filter(
          (stock) => stock.branch?.name === senderBranch
        ),
      }));
      setFilteredGaskets(filteredByBranch);
    } else {
      setFilteredGaskets(gaskets); // Show all gaskets if no sender branch is selected
    }
  }, [senderBranch, gaskets]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading)
    return (
      <div>
        {" "}
        <Progress
          isIndeterminate
          aria-label="Loading data..."
          className="w-full font-f1"
          size="sm"
          label="Retrieving information, just a moment..."
        />
      </div>
    );
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 font-f1">
      {delivery ? (
        <>
          <div className="mb-6">
            <h2 className="text-sm font-f1 mb-2 w-[300px]">Search Gaskets</h2>
            <Input
              type="text"
              placeholder="Search gaskets"
              value={searchTerm}
              onChange={handleSearch}
              variant="bordered"
              className="font-f1 w-[300px]"
              fullWidth
              size="md"
            />
          </div>

          {/* Scrollable Table */}
          <div className="overflow-x-auto">
            <div className="max-h-64 overflow-y-auto rounded border border-gray-300">
              {/* Table */}
              <table className="font-f1 w-full border-collapse border border-gray-300 text-sm">
                <thead className="border border-gray-300">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Part Number
                    </th>
                    <th className="border border-gray-300 px-4 py-2">Item</th>
                    <th className="border border-gray-300 px-4 py-2">Brand</th>
                    <th className="border border-gray-300 px-4 py-2">Branch</th>
                    <th className="border border-gray-300 px-4 py-2">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((gasket, index) => (
                    <tr key={gasket._id} className="border border-gray-300">
                      {/* Part Number */}
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.part_number}
                      </td>

                      {/* Description */}
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.engine?.engine_name || "N/A"}{" "}
                        {gasket.packing_type || "N/A"}{" "}
                        {gasket.material_type || "N/A"}{" "}
                        <Chip
                          className="ml-8"
                          variant="bordered"
                          color="primary"
                        >
                          {gasket.vendor?.vendor_name || "N/A"}
                        </Chip>
                      </td>

                      {/* Brand */}
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.brand?.brand_name || "N/A"}
                      </td>

                      {/* Branch */}
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.stock.map((stock) => (
                          <div key={stock._id} className="py-1">
                            {stock.branch?.name || "N/A"}
                          </div>
                        ))}
                      </td>

                      {/* Quantity */}
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.stock.map((stock) => (
                          <div key={stock._id} className="py-1">
                            {stock.quantity}
                          </div>
                        ))}
                      </td>

                      {/* Actions */}
                      <td className="border border-gray-300 px-4 py-2">
                        <ItemAddToDeliveryButton
                          item_id={gasket._id}
                          delivery_id={delivery._id}
                          item_description={gasket.part_number}
                          stockId={gasket.stock[0]._id} // Assuming one stock is selected for simplicity
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div>No active delivery found</div>
      )}
    </div>
  );
};

export default GasketList;
