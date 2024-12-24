// services/gasketService.js
import axiosInstance from "@/config/axiosInstance";

// Function to fetch all gaskets
export const fetchGaskets = async () => {
  try {
    const response = await axiosInstance.get("/api/gaskets");
    return response.data; // Return the gaskets data
  } catch (error) {
    console.error("Error fetching gaskets:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

// Function to fetch all rings
export const fetchRings = async () => {
  try {
    const response = await axiosInstance.get("/api/rings");
    return response.data; // Return the rings data
  } catch (error) {
    console.error("Error fetching rings:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

// Function to fetch all bearings
export const fetchBearings = async () => {
  try {
    const response = await axiosInstance.get("/api/bearings");
    return response.data; // Return the bearings data
  } catch (error) {
    console.error("Error fetching bearings:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

// Function to update stock
export const updateStock = async (stockId, quantity, updatedBy) => {
  try {
    const response = await axiosInstance.put(
      `/api/stocks/updateStockQuantity/${stockId}`,
      {
        quantity,
        updatedBy,
      }
    );
    return response.data; // Return the updated stock data
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};


// Function to delete a gasket
export const deleteGasket = async (gasketId) => {
  try {
    const response = await axiosInstance.delete(`/api/gaskets/${gasketId}`);
    return response.data; // Return the deleted gasket data
  } catch (error) {
    console.error("Error deleting gasket:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

//Function to delete Ring
export const deleteRing = async (ringId) => {
  try {
    const response = await axiosInstance.delete(`/api/rings/${ringId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ring:", error);
    throw error;
  }
};

//Function to delete Bearings
export const deleteBearing = async (bearingId) => {
  try {
    const response = await axiosInstance.delete(`/api/bearings/${bearingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting bearing:", error);
    throw error;
  }
};