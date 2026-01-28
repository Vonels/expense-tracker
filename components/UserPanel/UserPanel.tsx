"use client";

import { useRouter } from "next/navigation";
import css from "./UserPanel.module.css";
import { Icon } from "../Icon/Icon";
import { useState } from "react";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const UserPanel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const localLogout = useAuthStore((state) => state.logout);

  const handleProfileSettings = () => {
    router.push("/profile-settings")
    onClose();
  };
  

  const handleLogout = async () => {
  try {
    await logout(); // api
  } catch (e) {
    console.log(e);
  }

  localLogout();

  setConfirm(false);
  onClose();

  router.replace("/");
  router.refresh();
};

  
  return (<>
    <div className={`${css.panel} ${isOpen ? css.open : ""}`}>
      <button
        type="button"
        onClick={handleProfileSettings}
        className={css.button}
      >
        <Icon id={"icon-user"} className={css.icon} />
        Profile settings
      </button>
      <button type="button" onClick={() => setConfirm(true)} className={css.button}>
        <Icon id={"icon-log-out"} className={css.icon} />
        Log out
      </button>
    </div>
    
    {confirm && (
        <div className={css.backdrop}>
          <div className={css.modal}>
            <p>Are you sure you want to log out?</p>
            <div className={css.btnDiv}>
            <button
              className={css.confirm}
              onClick={handleLogout}
            >
              Log out
            </button>

            <button
              className={css.cancel}
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
            </div>
          </div>
        </div>
      )}
  </>);
};
export default UserPanel;
