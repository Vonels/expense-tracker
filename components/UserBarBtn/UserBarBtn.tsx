"use client";

import { useState } from "react";
import css from "./UserBarBtn.module.css";
import Image from "next/image";
import { Icon } from "../Icon/Icon";
import { useAuthStore } from "@/lib/store/authStore";

const UserBarBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  if (!user) return null;

  const { name, avatarUrl } = user;
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <button type="button" className={css.UserBarBtn} onClick={togglePanel}>
      {/* Avatar */}
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} className={css.avatar} />
      ) : (
        <div className={css.avatarFallback}>{firstLetter}</div>
      )}

      {/* User name */}
      <span className={css.userName}>{name}</span>

      {/* Arrow icon */}
      {isOpen ? (
        <Icon id={"icon-arrow-up-right2"} className={css.icon} />
      ) : (
        <Icon id={"icon-Pensil"} className={css.icon} />
      )}
    </button>
  );
};
export default UserBarBtn;
