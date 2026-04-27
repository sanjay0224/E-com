import axios from "axios";

// Use the Environment Variable from Vercel/Local. 
// DO NOT hardcode URLs here to avoid deployment mismatch.
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || "";

export default axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : "/api",
  withCredentials: true,
});
