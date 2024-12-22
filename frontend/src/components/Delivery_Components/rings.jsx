import React, { useState, useEffect, useMemo } from "react";
import { fetchRings } from "../../services/inventoryServices";

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

const RingsList = ({}) => {
  // State variables
  const [rings, setRings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRings, setFilteredRings] = useState([]);
  const [delivery, setDelivery] = useState(null);
  const [senderBranch, setSenderBranch] = useState(""); // New state for sender branch

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 1000;

  // Pagination
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return Array.isArray(filteredRings)
      ? filteredRings.slice(start, end)
      : [];
  }, [page, filteredRings]);

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

    // Fetch rings
    const getRings = async () => {
      try {
        const data = await fetchRings();
        setRings(data);
        setFilteredRings(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch rings");
        setLoading(false);
      }
    };

    getRings();

    // Fetch the delivery initially
    fetchLatestDelivery();

    // Delivery created event handler
    const handleDeliveryCreated = () => {
      console.log(
        "Delivery created event received! Fetching latest delivery in rings...."
      );
      fetchLatestDelivery();
      getRings();
    };

    // Delivery removed event handler
    const handleDeliveryRemoved = () => {
      console.log(
        "Delivery removed event received! Fetching latest delivery in rings... "
      );
      setDelivery(null);
      fetchLatestDelivery();
      getRings();
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

  // Search logic to filter rings based on the search term
  useEffect(() => {
    const filterRings = () => {
      // Apply branch filtering first
      let branchFilteredRings = rings;

      if (senderBranch) {
        branchFilteredRings = rings.map((ring) => ({
          ...ring,
          stock: ring.stock.filter(
            (stock) => stock.branch?.name === senderBranch
          ),
        })).filter((ring) => ring.stock.length > 0); // Keep only rings with stock in the selected branch
      }

      // Apply search filtering on the branch-filtered rings
      if (searchTerm.trim()) {
        const searchWords = searchTerm.toLowerCase().split(/\s+/); // Split by spaces and convert to lowercase

        const searchFilteredRings = branchFilteredRings.filter((ring) => {
          const itemContent = [
            ring.engine?.engine_name,
            ring.sizes,
            ring.brand,
            ring.vendor?.vendor_name,
          ]
            .filter(Boolean) // Remove null or undefined values
            .join(" ")
            .toLowerCase();

          return searchWords.every((word) => itemContent.includes(word));
        });

        setFilteredRings(searchFilteredRings);
      } else {
        setFilteredRings(branchFilteredRings); // If no search term, show only branch-filtered rings
      }
    };

    filterRings();
  }, [searchTerm, senderBranch, rings]);

  // Filter rings by sender branch
  useEffect(() => {
    if (senderBranch) {
      const filteredByBranch = rings.map((ring) => ({
        ...ring,
        stock: ring.stock.filter(
          (stock) => stock.branch?.name === senderBranch
        ),
      }));
      setFilteredRings(filteredByBranch);
    } else {
      setFilteredRings(rings); // Show all rings if no sender branch is selected
    }
  }, [senderBranch, rings]);

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
            <h2 className="text-sm font-f1 mb-2 w-[300px]">Search Rings</h2>
            <Input
              type="text"
              placeholder="Search rings"
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
                  {items.map((ring, index) => (
                    <tr key={ring._id} className="border border-gray-300">
                      {/* Part Number */}
                      <td className="border border-gray-300 px-4 py-2">
                        {ring.part_number}
                      </td>

                      {/* Description */}
                      <td className="border border-gray-300 px-4 py-2">
                        {ring.engine?.engine_name || "N/A"}{" "}
                        {ring.sizes || "N/A"}{" "}
                        <Chip className="ml-8" variant="bordered" color="primary">
                          {ring.vendor?.vendor_name || "N/A"}
                        </Chip>
                      </td>

                      {/* Brand */}
                      <td className="border border-gray-300 px-4 py-2">
                        {ring.brand || "N/A"}
                      </td>

                      {/* Branch */}
                      <td className="border border-gray-300 px-4 py-2">
                        {ring.stock.map((stock) => (
                          <div key={stock._id} className="py-1">
                            {stock.branch?.name || "N/A"}
                          </div>
                        ))}
                      </td>

                      {/* Quantity */}
                      <td className="border border-gray-300 px-4 py-2">
                        {ring.stock.reduce(
                          (total, stock) => total + stock.quantity,
                          0
                        )}
                      </td>

                      {/* Actions */}
                      <td className="border border-gray-300 px-4 py-2">
                        <ItemAddToDeliveryButton
                          item_id={ring._id}
                          delivery_id={delivery._id}
                          item_description={ring.part_number}
                          stockId={ring.stock[0]._id} // Assuming one stock is selected for simplicity
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
        <div className="text-center">No delivery in progress.</div>
      )}
    </div>
  );
};

export default RingsList;
