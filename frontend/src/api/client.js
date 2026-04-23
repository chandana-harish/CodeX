import axios from "axios";
import { getStoredToken } from "../utils/storage";

const createClient = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json"
    }
  });

  instance.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const authClient = createClient(import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:4001");
export const userClient = createClient(import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:4002");
export const trainingClient = createClient(
  import.meta.env.VITE_TRAINING_SERVICE_URL || "http://localhost:4003"
);
export const attendanceClient = createClient(
  import.meta.env.VITE_ATTENDANCE_SERVICE_URL || "http://localhost:4004"
);
