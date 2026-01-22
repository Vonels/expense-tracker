// "use client";

// import { useRef } from "react";
// import Image from "next/image";
// import { useUserStore } from "@/lib/store/userStore";
// import { userService } from "@/lib/api/userService";
// import styles from "./UserSetsModal.module.css";

// export const AvatarField = () => {
//   const { user, updateUser } = useUserStore();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("avatar", file);

//     try {
//       // добавить в сервер
//       const response = await userService.updateAvatar(formData);
//       updateUser({ avatarUrl: response.avatarUrl });
//       console.log("Фото оновлено");
//     } catch (error) {
//       console.error("Помилка завантаження фото", error);
//     }
//   };

//   // добавить в сервер
//   const handleRemove = async () => {
//     try {
//       await userService.deleteAvatar();
//       updateUser({ avatarUrl: null });

//       if (fileInputRef.current) fileInputRef.current.value = "";
//     } catch (error) {
//       console.error("Помилка видалення фото", error);
//     }
//   };

//   return (
//     <div className={styles.avatarSection}>
//       <div className={styles.avatarCircle}>
//         {user?.avatarUrl ? (
//           <Image
//             src={user.avatarUrl}
//             alt="Avatar"
//             className={styles.avatarImg}
//             width={100}
//             height={100}
//             unoptimized
//           />
//         ) : (
//           <span className={styles.avatarInitial}>
//             {user?.name?.charAt(0).toUpperCase() || "V"}
//           </span>
//         )}
//       </div>

//       <div className={styles.avatarActions}>
//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           hidden
//           accept="image/*"
//         />
//         <button
//           type="button"
//           onClick={() => fileInputRef.current?.click()}
//           className={styles.uploadBtn}
//         >
//           Upload new photo
//         </button>
//         <button
//           type="button"
//           className={styles.removeBtn}
//           onClick={handleRemove}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };
"use client";

import { useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/lib/store/userStore";
import { userService } from "@/lib/api/userService";
import styles from "./UserSetsModal.module.css";

export const AvatarField = () => {
  const { user, updateUser } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await userService.updateAvatar(formData);

      updateUser({ avatarUrl: response.avatarUrl });

      console.log("Аватар успішно оновлено!");
    } catch (error) {
      console.error("Помилка завантаження аватара:", error);
      // треба додати пуш-повідомлення з помилкою
    }
  };

  const handleRemove = async () => {
    try {
      await userService.deleteAvatar();

      updateUser({ avatarUrl: null });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Помилка видалення аватара:", error);
    }
  };

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarCircle}>
        {user?.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="Avatar"
            className={styles.avatarImg}
            width={100}
            height={100}
            unoptimized
          />
        ) : (
          <span className={styles.avatarInitial}>
            {user?.name?.charAt(0).toUpperCase() || "V"}
          </span>
        )}
      </div>

      <div className={styles.avatarActions}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
          accept="image/*"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={styles.uploadBtn}
        >
          Upload new photo
        </button>

        <button
          type="button"
          className={styles.removeBtn}
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
