// import { logout } from "./shared/store";

const API_BASE_URL = "http://localhost:8080";
 //const API_BASE_URL = "http://192.168.0.178:8080";
window.API = Object.freeze({
  loginUser: () => `${API_BASE_URL}/Login-User`,
  registerUser: () => `${API_BASE_URL}/Register-User`,
  profile: (email) => `${API_BASE_URL}/Profile/${encodeURIComponent(email)}`,
  sendOtp: () => `${API_BASE_URL}/send`,
  verifyOtp: () => `${API_BASE_URL}/verify`,
  editPassword: () => `${API_BASE_URL}/editPassword`,
  deleteAccount: () => `${API_BASE_URL}/deleteAccount`,
  customRoadmap: () => `${API_BASE_URL}/Custom_Roadmap`,
  customTracker: () => `${API_BASE_URL}/Custom_Tracker`,
  allRoadmaps: (email) => `${API_BASE_URL}/All_RoadMap/${encodeURIComponent(email)}`,
  roadmapCategories: () => `${API_BASE_URL}/Static_Roadmaps/Category`,
  roadmapsInCategory: (category) =>
    `${API_BASE_URL}/Static_Roadmaps/Category/${encodeURIComponent(category)}`,
  roadmapTemplate: (category, name, level, email) =>
    `${API_BASE_URL}/Static_Roadmaps/Category/${encodeURIComponent(category)}/${encodeURIComponent(name)}/${encodeURIComponent(level)}/${encodeURIComponent(email)}`,
  allTrackers: (email) =>
    `${API_BASE_URL}/all_trackers?email=${encodeURIComponent(email)}`,
  deleteTrackers: () =>
    `${API_BASE_URL}/delete_trackers`,
  saveTracker: () => `${API_BASE_URL}/tracker`,
  saveIndividualTracker: () => `${API_BASE_URL}/save_tracker`,
  plan: () => `${API_BASE_URL}/plan`,
  createPaymentOrder: () => `${API_BASE_URL}/payment/create-order`,
  verifyPayment: () => `${API_BASE_URL}/payment/verify`,
  logout:() => `${API_BASE_URL}/LogOut-User`,
});