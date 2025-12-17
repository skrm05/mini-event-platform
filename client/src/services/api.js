import axios from "axios";

const isProduction = import.meta.env.MODE === "production";

const baseURL = isProduction
  ? "https://mini-event-platform-e21p.onrender.com/api"
  : "http://localhost:9000/api";
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;
