import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

// Pages
import Home from "./pages/Home";
import Header from "./pages/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DeliverySystem from "./pages/DeliverySystem";
import { Dashboard } from "./pages/Dashboard";


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/deliverySystem" element={<DeliverySystem />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
