"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OPEN_CATEGORIES_MODAL = "openCategoriesModal";

export default function OpenCategoriesModalOnLoad() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldOpen = sessionStorage.getItem(OPEN_CATEGORIES_MODAL);
    if (shouldOpen) {
      sessionStorage.removeItem(OPEN_CATEGORIES_MODAL);
      router.push("/categoriesModal");
    }
  }, [router]);

  return null;
}
