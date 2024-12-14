//API Centralized endpoint config


const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PORT = import.meta.env.VITE_API_PORT;

const API_BASE_URL = PORT ? `${BASE_URL}:${PORT}` : BASE_URL;

export default API_BASE_URL;
