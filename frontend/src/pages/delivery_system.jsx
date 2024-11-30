import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import BranchSelector from "../components/Delivery_Components/branch_selector";
import GasketTable from "../components/Delivery_Components/gasket_table";
import DeliveryList from "../components/Delivery_Components/delivery_list";
import axios from "axios";

const DeliverySystem = () => {
  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [deliveryList, setDeliveryList] = useState([]);

  // Fetch gaskets from the backend
  const fetchGaskets = async () => {
    try {
      const response = await axios.get("http://localhost:8098/api/gaskets");
      return response.data;
    } catch (error) {
      console.error("Error fetching gaskets", error);
      return [];
    }
  };

  useEffect(() => {
    fetchGaskets();
  }, []);

  // Add gasket to delivery list
  const addToDeliveryList = (gasket, quantity) => {
    setDeliveryList((prevList) => [...prevList, { ...gasket, quantity }]);
  };

  // Remove gasket from delivery list
  const removeFromDeliveryList = (id) => {
    setDeliveryList((prevList) =>
      prevList.filter((item) => item._id !== id) // Assuming `_id` is the unique identifier
    );
  };

  // Start the delivery process
  const startDelivery = async () => {
    if (!fromBranch || !toBranch || deliveryList.length === 0) {
      alert("Please complete all fields before starting the delivery.");
      return;
    }

    const deliveryData = {
      items: deliveryList.map((item) => ({
        item_type: "Gasket", // Assuming we are only handling gaskets for now
        item_id: item._id,
      })),
      branch_from: fromBranch,
      branch_to: toBranch,
      due_arrival: new Date(), // Or some other date format
    };

    try {
      const response = await axios.post(
        "http://localhost:8098/api/delivery",
        deliveryData
      );
      console.log("Delivery started successfully:", response.data);
      alert("Delivery started successfully!");
    } catch (error) {
      console.error("Error starting the delivery", error);
      alert("There was an error starting the delivery.");
    }
  };

  return (
    <Container sx={{ padding: 3, maxWidth: "lg" }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 4,
          color: "black",
        }}
      >
        Delivery Management System
      </Typography>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <BranchSelector
          fromBranch={fromBranch}
          toBranch={toBranch}
          setFromBranch={setFromBranch}
          setToBranch={setToBranch}
        />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <GasketTable addToDeliveryList={addToDeliveryList} />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <DeliveryList
          deliveryList={deliveryList}
          removeFromDeliveryList={removeFromDeliveryList}
          startDelivery={startDelivery}
        />
      </Paper>
    </Container>
  );
};

export default DeliverySystem;
