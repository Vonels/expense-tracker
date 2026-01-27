"use client";

import css from "./UserBarBtn.module.css";
import Image from "next/image";
import { Icon } from "../Icon/Icon";
import { useAuthStore } from "@/lib/store/authStore";
import { useEffect } from "react";
type Props = {
  isOpen: boolean;
  onToggle: () => void;
};
const UserBarBtn = ({ isOpen, onToggle }: Props) => {
  const { user, refreshUser, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Якщо Zustand вже прочитав localStorage, а юзера все ще немає — питаємо сервер
    if (_hasHydrated && !user) {
      refreshUser();
    }
  }, [_hasHydrated, user, refreshUser]);

  // Поки ми не впевнені, чи є юзер, краще показувати скелетон або пусту кнопку
  // замість return null, щоб компонент залишався в дереві
  if (!_hasHydrated) return <div className={css.loaderPlaceholder} />;

  // Якщо після refreshUser все одно null — тоді вже ховаємо
  if (!user) return null;
  const { name, avatarUrl } = user;
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <button type="button" className={css.UserBarBtn} onClick={onToggle}>
      {/* Avatar */}
      {avatarUrl ? (
        <Image src={avatarUrl} alt={name} className={css.avatar} />
      ) : (
        <div className={css.avatarFallback}>{firstLetter}</div>
      )}

      {/* User name */}

      <span className={css.userName}>{name}</span>

      {/* Arrow icon */}
      <Icon
        id={isOpen ? "icon-listpump" : "icon-listdamp"}
        className={css.icon}
      />
    </button>
  );
};
export default UserBarBtn;
