"use client";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { userService } from "@/lib/api/userService";
import toast from "react-hot-toast";
import styles from "./UserSetsModal.module.css";

export const AvatarField = () => {
  const { user, updateUser } = useAuthStore();

  const spritePath = "/symbol-defs.svg";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    updateUser({ avatarUrl: localPreview });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const { avatarUrl } = await userService.updateAvatar(formData);
      updateUser({ avatarUrl });
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to upload to server, but preview is set");
    }
  };
  const handleRemoveAvatar = async () => {
    try {
      await userService.deleteAvatar();
      updateUser({ avatarUrl: "" });
      toast.success("Avatar removed");
    } catch {
      toast.error("Failed to remove avatar");
    }
  };

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarCircle}>
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="User Avatar"
            className={styles.avatarImg}
            width={100}
            height={100}
          />
        ) : (
          <svg className={styles.defaultAvatarIcon}>
            <use href={`${spritePath}#icon-user`}></use>
          </svg>
        )}
      </div>

      <div className={styles.avatarActions}>
        <label className={styles.uploadBtn}>
          Upload new photo
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={handleRemoveAvatar}
          disabled={!user?.avatarUrl}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
