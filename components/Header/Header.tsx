"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import css from "./Header.module.css";
import UserPanel from "../UserPanel/UserPanel";

const Header = () => {
  const { isLoggedIn } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const closePanel = () => setIsOpen(false);
  const togglePanel = () => setIsOpen((prev) => !prev);

  //закриття по кліку поза UserPanel
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
  //закриття по Escape UserPanel
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <header className={css.container}>
      <div className={css.header}>
        {isLoggedIn ? (
          <>
            <Logo />
            <TransactionsHistoryNav />
            <div ref={wrapperRef} className={css.wrapper}>
              <UserBarBtn isOpen={isOpen} onToggle={togglePanel} />
              <UserPanel isOpen={isOpen} onClose={closePanel} />
            </div>
          </>
        ) : (
          <Logo />
        )}
      </div>
    </header>
  );
};
export default Header;
