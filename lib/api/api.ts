import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  useAuthStore.getState().setLoading(true);
  return config;
});

api.interceptors.response.use(
  (response) => {
    useAuthStore.getState().setLoading(false);
    return response;
  },
  (error) => {
    useAuthStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);
