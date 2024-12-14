// services/gasketService.js
import axiosInstance from "@/config/axiosInstance";


// Function to fetch all gaskets
export const fetchGaskets = async () => {
  try {
    const response = await axiosInstance.get("/api/gaskets");
    return response.data; // Return the gaskets data
  } catch (error) {
    console.error('Error fetching gaskets:', error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};
