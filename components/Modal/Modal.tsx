"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import css from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  const router = useRouter();
  const onClose = () => router.back();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.code === "Escape") router.back();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [router]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={(e) => e.target === e.currentTarget && router.back()}
    >
      <div className={css.modal}>
        <button
          className={css.closeBtnCategoriesModal}
          onClick={() => router.back()}
        >
          <svg width="12" height="12">
            <use href="/symbol-defs.svg#icon-Close"></use>
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
