"use client";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { userService } from "@/lib/api/userService";
import toast from "react-hot-toast";
import styles from "./UserSetsModal.module.css";
import axios from "axios";
interface AvatarFieldProps {
  avatarUrl: string | null;
  userName: string;
  onAvatarChange: (newUrl: string) => void;
}

export const AvatarField = ({
  avatarUrl: propsAvatarUrl,
  userName,
  onAvatarChange,
}: AvatarFieldProps) => {
  const { user, updateUser, setLoading } = useAuthStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const avatarSrc = useMemo(() => {
    if (previewUrl) return previewUrl;

    const finalUrl = user?.avatarUrl || propsAvatarUrl;

    if (!finalUrl || (typeof finalUrl === "string" && finalUrl.trim() === "")) {
      return null;
    }

    if (typeof finalUrl === "string" && !finalUrl.includes("?")) {
      return `${finalUrl}?t=${Date.now()}`;
    }

    return finalUrl;
  }, [previewUrl, user?.avatarUrl, propsAvatarUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const response = await userService.updateAvatar(formData);
      const freshUrl = `${response.avatarUrl}?v=${Date.now()}`;

      updateUser({ avatarUrl: freshUrl });
      onAvatarChange(freshUrl);
      toast.success("Avatar updated!");
    } catch {
      toast.error("Upload failed");
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  };
  const handleRemove = async () => {
    if (!confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await userService.deleteAvatar();

      updateUser({ avatarUrl: null });
      onAvatarChange("");
      setPreviewUrl(null);

      toast.success("Avatar removed");
    } catch (error: unknown) {
      let message = "Failed to remove";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarCircle}>
        {avatarSrc ? (
          <Image
            key={avatarSrc}
            src={avatarSrc}
            alt={userName || "User Avatar"}
            className={styles.avatarImg}
            width={100}
            height={100}
            unoptimized
            priority
          />
        ) : (
          <div className={styles.defaultAvatarContainer}>
            <svg className={styles.defaultAvatarIcon}>
              <use href="/symbol-defs.svg#icon-user"></use>
            </svg>
          </div>
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
          onClick={handleRemove}
          disabled={!avatarSrc}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
