"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout as apiLogout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { Icon } from "../Icon/Icon";
import css from "./UserPanel.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const UserPanel = ({ isOpen, onClose }: Props) => {
  const router = useRouter();

  const [confirm, setConfirm] = useState(false);
  const localLogout = useAuthStore((state) => state.logout);

  const handleProfileSettings = () => {
    router.push("/profile-settings");
    onClose();
  };

  const closeConfirmModal = () => {
    setConfirm(false);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();

      if (localLogout) localLogout();

      setConfirm(false);
      onClose();

      router.replace("/");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);

      setConfirm(false);
      onClose();
      router.replace("/");
    }
  };

  return (
    <>
      <div className={`${css.panel} ${isOpen ? css.open : ""}`}>
        <button
          type="button"
          onClick={handleProfileSettings}
          className={css.button}
        >
          <Icon id={"icon-user"} className={css.icon} />
          Profile settings
        </button>

        <button
          type="button"
          onClick={() => setConfirm(true)}
          className={css.button}
        >
          <Icon id={"icon-log-out"} className={css.icon} />
          Log out
        </button>
      </div>

      {confirm && (
        <div className={css.backdrop} onClick={closeConfirmModal}>
          <div className={css.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={css.closeBtn}
              onClick={closeConfirmModal}
              aria-label="Close modal"
            >
              <Icon id={"icon-Close"} className={css.closeIcon} />
            </button>

            <p className={css.modalText}>Are you sure you want to log out?</p>

            <div className={css.btnDiv}>
              <button className={css.confirm} onClick={handleLogout}>
                Log out
              </button>

              <button className={css.cancel} onClick={closeConfirmModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPanel;
