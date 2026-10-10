// api/apiCollection.js
import { apiService } from "./apiService";

export const apiCollection = {
  // Generic HTTP shortcuts
  get: (url, config) => apiService.get(url, config),
  post: (url, data, config) => apiService.post(url, data, config),
  put: (url, data, config) => apiService.put(url, data, config),
  delete: (url, config) => apiService.delete(url, config),

  // ==========================================
  // AUTH, USERS & HIERARCHY
  // ==========================================
  login: (credentials) => apiService.post("/api/auth/login", credentials),
  logout: () => apiService.post("/api/auth/logout"),
  getProfile: () => apiService.get("/api/auth/profile"),

  getUsers: () => apiService.get("/api/users"),
  createUser: (userData) => apiService.post("/api/users", userData),
  updateUser: (id, userData) => apiService.put(`/api/users/${id}`, userData),
  deleteUser: (id) => apiService.delete(`/api/users/${id}`),

  // ==========================================
  // SOFTWARE DISTRIBUTION & SECURE LINKS
  // ==========================================
  getSoftwares: () => apiService.get("/api/software"),
  createSoftware: (data) => apiService.post("/api/software", data),
  addSoftware: (data) => apiService.post("/api/software", data),
  updateSoftware: (id, data) => apiService.put(`/api/software/${id}`, data),
  deleteSoftware: (id) => apiService.delete(`/api/software/${id}`),
  
  getSoftwareLinks: () => apiService.get("/api/software/links"),
  assignSoftware: (data) => apiService.post("/api/software/links", data), // Generate token link

  // ==========================================
  // DYNAMIC SIDEBAR MENU BUILDER
  // ==========================================
  getMenu: () => apiService.get("/api/menus"),
  getMenus: (fetchAll = false) => apiService.get(fetchAll ? "/api/menus?all=true" : "/api/menus"),
  createMenu: (data) => apiService.post("/api/menus", data),
  updateMenu: (id, data) => apiService.put(`/api/menus/${id}`, data),
  deleteMenu: (id) => apiService.delete(`/api/menus/${id}`),

  // ==========================================
  // DASHBOARD STATS & METRICS
  // ==========================================
  getDashboardStats: () => apiService.get("/api/dashboard/stats"),

  // ==========================================
  // ACTIVITY & AUDIT LOGS
  // ==========================================
  getAuditLogs: () => apiService.get("/api/audit/logs"),
  getActivityLogs: () => apiService.get("/api/audit/logs"),
  createAuditLog: (data) => apiService.post("/api/audit/logs", data),
  createActivityLog: (data) => apiService.post("/api/audit/logs", data),

  // ==========================================
  // AI CHATBOT & ENQUIRIES
  // ==========================================
  sendAiChat: (data) => apiService.post("/api/chat", data),
};