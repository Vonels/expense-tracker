import css from "../page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <p className={css.form_text1}>Expense Log</p>
      <div className={css.form_block1}>
        <p className={css.form_text2}>
          Manage Your <span className={css.span}>Finances</span> Masterfully!
        </p>
        <p className={css.form_text3}>
          ExpenseTracker effortlessly empowers you to take control of your
          finances!...
        </p>
      </div>
      <div className={css.form_block2}>
        <Link href="/sign-up" className={css.button_signup}>
          Sign Up
        </Link>
        <Link href="/sign-in" className={css.button_signin}>
          Sign In
        </Link>
      </div>
      {/* Блок з аватарами */}
      <div className={css.form_block3}>
        <Image
          className={css.image}
          alt="avatars"
          src="/allpeople.webp"
          width={125}
          height={48}
        />
        <div>
          <p className={css.form_text4}>1000 users +</p>
          <p className={css.form_text5}>
            Trusted by users for reliable tracking!
          </p>
        </div>
      </div>
    </>
  );
}
