"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";

type Props = { children: ReactNode };

const PRIVATE_PREFIXES = ["/dashboard", "/expenses", "/incomes", "/profile"];
const PUBLIC_ONLY_PREFIXES = ["/sign-in", "/sign-up"];

function startsWithAny(path: string, prefixes: string[]) {
  return prefixes.some((p) => path === p || path.startsWith(p + "/"));
}

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  const isPrivateRoute = useMemo(
    () => startsWithAny(pathname, PRIVATE_PREFIXES),
    [pathname]
  );

  const isPublicOnlyRoute = useMemo(
    () => startsWithAny(pathname, PUBLIC_ONLY_PREFIXES),
    [pathname]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const session = await checkSession();
        if (!alive) return;

        const authed = session.success;

        if (!authed && isPrivateRoute) {
          router.replace("/sign-in");
          return;
        }

        if (authed && isPublicOnlyRoute) {
          router.replace("/dashboard");
          return;
        }
      } finally {
        if (alive) setIsReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isPrivateRoute, isPublicOnlyRoute, router]);

  if (!isReady) return null;

  return <>{children}</>;
}
