//For API Call

import axios from "axios";
import API_BASE_URL from "./config";

// Your Firebase helper to fetch the ID token
import { getIdToken } from "@@/firebase/auth";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});


// Intercept request to add the token
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getIdToken(); // Fetch the Firebase ID token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
});

export default axiosInstance;
