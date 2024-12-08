import React from "react";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/authContext";

// Pages
import Home from "./pages/Home";

import Header from "./pages/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupWG from "./pages/SignupWG";

import CRB from "./pages/crb"


import DeliverySystem from "./pages/delivery_system";

const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupwg" element={<SignupWG />} />
        <Route path="/delivery_system" element={<DeliverySystem />} />
        <Route path="/crb" element={<CRB />} />
      </Routes>
    </AuthProvider>

  );
};

export default App;
