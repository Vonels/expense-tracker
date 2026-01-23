import axios from "axios";

export type ApiError = {
  message: string;
  status: number;
  response?: {
    data?: { error?: string };
    status?: number;
  };
};

const baseURL = process.env.NEXT_PUBLIC_API_URL_BACKEND;

if (!baseURL) {
  console.warn("NEXT_PUBLIC_API_URL_BACKEND is not set");
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status ?? 500;

    const normalized: ApiError = {
      message: error?.message ?? "Request failed",
      status,
      response: error?.response,
    };

    return Promise.reject(normalized);
  }
);
