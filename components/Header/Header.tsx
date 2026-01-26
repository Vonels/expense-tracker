"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import UserBarBtn from "../UserBarBtn/UserBarBtn";
import css from "./Header.module.css";
import UserPanel from "../UserPanel/UserPanel";
import BurgerMenuBtn from "../BurgerMenuBtn/BurgerMenuBtn";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import UserMenu from "../UserMenu/UserMenu";

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = Boolean(user);

  const [isOpenBurger, setIsOpenBurger] = useState(false);

  const openBurger = () => setIsOpenBurger(true);
  const closeBurger = () => setIsOpenBurger(false);

  return (
    <header className={css.container}>
      <div className={css.header}>
        <Logo />

        {isLoggedIn && (
          <>
            {/* DESKTOP навігація */}
            <div className={css.desktopNav}>
              <TransactionsHistoryNav variant="header" />
              <UserMenu />
            </div>

            {/* MOBILE/TABLET burger */}
            <div className={css.tabletNav}>
              <BurgerMenuBtn onClick={openBurger} />
              <BurgerMenu isOpen={isOpenBurger} onClose={closeBurger} />
            </div>
          </>
        )}

        {/* test */}
        <div className={css.desktopNav}>
          <TransactionsHistoryNav variant="header" />
          <UserMenu />
        </div>
        <div className={css.tabletNav}>
          <BurgerMenuBtn onClick={openBurger} />
          <BurgerMenu isOpen={isOpenBurger} onClose={closeBurger} />
        </div>
      </div>
    </header>
  );
};
export default Header;
