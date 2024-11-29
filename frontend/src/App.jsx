import React from "react";
import { Route, Routes } from "react-router-dom";

//Pages
import Home from "./pages/Home";
import DeliverySystem from "./pages/delivery_system";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/delivery_system" element={<DeliverySystem />} />
    </Routes>
  );
};

export default App;
