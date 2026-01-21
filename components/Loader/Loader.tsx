"use client";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./Loader.module.css";

export const Loader = () => {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.spinner}></div>
    </div>
  );
};
