import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL_BACKEND);
