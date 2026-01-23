"use client";

import { useAuthStore } from "@/lib/store/authStore";
import Logo from "../Logo/Logo";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import css from "./Header.module.css";

const Header = () => {
  const { isLoggedIn } = useAuthStore();
  return (
    <header className={css.container}>
      <div className={css.header}>
        {/* {isLoggedIn
            ? <>
                <Logo />
                <TransactionsHistoryNav />
                <UserBarBtn />
            </>
            : <Logo />} */}
      <Logo />
      <TransactionsHistoryNav />
      <UserBarBtn />
      </div>
    </header>
  );
};
export default Header;
