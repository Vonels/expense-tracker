// "use client";

// import { useState, useRef } from "react";
// import styles from "./UserSetsModal.module.css";
// import Image from "next/image";
// export const AvatarField = () => {
//   const [preview, setPreview] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const objectUrl = URL.createObjectURL(file);
//       setPreview(objectUrl);
//     }
//   };
//   return (
//     <div className={styles.avatarSection}>
//       <div className={styles.avatarCircle}>
//         {preview ? (
//           <Image
//             src={preview}
//             alt="Avatar"
//             className={styles.avatarImg}
//             width={100}
//             height={100}
//             unoptimized
//           />
//         ) : (
//           <span className={styles.avatarInitial}>V</span>
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
//           onClick={handleUploadClick}
//           className={styles.uploadBtn}
//         >
//           Upload new photo
//         </button>
//         <button
//           type="button"
//           className={styles.removeBtn}
//           onClick={() => setPreview(null)}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// };
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "./UserSetsModal.module.css";

interface AvatarFieldProps {
  setFieldValue: (
    field: string,
    value: File | null,
    shouldValidate?: boolean,
  ) => void;
}

export const AvatarField = ({ setFieldValue }: AvatarFieldProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      setFieldValue("avatar", file);
    }
  };

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);

    setFieldValue("avatar", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarCircle}>
        {preview ? (
          <Image
            src={preview}
            alt="Avatar Preview"
            className={styles.avatarImg}
            width={100}
            height={100}
            unoptimized
          />
        ) : (
          <span className={styles.avatarInitial}>V</span>
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
