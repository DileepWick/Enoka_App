// services/gasketService.js
import axios from 'axios';


//API URL
const GASKET_API_URL = 'http://enoka-d025615470f3.herokuapp.com/api/gaskets';

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
