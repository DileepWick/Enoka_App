import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

//Sections
import { DeliveryManagement } from "./pages/DeliveryManagementSection";


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/deliveryManagement" element={<DeliveryManagement />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
