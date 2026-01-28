"use client";

import css from "./UserBarBtn.module.css";
import Image from "next/image";
import { Icon } from "../Icon/Icon";
import { useEffect } from "react";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};
const UserBarBtn = ({ isOpen, onToggle }: Props) => {
  const { user, setAuthData, token, _hasHydrated } = useAuthStore();

  // Завантажуємо дані користувача, якщо їх немає в сторі
  useEffect(() => {
    if (!_hasHydrated || user) return;
    
    const fetchUser = async () => {
      try {
        const data = await getMe();
        // Оновлюємо стор
        setAuthData(
          {
            name: data.name || null,
            email: data.email,
            avatarUrl: data.avatarUrl || null,
            currency: (data.currency || "UAH").toUpperCase(),
          },
          token || ""
        );
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, [token, _hasHydrated, user, setAuthData]);

  if (!user) return null;

  const { name, avatarUrl } = user;
  const firstLetter = name?.charAt(0).toUpperCase();

  return (
    <button type="button" className={css.UserBarBtn} onClick={onToggle}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name ?? "user avatar"}
          className={css.avatar}
          width={44}
          height={44}
        />
      ) : (
        <div className={css.avatarFallback}>{firstLetter}</div>
      )}

      <span className={css.userName}>{name}</span>

      <Icon
        id={isOpen ? "icon-listpump" : "icon-listdamp"}
        className={css.icon}
      />
    </button>
  );
};
export default UserBarBtn;
