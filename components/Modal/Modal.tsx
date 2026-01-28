"use client";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
// import { useRouter } from "next/navigation";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal = ({ children, onClose }: ModalProps) => {
  // const router = useRouter();
  // const [isOpen, setIsOpen] = useState(true);
  // const onClose = useCallback(() => {
  //   setIsOpen(false);
  // }, []);

  // const onClose = () => {
  //   setIsOpen(false);

  //   router.back();
  // };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // if (!isOpen) return null;

  return createPortal(
    <div
      className={css.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={css.modal}>
        <button className={css.closeBtnCategoriesModal} onClick={onClose}>
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
