// "use client";
// import Image from "next/image";
// import { useAuthStore } from "@/lib/store/authStore";
// import { userService } from "@/lib/api/userService";
// import toast from "react-hot-toast";
// import styles from "./UserSetsModal.module.css";

// export const AvatarField = () => {
//   const { user, updateUser, setLoading } = useAuthStore();

//   const spritePath = "/symbol-defs.svg";

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const localPreview = URL.createObjectURL(file);
//     updateUser({ avatarUrl: localPreview });

//     const formData = new FormData();
//     formData.append("avatar", file);

//     setLoading(true);
//     try {
//       const { avatarUrl } = await userService.updateAvatar(formData);

//       if (localPreview.startsWith("blob:")) {
//         URL.revokeObjectURL(localPreview);
//       }

//       updateUser({ avatarUrl });
//       toast.success("Avatar updated!");
//     } catch {
//       toast.error("Failed to upload avatar");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemoveAvatar = async () => {
//     setLoading(true);
//     try {
//       await userService.deleteAvatar();
//       updateUser({ avatarUrl: "" });
//       toast.success("Avatar removed");
//     } catch {
//       toast.error("Failed to remove avatar");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isBlob = user?.avatarUrl?.startsWith("blob:");
//   const avatarSrc = isBlob
//     ? user?.avatarUrl
//     : user?.avatarUrl
//       ? `${user.avatarUrl}?t=${new Date().getTime()}`
//       : null;

//   return (
//     <div className={styles.avatarSection}>
//       <div className={styles.avatarCircle}>
//         {user?.avatarUrl ? (
//           <Image
//             src={avatarSrc || ""}
//             alt="User Avatar"
//             className={styles.avatarImg}
//             width={100}
//             height={100}
//             unoptimized
//             priority
//           />
//         ) : (
//           <svg className={styles.defaultAvatarIcon}>
//             <use href={`${spritePath}#icon-user`}></use>
//           </svg>
//         )}
//       </div>

//       <div className={styles.avatarActions}>
//         <label className={styles.uploadBtn}>
//           Upload new photo
//           <input
//             type="file"
//             hidden
//             onChange={handleFileChange}
//             accept="image/*"
//           />
//         </label>
//         <button
//           type="button"
//           className={styles.removeBtn}
//           onClick={handleRemoveAvatar}
//           disabled={!user?.avatarUrl}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };
"use client";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/authStore";
import { userService } from "@/lib/api/userService";
import toast from "react-hot-toast";
import styles from "./UserSetsModal.module.css";

export const AvatarField = () => {
  const { user, updateUser, setLoading } = useAuthStore();
  const spritePath = "/symbol-defs.svg";

  // Додаємо локальний стан для "свіжого" прев'ю, щоб не засмічувати глобальний стор битими blob
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Очищуємо локальне прев'ю при зміні користувача або закритті
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const avatarSrc = useMemo(() => {
    // 1. Якщо є свіжозавантажене прев'ю — воно найпріоритетніше
    if (previewUrl) return previewUrl;

    // 2. Якщо є посилання в профілі користувача
    if (user?.avatarUrl) {
      // Якщо це старий blob (наприклад, з минулої сесії) — ігноруємо його, щоб не було ERR_FILE_NOT_FOUND
      if (user.avatarUrl.startsWith("blob:")) return null;

      // Додаємо таймстамп для серверного фото, щоб оновити кеш
      return `${user.avatarUrl}?t=${new Date().getTime()}`;
    }

    return null;
  }, [user?.avatarUrl, previewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl); // Показуємо юзеру миттєво

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const { avatarUrl } = await userService.updateAvatar(formData);
      updateUser({ avatarUrl }); // Оновлюємо на постійне посилання з сервера
      setPreviewUrl(null); // Прибираємо тимчасовий blob
      toast.success("Avatar updated!");
    } catch {
      toast.error("Failed to upload avatar");
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarCircle}>
        {avatarSrc ? (
          <Image
            src={avatarSrc}
            alt="User Avatar"
            className={styles.avatarImg}
            width={100}
            height={100}
            unoptimized
            priority
          />
        ) : (
          <div className={styles.defaultAvatarContainer}>
            <svg className={styles.defaultAvatarIcon}>
              <use href={`${spritePath}#icon-user`}></use>
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
          onClick={async () => {
            setLoading(true);
            try {
              await userService.deleteAvatar();
              updateUser({ avatarUrl: "" });
              setPreviewUrl(null);
              toast.success("Avatar removed");
            } catch {
              toast.error("Failed to remove avatar");
            } finally {
              setLoading(false);
            }
          }}
          disabled={!user?.avatarUrl && !previewUrl}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
