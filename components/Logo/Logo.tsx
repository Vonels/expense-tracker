"use client";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Logo.module.css";
import { Icon } from "../Icon/Icon";

const Logo = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const isLoggedIn = Boolean(user && token);
  
  const navigateTo = isLoggedIn
    ? "/dashboard" // MainTransactionsPage
    : "/"; // WelcomePage
  return (
    <Link href={navigateTo} aria-label="Home" className={css.link}>
      <Icon id={"icon-Logo"} className={css.logoSvg} />
      Expensetracker
    </Link>
  );
};
export default Logo;
