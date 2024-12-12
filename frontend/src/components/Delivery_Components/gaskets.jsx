import React, { useState, useEffect, useMemo } from "react";
import { fetchGaskets } from "../../services/inventoryServices";
import axios from "axios";
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

//Util
import emitter from "../../../util/emitter.js";

const GasketList = ({}) => {
  // State variables
  const [gaskets, setGaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGaskets, setFilteredGaskets] = useState([]);
  const [delivery, setDelivery] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 1000;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return Array.isArray(filteredGaskets) ? filteredGaskets.slice(start, end) : [];
  }, [page, filteredGaskets]);

  // Fetch the latest pending delivery
  useEffect(() => {
    const fetchLatestDelivery = async () => {
      try {
        const latestDelivery = await axios.get(
          "https://enokaback-6acbbcbf5c24.herokuapp.com/api/delivery/deliveries/latest"
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
        "Delivery removed event received! Fetching latest delivery in gaskets..."
      );
      setDelivery(null);
      fetchLatestDelivery();
      getGaskets();
      
    };

    // Subscribe to both events
    emitter.on("deliveryCreated", handleDeliveryCreated);
    emitter.on("deliveryRemoved", handleDeliveryRemoved);
    emitter.on("deliveryStarted", handleDeliveryRemoved);

    // Cleanup listeners on unmount
    return () => {
      emitter.off("deliveryCreated", handleDeliveryCreated);
      emitter.off("deliveryRemoved", handleDeliveryRemoved);
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
            className="  p-2 mb-4 "
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
              <Table
                aria-label="Example table with client-side pagination"
                className="font-f1"
              >
                <TableHeader className="border border-gray-300">
                  <TableColumn>Part Number</TableColumn>
                  <TableColumn>Material Type</TableColumn>
                  <TableColumn>Packing Type</TableColumn>
                  <TableColumn>Engine</TableColumn>
                  <TableColumn>Brand</TableColumn>
                  <TableColumn>Vendor</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody className="border border-gray-300">
                  {items.map((gasket) => (
                    <TableRow key={gasket._id}>
                      <TableCell>{gasket.part_number}</TableCell>
                      <TableCell>{gasket.material_type}</TableCell>
                      <TableCell>{gasket.packing_type}</TableCell>
                      <TableCell>{gasket.engine?.engine_name}</TableCell>
                      <TableCell>{gasket.brand?.brand_name}</TableCell>
                      <TableCell>{gasket.vendor?.vendor_name}</TableCell>
                      <TableCell>
                        <ItemAddToDeliveryButton
                          item_id={gasket._id}
                          delivery_id={delivery._id}
                          item_description={gasket.description}
                          className="w-full mt-2"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden mt-4 space-y-4">
            {items.map((gasket) => (
              <div key={gasket._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">{gasket.part_number}</h3>
                <p className="mb-1">
                  <span className="font-semibold">Material - </span>
                  {gasket.material_type}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Packing - </span>
                  {gasket.packing_type}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Engine - </span>
                  {gasket.engine?.engine_name}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Brand - </span>
                  {gasket.brand?.brand_name}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Vendor - </span>
                  {gasket.vendor?.vendor_name}
                </p>
                <ItemAddToDeliveryButton
                  item_id={gasket._id}
                  delivery_id={delivery._id}
                  className="w-full mt-2"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-4">Waiting for delivery creation</div>
      )}
    </div>
  );
};

export default GasketList;
