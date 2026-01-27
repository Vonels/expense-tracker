"use client";

import { useState } from "react";
import Logo from "../Logo/Logo";
import TransactionsHistoryNav from "../TransactionsHistoryNav/TransactionsHistoryNav";
import css from "./HeaderUser.module.css";
import BurgerMenuBtn from "../BurgerMenuBtn/BurgerMenuBtn";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import UserMenu from "../UserMenu/UserMenu";

const HeaderUser = () => {
  const [isOpenBurger, setIsOpenBurger] = useState(false);

  const openBurger = () => setIsOpenBurger(true);
  const closeBurger = () => setIsOpenBurger(false);

  return (
    <header className="container">
      <div className={css.header}>
        <Logo />

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
      </div>
    </header>
  );
};
export default HeaderUser;
