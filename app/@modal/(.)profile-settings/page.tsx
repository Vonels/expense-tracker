"use client";

import { useRouter } from "next/navigation";
import { UserSetsModal } from "@/components/UserSetsModal/UserSetsModal";

export default function Page() {
  const router = useRouter();

  return <UserSetsModal onClose={() => router.back()} />;
}
