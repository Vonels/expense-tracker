"use client";

import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";
import { useAuthStore } from "@/lib/store/authStore";

export default function Header() {
  const { isAuthenticated } = useAuthStore();
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link href="/notes/filter/all">Notes</Link>
            </li>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <Link href="/sign-in">Login</Link>
              </li>
              <li>
                <Link href="/sign-up">Register</Link>
              </li>
            </>
          )}

          {isAuthenticated && <AuthNavigation />}
        </ul>
      </nav>
    </header>
  );
}
