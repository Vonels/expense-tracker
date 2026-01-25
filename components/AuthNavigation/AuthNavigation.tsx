"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkSession, logout } from "@/lib/api/clientApi";

type SessionState = "loading" | "authed" | "guest";

export default function AuthNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [state, setState] = useState<SessionState>("loading");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await checkSession();
        if (!isMounted) return;
        setState(res.success ? "authed" : "guest");
      } catch {
        if (!isMounted) return;
        setState("guest");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setState("guest");
      router.replace("/sign-in");
      router.refresh();
    }
  };

  const isActive = (href: string) => pathname === href;

  if (state === "loading") {
    return null; // или можно поставить спиннер/скелетон
  }

  if (state === "guest") {
    return (
      <nav>
        <ul
          style={{
            display: "flex",
            gap: 12,
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <li>
            <Link
              href="/sign-in"
              aria-current={isActive("/sign-in") ? "page" : undefined}
            >
              Sign in
            </Link>
          </li>
          <li>
            <Link
              href="/sign-up"
              aria-current={isActive("/sign-up") ? "page" : undefined}
            >
              Sign up
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav>
      <ul
        style={{
          display: "flex",
          gap: 12,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        <li>
          <Link
            href="/dashboard"
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
