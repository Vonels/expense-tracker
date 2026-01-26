"use client";

import css from "./UserBarBtn.module.css";
import Image from "next/image";
import { Icon } from "../Icon/Icon";
import { useAuthStore } from "@/lib/store/authStore";
type Props = {
  isOpen: boolean;
  onToggle: () => void;
};
const UserBarBtn = ({ isOpen, onToggle }: Props) => {
  const user = useAuthStore((state) => state.user);

  // if (!user) return null;

  // const { name, avatarUrl } = user;
  // const firstLetter = name.charAt(0).toUpperCase();

  return (
    <button type="button" className={css.UserBarBtn} onClick={onToggle}>
      {/* Avatar */}
      {/* {avatarUrl ? (
        <Image src={avatarUrl} alt={name} className={css.avatar} />
      ) : (
        <div className={css.avatarFallback}>{firstLetter}</div>
      )} */}

      {/* User name */}

      {/* <span className={css.userName}>{name}</span> */}

      {/* test */}
      <div className={css.avatarFallback}>T</div>
      <span className={css.userName}>First Name</span>
      {/* Arrow icon */}
      <Icon
        id={isOpen ? "icon-listpump" : "icon-listdamp"}
        className={css.icon}
      />
    </button>
  );
};
export default UserBarBtn;
