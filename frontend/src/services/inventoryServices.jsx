// services/gasketService.js
import axios from 'axios';


//API URL
const GASKET_API_URL = 'http://localhost:8098/api/gaskets';

// Function to fetch all gaskets
export const fetchGaskets = async () => {
  try {
    const response = await axios.get(GASKET_API_URL);
    return response.data; // Return the gaskets data
  } catch (error) {
    console.error('Error fetching gaskets:', error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};
