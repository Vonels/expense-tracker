import axios from "axios";

export type ApiError = {
  message: string;
  status: number;
  response?: {
    data?: { error?: string };
    status?: number;
  };
};

export function logErrorResponse(errorObj: unknown): void {
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  const reset = "\x1b[0m";

  // Стрелка зелёная, текст жёлтый
  console.log(`${green}> ${yellow}Error Response Data:${reset}`);
  console.dir(errorObj, { depth: null, colors: true });
}

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
