"use client";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Logo.module.css";
import { Icon } from "../Icon/Icon";

const Logo = () => {
  const { isLoggedIn } = useAuthStore();
  const navigateTo = isLoggedIn
    ? "/transactions" // MainTransactionsPage
    : "/"; // WelcomePage
  return (
    <Link href={navigateTo} aria-label="Home" className={css.link}>
      <Icon id={"icon-Logo"} className={css.logoSvg} />
      Expensetracker
    </Link>
  );
};
export default Logo;
