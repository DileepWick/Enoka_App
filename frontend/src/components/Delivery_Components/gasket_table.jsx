import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from "@mui/material";
import axios from "axios";

const GasketTable = ({ addToDeliveryList }) => {
  const [gaskets, setGaskets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch gaskets data from the backend
  useEffect(() => {
    const fetchGaskets = async () => {
      try {
        const response = await axios.get("http://localhost:8098/api/gaskets");
        setGaskets(response.data);
      } catch (error) {
        console.error("Error fetching gasket data:", error);
      }
    };

    fetchGaskets();
  }, []);

  // Filter gaskets based on search term
  const filteredGaskets = gaskets.filter((gasket) => {
    const search = searchTerm.toLowerCase();
    return (
      gasket.part_number.toLowerCase().includes(search) ||
      gasket.description.toLowerCase().includes(search) ||
      gasket.material_type.toLowerCase().includes(search) ||
      gasket.packing_type.toLowerCase().includes(search) ||
      gasket.engine_name?.toLowerCase().includes(search) // Add engine_name search
    );
  });

  return (
    <Paper sx={{ padding: 2, backgroundColor: "white" }}>
      <h2>Available Gaskets</h2>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        label="Search Gaskets"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Gasket Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Part Number</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Material Type</TableCell>
              <TableCell>Packing Type</TableCell>
              <TableCell>Engine</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGaskets.map((gasket) => (
              <TableRow key={gasket._id}>
                <TableCell>{gasket.part_number}</TableCell>
                <TableCell>{gasket.description}</TableCell>
                <TableCell>{gasket.material_type}</TableCell>
                <TableCell>{gasket.packing_type}</TableCell>
                <TableCell>{gasket.engine.engine_name}</TableCell>
                <TableCell>{gasket.brand.brand_name}</TableCell>
                <TableCell>{gasket.vendor.vendor_name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const quantity = prompt("Enter Quantity:");
                      if (quantity) {
                        addToDeliveryList(gasket, quantity);
                      }
                    }}
                  >
                    Add to Delivery
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GasketTable;
