import axios from "axios";

// Debug: Log the API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
console.log("🔧 API Base URL:", API_BASE_URL);
console.log("🔧 Environment:", import.meta.env.MODE);
console.log("🔧 All ENV vars:", import.meta.env);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("📤 Request:", config.method.toUpperCase(), config.url);
  return config;
}, (error) => {
  console.error("❌ Request error:", error);
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const deleteAccount = () => API.delete("/auth/delete-account");

// Jobs
export const getJobs = (params) => API.get("/jobs", { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const getMyJobs = () => API.get("/jobs/my");
export const createJob = (data) => API.post("/jobs", data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

// Applications
export const applyToJob = (data) => API.post("/applications", data);
export const getMyApplications = () => API.get("/applications/my");
export const getJobApplicants = (jobId) =>
  API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, status) =>
  API.put(`/applications/${id}/status`, { status });

// Profile
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);
export const uploadResume = (formData) =>
  API.post("/profile/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Notifications
export const getNotifications = () => API.get("/profile/notifications");
export const markNotificationsRead = () =>
  API.put("/profile/notifications/read");
export const deleteNotification = (id) =>
  API.delete(`/profile/notifications/${id}`);
export const clearAllNotifications = () => API.delete("/profile/notifications");

// Admin
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUsers = (page = 1, role = "") =>
  API.get("/admin/users", { params: { page, ...(role && { role }) } });
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminJobs = (page = 1, search = "") =>
  API.get("/admin/jobs", { params: { page, ...(search && { search }) } });
export const deleteAdminJob = (id) => API.delete(`/admin/jobs/${id}`);

export default API;
