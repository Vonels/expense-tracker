"use client";

import { useAuthStore } from "@/lib/store/authStore";
import styles from "./Loader.module.css";

export const Loader = () => {
  const isLoading = useAuthStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.wheelAndHamster}
        role="img"
        aria-label="Hamster running in a wheel"
      >
        <div className={styles.wheel}></div>
        <div className={styles.hamster}>
          <div className={styles.hamster__body}>
            <div className={styles.hamster__head}>
              <div className={styles.hamster__ear}></div>
              <div className={styles.hamster__eye}></div>
              <div className={styles.hamster__nose}></div>
            </div>
            <div
              className={`${styles.hamster__limb} ${styles.hamster__limbFr}`}
            ></div>
            <div
              className={`${styles.hamster__limb} ${styles.hamster__limbFl}`}
            ></div>
            <div
              className={`${styles.hamster__limb} ${styles.hamster__limbBr}`}
            ></div>
            <div
              className={`${styles.hamster__limb} ${styles.hamster__limbBl}`}
            ></div>
            <div className={styles.hamster__tail}></div>
          </div>
        </div>
        <div className={styles.spoke}></div>
      </div>
    </div>
  );
};
