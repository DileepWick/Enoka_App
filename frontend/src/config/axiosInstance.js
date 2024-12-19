import axios from "axios";
import { API_BASE_URL, noAuthEndpoints } from "./config"; // Import from config.js
import { getIdToken } from "@@/firebase/auth";  // Your Firebase helper to fetch the ID token

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Intercept request to add the token only if the endpoint requires it
axiosInstance.interceptors.request.use(async (config) => {
  try {
    // If the request URL is in the noAuthEndpoints array, skip adding the token
    if (noAuthEndpoints.some((endpoint) => config.url.includes(endpoint))) {
      return config;  // No token added for these endpoints
    }

    const token = await getIdToken();  // Fetch the Firebase ID token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;  // Attach token to Authorization header
    }
    return config;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
});

export default axiosInstance;
