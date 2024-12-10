import axios from "axios";
const API_URL = 'https://enokaback-7e8aa9803d2c.herokuapp.com/api';

// Create a new delivery
export const createDelivery = async (senderBranch, receiverBranch) => {
  const response = await axios.post(`${API_URL}/delivery`, { senderBranch, receiverBranch });
  return response.data.delivery;  // Access the 'delivery' object correctly
};

// Function to remove delivery by ID
export const removeDelivery = async (deliveryId) => {
  try {
    const response = await axios.delete(`${API_URL}/delivery/${deliveryId}`);
    return response;
  } catch (error) {
    console.error("Error removing delivery:", error);
    throw error;
  }
};

//Get latest pending delivery
export const getLatestPendingDelivery = async () => {
  try {
    const response = await axios.get(`${API_URL}/delivery/deliveries/latest`);
    return response.data.delivery;  // Access the 'delivery' object correctly
  } catch (error) {
    console.error("Error fetching pending delivery:", error);
    throw error;
  }
};

//Get delivery Items by deliveryId
export const getDeliveryItemsByDeliveryId = async (deliveryId) => {
  try {
    const response = await axios.get(`${API_URL}/deliveryItems/getDeliveryItemsByDeliveryId/${deliveryId}`);
    return response;
  } catch (error) {
    console.error("Error fetching delivery items:", error);
    throw error;
  }
};

//Get ondelivery deliveries
export const getOnDeliveryDeliveries = async () => {
  try {
    const response = await axios.get(`${API_URL}/delivery/deliveries/on-delivery`);
    return response; 
  } catch (error) {
    console.error("Error fetching on delivery deliveries:", error);
    throw error;
  }
};

//Get received deliveries
export const getReceivedDeliveries = async () => {
  try {
    const response = await axios.get(`${API_URL}/delivery/deliveries/received`);
    return response;
  } catch (error) {
    console.error("Error fetching received deliveries:", error);
    throw error;
  }
};

//Change status of delivery
export const changeDeliveryStatus = async (deliveryId, status) => {
  try {
    const response = await axios.put(`${API_URL}/deliveryItems/updateStatusOfDeliveryItem/${deliveryId}`, { status: status });
    return response;
  } catch (error) {
    console.error("Error changing delivery status:", error);
    throw error;
  }
};