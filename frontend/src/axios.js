import axios from "axios";

// In production, fallback to Render URL. In development, use an empty string to leverage vue.config.js proxy.
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || (process.env.NODE_ENV === "production" ? "https://e-com-1-tcfl.onrender.com" : "");

export default axios.create({
  baseURL: `${API_BASE_URL}/api`,
});
