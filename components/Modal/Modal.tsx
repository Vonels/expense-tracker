"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import css from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  /**
   * Optional close handler.
   * If not provided, modal will navigate back in history (router.back()).
   */
  onClose?: () => void;
}

export const Modal = ({ children, onClose }: ModalProps) => {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.code === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [handleClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={css.modal}>
        <button className={css.closeBtnCategoriesModal} onClick={handleClose}>
          <svg width="24" height="24">
            <use href="/symbol-defs.svg#icon-Close"></use>
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};
