// "use client";
// import { useMemo, useState, useEffect } from "react";
// import Image from "next/image";
// import { useAuthStore } from "@/lib/store/authStore";
// import { userService } from "@/lib/api/userService";
// import toast from "react-hot-toast";
// import styles from "./UserSetsModal.module.css";

// export const AvatarField = () => {
//   const { user, updateUser, setLoading } = useAuthStore();
//   const spritePath = "/symbol-defs.svg";

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   useEffect(() => {
//     return () => {
//       if (previewUrl?.startsWith("blob:")) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   const avatarSrc = useMemo(() => {
//     if (previewUrl) return previewUrl;

//     if (user?.avatarUrl) {
//       if (user.avatarUrl.startsWith("blob:")) return null;

//       return `${user.avatarUrl}?t=${new Date().getTime()}`;
//     }

//     return null;
//   }, [user?.avatarUrl, previewUrl]);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const localUrl = URL.createObjectURL(file);
//     setPreviewUrl(localUrl);

//     const formData = new FormData();
//     formData.append("avatar", file);

//     setLoading(true);
//     try {
//       const { avatarUrl } = await userService.updateAvatar(formData);
//       updateUser({ avatarUrl });
//       setPreviewUrl(null);
//       toast.success("Avatar updated!");
//     } catch {
//       toast.error("Failed to upload avatar");
//       setPreviewUrl(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.avatarSection}>
//       <div className={styles.avatarCircle}>
//         {avatarSrc ? (
//           <Image
//             src={avatarSrc}
//             alt="User Avatar"
//             className={styles.avatarImg}
//             width={100}
//             height={100}
//             unoptimized
//             priority
//           />
//         ) : (
//           <div className={styles.defaultAvatarContainer}>
//             <svg className={styles.defaultAvatarIcon}>
//               <use href={`${spritePath}#icon-user`}></use>
//             </svg>
//           </div>
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
//           onClick={async () => {
//             setLoading(true);
//             try {
//               await userService.deleteAvatar();
//               updateUser({ avatarUrl: "" });
//               setPreviewUrl(null);
//               toast.success("Avatar removed");
//             } catch {
//               toast.error("Failed to remove avatar");
//             } finally {
//               setLoading(false);
//             }
//           }}
//           disabled={!user?.avatarUrl && !previewUrl}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };
// "use client";
// import { useMemo, useState, useEffect } from "react";
// import Image from "next/image";
// import axios from "axios";
// import { useAuthStore } from "@/lib/store/authStore";
// import { userService } from "@/lib/api/userService";
// import toast from "react-hot-toast";
// import styles from "./UserSetsModal.module.css";
// interface AvatarFieldProps {
//   avatarUrl: string | null;
//   userName: string;
//   onAvatarChange: (newUrl: string) => void;
// }

// export const AvatarField = ({
//   avatarUrl: propsAvatarUrl,
//   userName,
//   onAvatarChange,
// }: AvatarFieldProps) => {
//   const { user, updateUser, setLoading } = useAuthStore();
//   const spritePath = "/symbol-defs.svg";

//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

//   useEffect(() => {
//     return () => {
//       if (previewUrl?.startsWith("blob:")) {
//         URL.revokeObjectURL(previewUrl);
//       }
//     };
//   }, [previewUrl]);

//   const avatarSrc = useMemo(() => {
//     // 1. Дивимось, що реально приходить в компонент
//     console.log("PROPS URL:", propsAvatarUrl);
//     console.log("STORE URL:", user?.avatarUrl);

//     if (previewUrl) return previewUrl; // Пріоритет: пропси або стор

//     const finalUrl = propsAvatarUrl || user?.avatarUrl;

//     if (finalUrl) {
//       return finalUrl.includes("?") ? finalUrl : `${finalUrl}?t=${Date.now()}`;
//     }

//     return null;
//   }, [propsAvatarUrl, previewUrl, user?.avatarUrl]);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const localUrl = URL.createObjectURL(file);
//     setPreviewUrl(localUrl);

//     const formData = new FormData();
//     formData.append("avatar", file);

//     setLoading(true);

//     try {
//       const response = await userService.updateAvatar(formData);

//       const freshUrl = `${response.avatarUrl}?v=${Date.now()}`;

//       updateUser({ avatarUrl: freshUrl });
//       onAvatarChange(freshUrl);

//       toast.success("Avatar updated!");

//       setTimeout(() => setPreviewUrl(null), 500);
//     } catch (error: unknown) {
//       toast.error("Upload failed");
//       setPreviewUrl(null);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className={styles.avatarSection}>
//       <div className={styles.avatarCircle}>
//         {avatarSrc ? (
//           <Image
//             src={avatarSrc}
//             alt={userName || "User Avatar"}
//             className={styles.avatarImg}
//             width={100}
//             height={100}
//             unoptimized
//             priority
//           />
//         ) : (
//           <div className={styles.defaultAvatarContainer}>
//             <svg className={styles.defaultAvatarIcon}>
//               <use href={`${spritePath}#icon-user`}></use>
//             </svg>
//           </div>
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
//           onClick={async () => {
//             if (!confirm("Are you sure?")) return;
//             setLoading(true);
//             try {
//               await userService.deleteAvatar();
//               updateUser({ avatarUrl: "" });
//               onAvatarChange("");
//               setPreviewUrl(null);
//               toast.success("Avatar removed");
//             } catch {
//               toast.error("Failed to remove");
//             } finally {
//               setLoading(false);
//             }
//           }}
//           disabled={!avatarSrc}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };

// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const localUrl = URL.createObjectURL(file);
//   setPreviewUrl(localUrl);

//   const formData = new FormData();
//   formData.append("avatar", file);

//   setLoading(true);
//   try {
//     const response = await userService.updateAvatar(formData);
//     const serverUrl = `${response.avatarUrl}?t=${Date.now()}`;
//     updateUser({ avatarUrl: serverUrl });
//     onAvatarChange(serverUrl);

//     toast.success("Avatar updated!");

//     setTimeout(() => setPreviewUrl(null), 200);
//   } catch (error: unknown) {
//     toast.error("Upload failed");
//     setPreviewUrl(null);
//   } finally {
//     setLoading(false);
//   }
// };

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
    if (propsAvatarUrl) {
      setPreviewUrl(null);
    }
  }, [propsAvatarUrl]);

  const avatarSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    const finalUrl = user?.avatarUrl || propsAvatarUrl;
    return finalUrl || null;
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

      // Очищуємо стор і локальний стан
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
