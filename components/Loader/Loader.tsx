"use client";
import { useAuthStore } from "@/lib/store/authStore";
import styles from "./Loader.module.css";

interface LoaderProps {
  forcedVisible?: boolean;
}

export const Loader = ({ forcedVisible = false }: LoaderProps) => {
  const { isLoading } = useAuthStore();

  if (!isLoading && !forcedVisible) return null;
  return (
    <div className={styles.backdrop}>
      <div
        className={styles.wheelAndHamster}
        role="img"
        aria-label="Hamster running in a wheel"
      >
        <div className={styles.wheel}></div>
        <div className={styles.hamster}>
          <div className={styles.hamsterBody}>
            <div className={styles.hamsterHead}>
              <div className={styles.hamsterEar}></div>
              <div className={styles.hamsterEye}></div>
              <div className={styles.hamsterNose}></div>
            </div>
            <div
              className={`${styles.hamsterLimb} ${styles.hamsterLimbFr}`}
            ></div>
            <div
              className={`${styles.hamsterLimb} ${styles.hamsterLimbFl}`}
            ></div>
            <div
              className={`${styles.hamsterLimb} ${styles.hamsterLimbBr}`}
            ></div>
            <div
              className={`${styles.hamsterLimb} ${styles.hamsterLimbBl}`}
            ></div>
            <div className={styles.hamsterTail}></div>
          </div>
        </div>
        <div className={styles.spoke}></div>
      </div>
    </div>
  );
};
