import React, { useState, useEffect, useMemo } from "react";
import { fetchBearings } from "../../services/inventoryServices"; // Adjusted service import

// Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";

import ItemAddToDeliveryButton from "./buttons/itemAddToDeliveryButton";
import { Chip, Progress } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

// Util
import emitter from "../../../util/emitter.js";

const BearingsList = ({}) => {
  // State variables
  const [bearings, setBearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBearings, setFilteredBearings] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [senderBranch, setSenderBranch] = useState(""); // New state for sender branch

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 1000;

  // Pagination
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return Array.isArray(filteredBearings) ? filteredBearings.slice(start, end) : [];
  }, [page, filteredBearings]);

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
      } finally {
        setLoading(false);
      }
    };

    // Fetch bearings
    const getBearings = async () => {
      try {
        const data = await fetchBearings(); // Fetch bearings instead of rings
        setBearings(data);
        setFilteredBearings(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch bearings");
        setLoading(false);
      }
    };

    getBearings();

    // Fetch the delivery initially
    fetchLatestDelivery();

    // Delivery created event handler
    const handleDeliveryCreated = () => {
      console.log(
        "Delivery created event received! Fetching latest delivery in bearings...."
      );
      fetchLatestDelivery();
      getBearings();
    };

    // Delivery removed event handler
    const handleDeliveryRemoved = () => {
      console.log(
        "Delivery removed event received! Fetching latest delivery in bearings... "
      );
      setDelivery(null);
      fetchLatestDelivery();
      getBearings();
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

  // Search logic to filter bearings based on the search term
  useEffect(() => {
    const filterBearings = () => {
      // Apply branch filtering first
      let branchFilteredBearings = bearings;

      if (senderBranch) {
        branchFilteredBearings = bearings
          .map((bearing) => ({
            ...bearing,
            stock: bearing.stock.filter(
              (stock) => stock.branch?.name === senderBranch
            ),
          }))
          .filter((bearing) => bearing.stock.length > 0); // Keep only bearings with stock in the selected branch
      }

      // Apply search filtering on the branch-filtered bearings
      if (searchTerm.trim()) {
        const searchWords = searchTerm.toLowerCase().split(/\s+/); // Split by spaces and convert to lowercase

        const searchFilteredBearings = branchFilteredBearings.filter((bearing) => {
          const itemContent = [
            bearing.engine?.engine_name,
            bearing.sizes,
            bearing.brand,
            bearing.vendor?.vendor_name,
          ]
            .filter(Boolean) // Remove null or undefined values
            .join(" ")
            .toLowerCase();

          return searchWords.every((word) => itemContent.includes(word));
        });

        setFilteredBearings(searchFilteredBearings);
      } else {
        setFilteredBearings(branchFilteredBearings); // If no search term, show only branch-filtered bearings
      }
    };

    filterBearings();
  }, [searchTerm, senderBranch, bearings]);

  // Filter bearings by sender branch
  useEffect(() => {
    if (senderBranch) {
      const filteredByBranch = bearings.map((bearing) => ({
        ...bearing,
        stock: bearing.stock.filter(
          (stock) => stock.branch?.name === senderBranch
        ),
      }));
      setFilteredBearings(filteredByBranch);
    } else {
      setFilteredBearings(bearings); // Show all bearings if no sender branch is selected
    }
  }, [senderBranch, bearings]);

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
            <h2 className="text-sm font-f1 mb-2 w-[300px]">Search Bearings</h2>
            <Input
              type="text"
              placeholder="Search bearings"
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
                  {items.map((bearing, index) => (
                    <tr key={bearing._id} className="border border-gray-300">
                      {/* Part Number */}
                      <td className="border border-gray-300 px-4 py-2">
                        {bearing.part_number}
                      </td>

                      {/* Description */}
                      <td className="border border-gray-300 px-4 py-2">
                        {bearing.engine?.engine_name || "N/A"}{" "}
                        {bearing.sizes || "N/A"}{" "}
                        <Chip
                          className="ml-8"
                          variant="bordered"
                          color="primary"
                        >
                          {bearing.vendor?.vendor_name || "N/A"}
                        </Chip>
                      </td>

                      {/* Brand */}
                      <td className="border border-gray-300 px-4 py-2">
                        {bearing.brand || "N/A"}
                      </td>

                      {/* Branch */}
                      <td className="border border-gray-300 px-4 py-2">
                        {bearing.stock.map((stock) => (
                          <div key={stock._id} className="py-1">
                            {stock.branch?.name || "N/A"}
                          </div>
                        ))}
                      </td>

                      {/* Quantity */}
                      <td className="border border-gray-300 px-4 py-2">
                        {bearing.stock.reduce(
                          (total, stock) => total + stock.quantity,
                          0
                        )}
                      </td>

                      {/* Actions */}
                      <td className="border border-gray-300 px-4 py-2">
                        <ItemAddToDeliveryButton
                          item_id={bearing._id}
                          delivery_id={delivery._id}
                          item_description={bearing.part_number}
                          stockId={bearing.stock[0]?._id}
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
        <div className="py-4 text-center font-f1">
          <div className="text-gray-500 text-lg">
            No pending deliveries found.
          </div>
        </div>
      )}
    </div>
  );
};

export default BearingsList;
