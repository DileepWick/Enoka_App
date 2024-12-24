import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Button, Chip, Input ,Progress} from "@nextui-org/react";

//Api
import { getReceivedDeliveries } from "@/services/deliveryServices";

//Emitter
import emitter from "../../../util/emitter.js";

//Buttons
import ViewDetailsBtn from "./buttons/viewDetailsBtn";

const ReceivedDeliveryTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [branchFilter, setBranchFilter] = useState(""); // Filter by branch

  // Fetch received deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getReceivedDeliveries();
        const result = response.data;
        if (result.success) {
          setDeliveries(result.data);
          setFilteredDeliveries(result.data); // Set filtered deliveries initially
        } else {
          throw new Error("Failed to fetch deliveries");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();

    // Delivery Completed Event Handler
    const handleDeliveryCompleted = () => {
      console.log("Delivery Completed event received! Fetching Deliveries...");
      fetchDeliveries();
    };

    // Subscribe to the 'deliveryItemReceived' event
    emitter.on("deliveryCompleted", handleDeliveryCompleted);

    // Unsubscribe from the event when the component unmounts
    return () => {
      emitter.off("deliveryCompleted", handleDeliveryCompleted);
    };
  }, []);

  // Handle search input and filters
  const handleSearchAndFilters = () => {
    const term = searchTerm.toLowerCase();
    const filtered = deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.deliveryId.toLowerCase().includes(term) ||
        delivery.senderBranch.toLowerCase().includes(term) ||
        delivery.receiverBranch.toLowerCase().includes(term);

      const matchesStatus = statusFilter
        ? delivery.status.toLowerCase() === statusFilter.toLowerCase()
        : true;

      const matchesBranch =
        branchFilter &&
        (delivery.senderBranch.toLowerCase() === branchFilter.toLowerCase() ||
          delivery.receiverBranch.toLowerCase() === branchFilter.toLowerCase())
          ? true
          : true;

      return matchesSearch && matchesStatus && matchesBranch;
    });

    setFilteredDeliveries(filtered);
  };

  // Handle search term change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    handleSearchAndFilters();
  };

  // Handle filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    handleSearchAndFilters();
  };

  const handleBranchFilter = (e) => {
    setBranchFilter(e.target.value);
    handleSearchAndFilters();
  };

  if (loading) {
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
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }} className="font-f1">
      {/* Search Bar */}
      <div style={{ marginBottom: "1rem" }}>
        <Input
          clearable
          underlined
          label="Search Deliveries"
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Search deliveries by delivery ID, sender, or receiver branch"
        />
      </div>

      {filteredDeliveries.length > 0 ? (
        <Table aria-label="Received Deliveries Table">
          <TableHeader>
            <TableColumn>Delivery Code</TableColumn>
            <TableColumn>From</TableColumn>
            <TableColumn>To</TableColumn>
            <TableColumn>Started Date</TableColumn>
            <TableColumn>Received Date</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn colSpan={2}>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.map((delivery) => (
              <TableRow key={delivery._id}>
                <TableCell>{delivery.deliveryId}</TableCell>
                <TableCell>{delivery.senderBranch}</TableCell>
                <TableCell>{delivery.receiverBranch}</TableCell>
                <TableCell>
                  {new Date(delivery.deliveryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(delivery.receivedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip size="lg" color="primary">
                    {delivery.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <ViewDetailsBtn deliveryId={delivery._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="font-f1">
          <p>No Received Deliveries Found</p>
        </div>
      )}
    </div>
  );
};

export default ReceivedDeliveryTable;
