"use client";

import css from "./UserBarBtn.module.css";
import Image from "next/image";
import { Icon } from "../Icon/Icon";
import { useEffect, useState } from "react";
import { UserNew } from "@/types/user";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};
const UserBarBtn = ({ isOpen, onToggle }: Props) => {
  const [user, setUser] = useState<UserNew | null>(null);

  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, [token]);

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
