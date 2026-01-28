"use client";
import { logout as apiLogout } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import css from "./UserPanel.module.css";
import { Icon } from "../Icon/Icon";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const UserPanel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();

  const handleProfileSettings = () => {
    router.push("/profile-settings");
    onClose();
  };

  const handleLogout = async () => {
    await apiLogout();

    router.push("/");
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
