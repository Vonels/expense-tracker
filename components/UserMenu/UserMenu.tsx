"use client";

import { useEffect, useRef, useState } from "react";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import UserPanel from "../UserPanel/UserPanel";
import css from "./UserMenu.module.css";

type Props = {
  className?: string;
};

const UserMenu = ({ className }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen((prev) => !prev);

  // ✅ закриття по кліку поза панеллю
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      const target = e.target as Node;

      if (isOpen && !wrapperRef.current.contains(target)) {
        closePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ✅ закриття по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div ref={wrapperRef} className={`${css.wrapper} ${className || ""}`}>
      <UserBarBtn isOpen={isOpen} onToggle={togglePanel} />
      <UserPanel isOpen={isOpen} onClose={closePanel} />
    </div>
  );
};

export default UserMenu;
