import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL_BACKEND);
// import axios from "axios";
// import { useAuthStore } from "../store/authStore";

// const baseURL = process.env.NEXT_PUBLIC_API_URL_BACKEND;

// export const api = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   console.log("DEBUG: Токен в інтерцепторі:", token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
