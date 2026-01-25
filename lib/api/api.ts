import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_BACKEND_API_URL);
