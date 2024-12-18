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
import { getOnDeliveryDeliveries } from "@/services/deliveryServices";

//Emitter
import emitter from "../../../util/emitter.js";

//Buttons
import ViewDetailsBtn from "./buttons/viewDetailsBtn";
import ReceiveBtn from "./buttons/receiveBtn";

const OnDeliveryTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  // Fetch on deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getOnDeliveryDeliveries();
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

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = deliveries.filter((delivery) =>
      delivery.deliveryId.toLowerCase().includes(term) ||
      delivery.senderBranch.toLowerCase().includes(term) ||
      delivery.receiverBranch.toLowerCase().includes(term)
    );
    setFilteredDeliveries(filtered);
  };

  if (loading) {
    return       <div>
    {" "}
    <Progress
      isIndeterminate
      aria-label="Loading data..."
      className="w-full font-f1"
      size="sm"
      label="Retrieving information, just a moment..."
    />
  </div>;
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
        <Table aria-label="On Delivery Table">
          <TableHeader>
            <TableColumn>Delivery Code</TableColumn>
            <TableColumn>From</TableColumn>
            <TableColumn>To</TableColumn>
            <TableColumn>Started Date</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn >View Delivery Items</TableColumn>
            <TableColumn >Receive Items</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery._id}>
                  <TableCell>{delivery.deliveryId}</TableCell>
                  <TableCell>{delivery.senderBranch}</TableCell>
                  <TableCell>{delivery.receiverBranch}</TableCell>
                  <TableCell>
                    {new Date(delivery.deliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip color="primary" variant="dot" size="lg">
                      {delivery.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <ViewDetailsBtn deliveryId={delivery._id} />
                  </TableCell>
                  <TableCell>
                    <ReceiveBtn deliveryId={delivery._id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No deliveries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <div className="font-f1">
          <p>No On Deliveries found</p>
        </div>
      )}
    </div>
  );
};

export default OnDeliveryTable;
