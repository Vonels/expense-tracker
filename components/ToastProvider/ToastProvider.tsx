"use client";

import { Toaster } from "react-hot-toast";
import { toastOptions } from "@/lib/config/toastConfig";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={toastOptions}
    />
  );
};
