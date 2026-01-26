"use client";

import { useRouter } from "next/navigation";
import { UserSetsModal } from "@/components/UserSetsModal/UserSetsModal";

export default function ProfilePage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <UserSetsModal onClose={handleClose} />
    </div>
  );
}
