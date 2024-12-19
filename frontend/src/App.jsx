import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import useAuth from "./contexts/authContext/hooks/useAuth"; // Import the custom hook
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import SessionPrompt from "./components/SessionPrompt"; // Import SessionPrompt
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
        {/* <Route path="/signup" element={<Signup />} />
        <Route path="/signupwg" element={<SignupWG />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DeliveryManagement />} />
        <Route path="/deliveryManagement" element={<DeliveryManagement />} />
        <Route path="/crb" element={<CRB />} />
        <Route path="/inventory" element={<Inventory />} /> */}

        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupwg" element={<SignupWG />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DeliveryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/deliveryManagement"
          element={
            <PrivateRoute>
              <DeliveryManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/crb"
          element={
            <PrivateRoute>
              <CRB />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />

      </Routes>

      {/* Render SessionPrompt if session is about to expire */}
      {promptExtendSession && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        ><SessionPrompt onExtend={handleExtendSession} onLogout={handleLogout} /></div>
      )}
    </AuthProvider>
  );
};

export default App;
