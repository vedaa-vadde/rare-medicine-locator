import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Medicines
export const searchMedicines = (params) => API.get("/medicines/search", { params });
export const getNearbyMedicines = (params) => API.get("/medicines/nearby", { params });
export const getMyMedicines = () => API.get("/medicines/my");
export const addMedicine = (data) => API.post("/medicines", data);
export const updateMedicine = (id, data) => API.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);

// Pharmacies
export const getAllPharmacies = () => API.get("/pharmacies");
export const getDashboardStats = () => API.get("/pharmacies/dashboard");
export const getPharmacyMedicines = (id) => API.get(`/pharmacies/${id}/medicines`);

export default API;
