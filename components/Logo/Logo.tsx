"use client";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Logo.module.css";
import { Icon } from "../Icon/Icon";

type Props = {
  href: string;
};

const Logo = ({ href }: Props) => {
  return (
    <Link href={href} aria-label="Home" className={css.link}>
      <Icon id={"icon-Logo"} className={css.logoSvg} />
      Expensetracker
    </Link>
  );
};
export default Logo;
