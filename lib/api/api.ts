import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_BACKEND,
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL_BACKEND);
