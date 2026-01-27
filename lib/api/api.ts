import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const baseURL = (process.env.NEXT_PUBLIC_API_URL_FRONTEND || "") + "/api";

export const api = axios.create({
  baseURL,
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
