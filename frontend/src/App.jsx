import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import useAuth from "./hooks/useAuth"; // Import the custom hook
import SessionPrompt from "./components/SessionPrompt";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupWG from "./pages/SignupWG";
import CRB from "./pages/crb";

// Sections
import { DeliveryManagement } from "./pages/DeliveryManagementSection";
import Inventory from "./pages/Inventory-Management";

const App = () => {
  const { user, promptExtendSession, extendSession } = useAuth();

  const handleExtendSession = () => {
    extendSession();
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
    window.location.href = '/login'; // Redirect to login after logout
  };


  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<DeliveryManagement />} />
        <Route path="/login" element={<Login />} />
        <Route path="/deliveryManagement" element={<DeliveryManagement />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupwg" element={<SignupWG />} />
        <Route path="/crb" element={<CRB />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>

      {/* Render SessionPrompt if session is about to expire */}
      {promptExtendSession && (
        <SessionPrompt onExtend={handleExtendSession} onLogout={handleLogout} />
      )}
    </AuthProvider>
  );
};

export default App;
