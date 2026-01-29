"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OPEN_CATEGORIES_MODAL = "openCategoriesModal";

/**
 * When dashboard loads with openCategoriesModal in sessionStorage (e.g. after
 * reload on /categoriesModal from dashboard), opens the categories modal.
 */
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
