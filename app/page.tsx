"use client";

import css from "./page.module.css";
import { Icon } from "@/components/Icon/Icon";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className={css.wrapper}>
        <div className={css.backgroundphoto}>
          <div className={css.rectangle}>
            <div className={css.svg}>
              <Icon id="icon-arrow-up-right2" className={css.icon} />
            </div>
            <div>
              <p className={css.rectangle_text1}>Your balance</p>
              <p className={css.rectangle_text2}>$632.000</p>
            </div>
            <div className={css.rectangle_block2}>
              <p className={css.rectangle_text3}>+1.29%</p>
            </div>
          </div>
        </div>
        <div>
          <p className={css.form_text1}>Expense Log</p>
          <div className={css.form_block1}>
            <p className={css.form_text2}>
              Manage Your <span className={css.span}>Finances</span>{" "}
              Masterfully!
            </p>
            <p className={css.form_text3}>
              ExpenseTracker effortlessly empowers you to take control of your
              finances! With intuitive features, it simplifies the process of
              tracking and managing expenses, allowing for a stress-free mastery
              over your financial world.
            </p>
          </div>
          <div className={css.form_block2}>
            <button className={css.button_signup} type="button">
              Sign Up
            </button>
            <button className={css.button_signin} type="button">
              Sign In
            </button>
          </div>
          <div className={css.form_block3}>
            <Image className={css.image} alt="avatars" src={""} />
            <div>
              <p className={css.form_text4}> 1000 users + </p>
              <p className={css.form_text5}>
                Trusted by users for reliable expense tracking!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
