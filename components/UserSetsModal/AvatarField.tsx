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
    if (user?.avatarUrl) {
      return `${user.avatarUrl}?t=${new Date().getTime()}`;
    }
    return null;
  }, [user?.avatarUrl, previewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const { avatarUrl } = await userService.updateAvatar(formData);

      updateUser({ avatarUrl });

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
            if (!confirm("Are you sure you want to remove your avatar?"))
              return;
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
