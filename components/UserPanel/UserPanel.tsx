"use client";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import css from "./UserPanel.module.css";
import { Icon } from "../Icon/Icon";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const UserPanel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const handleProfileSettings = () => {
    router.push("/profile-settings")
    onClose();
  };
  const handleLogout = async() => {
    await logout();
    router.push("/");
    router.refresh();
    onClose();
  };

  return (
    <div className={`${css.panel} ${isOpen ? css.open : ""}`}>
      <button
        type="button"
        onClick={handleProfileSettings}
        className={css.button}
      >
        <Icon id={"icon-user"} className={css.icon} />
        Profile settings
      </button>
      <button type="button" onClick={handleLogout} className={css.button}>
        <Icon id={"icon-log-out"} className={css.icon} />
        Log out
      </button>
    </div>
  );
};
export default UserPanel;
