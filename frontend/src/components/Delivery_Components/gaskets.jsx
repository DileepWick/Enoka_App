import React, { useState, useEffect } from "react";
import { fetchGaskets } from "../../services/inventoryServices";
import axios from "axios";
import ItemAddToDeliveryButton from "./itemAddToDeliveryButton";
import {Spinner} from "@nextui-org/react";

const GasketList = ({ triggerFetch }) => {
  const [gaskets, setGaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGaskets, setFilteredGaskets] = useState([]);
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    const fetchLatestDelivery = async () => {
      try {
        const latestDelivery = await axios.get(
          "http://localhost:8098/api/delivery/deliveries/latest"
        );
        const fetchedDeliveryData = latestDelivery.data.data;

        if (fetchedDeliveryData) {
          setDelivery(fetchedDeliveryData);
        } else {
          alert("No pending delivery found");
        }
      } catch (error) {
        console.error("Error fetching the latest pending delivery:", error);
      }
    };

    fetchLatestDelivery();
  }, [triggerFetch]);

  useEffect(() => {
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
  }, [triggerFetch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = gaskets.filter(
        (gasket) =>
          gasket.part_number.toLowerCase().includes(value.toLowerCase()) ||
          gasket.material_type.toLowerCase().includes(value.toLowerCase()) ||
          gasket.packing_type.toLowerCase().includes(value.toLowerCase()) ||
          gasket.engine?.engine_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          gasket.brand?.brand_name
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          gasket.Vendor?.vendor_name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGaskets(filtered);
    } else {
      setFilteredGaskets(gaskets);
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {delivery ? (
        <>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Gasket List for {delivery._id}</h1>

          <input
            type="text"
            placeholder="Search gaskets"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border p-2 mb-4 rounded"
          />

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Part Number</th>
                  <th className="p-2 text-left hidden sm:table-cell">Material Type</th>
                  <th className="p-2 text-left hidden md:table-cell">Packing Type</th>
                  <th className="p-2 text-left hidden lg:table-cell">Engine</th>
                  <th className="p-2 text-left hidden lg:table-cell">Brand</th>
                  <th className="p-2 text-left hidden xl:table-cell">Vendor</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGaskets.map((gasket) => (
                  <tr key={gasket._id} className="border-b">
                    <td className="p-2">{gasket.part_number}</td>
                    <td className="p-2 hidden sm:table-cell">{gasket.material_type}</td>
                    <td className="p-2 hidden md:table-cell">{gasket.packing_type}</td>
                    <td className="p-2 hidden lg:table-cell">{gasket.engine?.engine_name}</td>
                    <td className="p-2 hidden lg:table-cell">{gasket.brand?.brand_name}</td>
                    <td className="p-2 hidden xl:table-cell">{gasket.vendor?.vendor_name}</td>
                    <td className="p-2">
                      <ItemAddToDeliveryButton
                        item_id={gasket._id}
                        delivery_id={delivery._id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view for detailed information */}
          <div className="sm:hidden mt-4 space-y-4">
            {filteredGaskets.map((gasket) => (
              <div key={gasket._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-lg mb-2">{gasket.part_number}</h3>
                <p className="mb-1"><span className="font-semibold">Material:</span> {gasket.material_type}</p>
                <p className="mb-1"><span className="font-semibold">Packing:</span> {gasket.packing_type}</p>
                <p className="mb-1"><span className="font-semibold">Engine:</span> {gasket.engine?.engine_name}</p>
                <p className="mb-1"><span className="font-semibold">Brand:</span> {gasket.brand?.brand_name}</p>
                <p className="mb-1"><span className="font-semibold">Vendor:</span> {gasket.vendor?.vendor_name}</p>
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
        <div className="text-center py-4">
          
          Waiting for delivery creation</div>
      )}
    </div>
  );
};

export default GasketList;

