import { DefaultToastOptions } from "react-hot-toast";

export const toastOptions: DefaultToastOptions = {
  style: {
    background: "#0c0d0d",
    color: "#fafafa",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "16px",
    fontSize: "16px",
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: "#0ef387",
      secondary: "#0c0d0d",
    },
    style: {
      border: "1px solid #0ef387",
    },
  },
  error: {
    duration: 4000,
    iconTheme: {
      primary: "#ff4b4b",
      secondary: "#fafafa",
    },
    style: {
      border: "1px solid #ff4b4b",
    },
  },
};
