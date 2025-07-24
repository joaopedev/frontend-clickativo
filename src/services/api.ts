import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3005",
  headers: {
    "Authorization": "grandeSegredo",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.authorization = process.env.NEXT_PUBLIC_API_AUTH_SECRET || "grandeSegredo";
  return config;
});

export default api;
