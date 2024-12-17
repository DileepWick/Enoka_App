import React, { useState, useEffect, useMemo } from "react";
import { fetchGaskets } from "../../services/inventoryServices";

// Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";

import ItemAddToDeliveryButton from "./buttons/itemAddToDeliveryButton";
import { Spinner } from "@nextui-org/react";
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
      try {
        const latestDelivery = await axiosInstance.get(
          "/api/delivery/deliveries/latest"
        );
        const fetchedDeliveryData = latestDelivery.data.data;

        if (fetchedDeliveryData) {
          setDelivery(fetchedDeliveryData);
        } else {
          //alert("No pending delivery found");//
        }
      } catch (error) {
        console.error("Error fetching the latest pending delivery:", error);
      }
    };

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
      if (searchTerm) {
        const filtered = gaskets.filter(
          (gasket) =>
            gasket.part_number
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            gasket.material_type
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            gasket.packing_type
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            gasket.engine?.engine_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            gasket.brand?.brand_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            gasket.vendor?.vendor_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
        setFilteredGaskets(filtered);
      } else {
        setFilteredGaskets(gaskets);
      }
    };

    filterGaskets();
  }, [searchTerm, gaskets]);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 font-f1">
      {delivery ? (
        <>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Gaskets</h1>

          <Input
            type="text"
            size="lg"
            placeholder="Search gaskets"
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 mb-4"
            variant="bordered"
          />

          {/* Scrollable Table */}
          <div className="overflow-x-auto">
            <div
              className="max-h-64 overflow-y-auto rounded border border-gray-300"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              <table className="font-f1 w-full border-collapse border border-gray-300">
                <thead className="border border-gray-300">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">
                      Part Number
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Added By
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Stock Details
                    </th>
                    <th className="border border-gray-300 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((gasket) => (
                    <tr key={gasket._id} className="border border-gray-300">
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.part_number}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {gasket.added_by}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr>
                              <th className="border border-gray-200 px-2 py-1">
                                Branch
                              </th>
                              <th className="border border-gray-200 px-2 py-1">
                                Location
                              </th>
                              <th className="border border-gray-200 px-2 py-1">
                                Quantity
                              </th>
                              <th className="border border-gray-200 px-2 py-1">
                                Last Updated By
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {gasket.stock.map((stock) => (
                              <tr key={stock._id}>
                                <td className="border border-gray-200 px-2 py-1">
                                  {stock.branch?.name || "N/A"}
                                </td>
                                <td className="border border-gray-200 px-2 py-1">
                                  {stock.branch?.location || "N/A"}
                                </td>
                                <td className="border border-gray-200 px-2 py-1">
                                  {stock.quantity}
                                </td>
                                <td className="border border-gray-200 px-2 py-1">
                                  {stock.updated_by}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <ItemAddToDeliveryButton
                          item_id={gasket._id}
                          delivery_id={delivery._id}
                          item_description={gasket.part_number}
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
