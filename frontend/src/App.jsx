import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupWG from "./pages/SignupWG";

import CRB from "./pages/crb"


import DeliverySystem from "./pages/delivery_system";

//Sections
import { DeliveryManagement } from "./pages/DeliveryManagementSection";


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signupwg" element={<SignupWG />} />
        <Route path="/delivery_system" element={<DeliverySystem />} />
        <Route path="/crb" element={<CRB />} />
      </Routes>
    </AuthProvider>


        <Route path="/register" element={<Register />} />
        <Route path="/deliveryManagement" element={<DeliveryManagement />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
