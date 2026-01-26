"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";

type Props = {
  children: ReactNode;
};

const PRIVATE_PREFIXES = ["/dashboard", "/expenses", "/incomes", "/profile"];
const PUBLIC_ONLY_PREFIXES = ["/sign-in", "/sign-up"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => path === prefix || path.startsWith(prefix + "/")
  );
}

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "authed" | "guest">(
    "loading"
  );

  const isPrivateRoute = useMemo(
    () => startsWithAny(pathname, PRIVATE_PREFIXES),
    [pathname]
  );

  const isPublicOnlyRoute = useMemo(
    () => startsWithAny(pathname, PUBLIC_ONLY_PREFIXES),
    [pathname]
  );

  // 🔐 проверяем сессию ТОЛЬКО при первом монтировании
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const session = await checkSession();

        if (!active) return;

        if (session?.success) {
          setStatus("authed");
        } else {
          setStatus("guest");
        }
      } catch {
        if (active) setStatus("guest");
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // 🔁 редиректы — отдельно и предсказуемо
  useEffect(() => {
    if (status === "loading") return;

    if (status === "guest" && isPrivateRoute) {
      router.replace("/sign-in");
      return;
    }

    if (status === "authed" && isPublicOnlyRoute) {
      router.replace("/dashboard");
      return;
    }
  }, [status, isPrivateRoute, isPublicOnlyRoute, router]);

  if (status === "loading") return null;

  return <>{children}</>;
}
