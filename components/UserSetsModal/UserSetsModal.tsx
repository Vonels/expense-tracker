// "use client";

// import { useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { userSettingsSchema } from "@/schemas/userSettingsSchema";
// import { AvatarField } from "./AvatarField";
// import styles from "./UserSetsModal.module.css";

// export const UserSetsModal = () => {
//   const router = useRouter();

//   // Тут у майбутньому підтягнеш дані зі свого Store (Zustand/Redux)
//   const initialData = {
//     name: "Alex Rybachok",
//     currency: "uah",
//   };

//   const handleClose = useCallback(() => {
//     router.back();
//   }, [router]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") handleClose();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [handleClose]);

//   return (
//     <div
//       className={styles.backdrop}
//       onClick={(e) => e.target === e.currentTarget && handleClose()}
//     >
//       <div className={styles.modalContent}>
//         <button className={styles.closeBtn} onClick={handleClose}>
//           ×
//         </button>

//         <h2 className={styles.title}>Profile settings</h2>

//         <AvatarField />

//         <Formik
//           initialValues={initialData}
//           validationSchema={userSettingsSchema}
//           onSubmit={(values) => {
//             console.log("Збереження даних:", values);
//           }}
//         >
//           {({ isSubmitting }) => (
//             <Form className={styles.form}>
//               <div className={styles.inputsRow}>
//                 <div className={styles.currencyWrapper}>
//                   <div className={styles.customSelect}>
//                     <Field
//                       as="select"
//                       name="currency"
//                       className={styles.select}
//                     >
//                       <option value="uah" className={styles.option}>
//                         ₴ UAH
//                       </option>
//                       <option value="usd" className={styles.option}>
//                         $ USD
//                       </option>
//                       <option value="eur" className={styles.option}>
//                         € EUR
//                       </option>
//                     </Field>
//                     <span className={styles.selectArrow}></span>
//                   </div>
//                 </div>

//                 <div className={styles.nameWrapper}>
//                   <Field
//                     type="text"
//                     name="name"
//                     placeholder="Name"
//                     className={styles.input}
//                   />
//                   <ErrorMessage
//                     name="name"
//                     component="span"
//                     className={styles.error}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={styles.submitBtn}
//               >
//                 Save
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };
"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userSettingsSchema } from "@/schemas/userSettingsSchema";
import { AvatarField } from "./AvatarField";
import styles from "./UserSetsModal.module.css";

export const UserSetsModal = () => {
  const router = useRouter();

  const initialData = {
    name: "Alex Rybachok",
    currency: "uah",
    avatar: null, // Додаємо поле для файлу
  };

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={handleClose}>
          ×
        </button>
        <h2 className={styles.title}>Profile settings</h2>

        <Formik
          initialValues={initialData}
          validationSchema={userSettingsSchema}
          onSubmit={async (values, { setSubmitting }) => {
            // Створюємо FormData для відправки файлів та тексту разом
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("currency", values.currency);
            if (values.avatar) {
              formData.append("avatar", values.avatar);
            }

            try {
              console.log("Відправка на сервер через API...");
              // Тут твій запит: await axios.patch('/api/user', formData);
            } catch (error) {
              console.error(error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className={styles.form}>
              {/* Передаємо setFieldValue в AvatarField */}
              <AvatarField setFieldValue={setFieldValue} />

              <div className={styles.inputsRow}>
                <div className={styles.currencyWrapper}>
                  <div className={styles.customSelect}>
                    <Field
                      as="select"
                      name="currency"
                      className={styles.select}
                    >
                      <option value="uah">₴ UAH</option>
                      <option value="usd">$ USD</option>
                      <option value="eur">€ EUR</option>
                    </Field>
                    <span className={styles.selectArrow}></span>
                  </div>
                </div>

                <div className={styles.nameWrapper}>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className={styles.input}
                  />
                  <ErrorMessage
                    name="name"
                    component="span"
                    className={styles.error}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                Save
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};