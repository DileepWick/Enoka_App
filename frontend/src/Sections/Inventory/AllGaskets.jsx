import { Tabs, Tab, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";

const AllGaskets = () => {
  // State variables
  const [gaskets, setGaskets] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchGaskets = async () => {
      try {
        const response = await axiosInstance.get("/api/gaskets");
        setGaskets(response.data);
      } catch (error) {
        console.error("Error fetching gaskets:", error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/api/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchGaskets();
    fetchBranches();
  }, []);

  // Filter gaskets based on selected branch
  const filteredGaskets = selectedBranch
    ? gaskets.filter((gasket) =>
        gasket.stock.some((stock) => stock.branch?.name === selectedBranch)
      )
    : gaskets;

  return (
    <div>
      <label className="font-f1">Select Branch :</label><br></br>
      {/* Branch Filter Tabs */}
      <Tabs
        aria-label="Branch Filter"
        selectedKey={selectedBranch}
        onSelectionChange={setSelectedBranch}
        className="mb-6"
      >
        {branches.map((branch) => (
          <Tab key={branch.name} title={branch.name}>
            {branch.name}
          </Tab>
        ))}
      </Tabs>

      {/* Gaskets Table */}
      <table className="font-f1 w-full border-collapse border border-gray-300">
        <thead className="border border-gray-300">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Part Number</th>
            <th className="border border-gray-300 px-4 py-2">Added By</th>
            <th className="border border-gray-300 px-4 py-2">Stock Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredGaskets.map((gasket) => (
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
                        Quantity
                      </th>
                      <th className="border border-gray-200 px-2 py-1">
                        Last Updated By
                      </th>
                      <th className="border border-gray-200 px-2 py-1">
                        Actions
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
                          {stock.quantity}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {stock.updated_by}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <Button size="sm">Adjust Stock</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllGaskets;
