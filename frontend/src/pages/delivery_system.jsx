import React, { useState } from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import BranchSelector from "../components/Delivery_Components/branch_selector";
import GasketTable from "../components/Delivery_Components/gasket_table";
import DeliveryList from "../components/Delivery_Components/delivery_list";

const DeliverySystem = () => {
  const [fromBranch, setFromBranch] = useState("");
  const [toBranch, setToBranch] = useState("");
  const [deliveryList, setDeliveryList] = useState([]);

  const addToDeliveryList = (gasket, quantity) => {
    setDeliveryList((prevList) => [...prevList, { ...gasket, quantity }]);
  };

  const removeFromDeliveryList = (id) => {
    setDeliveryList((prevList) =>
      prevList.filter((item) => item.gasket_id !== id)
    );
  };

  const startDelivery = () => {
    if (!fromBranch || !toBranch || deliveryList.length === 0) {
      alert("Please complete all fields before starting the delivery.");
      return;
    }
    console.log("Delivery Started", { fromBranch, toBranch, deliveryList });
    alert("Delivery started successfully!");
  };

  return (
    <Container sx={{ padding: 3, maxWidth: "lg" }}>
      {/* Title */}
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

      {/* Branch Selector */}
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

      {/* Gasket Table */}
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

      {/* Delivery List */}
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
