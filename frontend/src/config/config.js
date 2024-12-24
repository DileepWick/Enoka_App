// API Centralized endpoint config

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PORT = import.meta.env.VITE_API_PORT;

const API_BASE_URL = PORT ? `${BASE_URL}:${PORT}` : BASE_URL;

// List of endpoints that don't require authentication (no token)
const noAuthEndpoints = [
  "/api/branches",  // Example: Endpoint that doesn't require a token
  //"/anotherapi/noauth", // Another example endpoint
];

export { API_BASE_URL, noAuthEndpoints };
