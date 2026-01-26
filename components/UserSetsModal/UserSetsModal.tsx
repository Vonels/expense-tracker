// "use client";

// import { useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { userSettingsSchema } from "@/schemas/userSettingsSchema";
// import { AvatarField } from "./AvatarField";
// import { userService } from "@/lib/api/userService";
// import { useUserStore } from "@/lib/store/userStore";
// import styles from "./UserSetsModal.module.css";
// import axios from "axios";

// interface UserResponse {
//   name: string;
//   currency: string;
// }

// export const UserSetsModal = () => {
//   const router = useRouter();

//   const { name, currency, updateUser } = useUserStore();

//   const initialData = {
//     name: name || "",
//     currency: currency || "uah",
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
//           enableReinitialize
//           onSubmit={async (values, { setSubmitting }) => {
//             try {
//               const responseData: UserResponse =
//                 await userService.updateProfile(values);

//               updateUser({
//                 name: responseData.name,
//                 currency: responseData.currency,
//               });

//               console.log("Успіх! Профіль оновлено.");
//             } catch (error: unknown) {
//               if (axios.isAxiosError(error)) {
//                 const message =
//                   error.response?.data?.message || "Помилка збереження";
//                 console.error(message);
//               }
//             } finally {
//               setSubmitting(false);
//             }
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
//                       <option value="uah">₴ UAH</option>
//                       <option value="usd">$ USD</option>
//                       <option value="eur">€ EUR</option>
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
//                 {isSubmitting ? "Saving..." : "Save"}
//               </button>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

"use client";

import { useForm, Controller } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import { useAuthStore } from "@/lib/store/authStore";
import { AvatarField } from "./AvatarField";
import styles from "./UserSetsModal.module.css";
import { userService } from "@/lib/api/userService";
import toast from "react-hot-toast";
interface UserSettingsForm {
  name: string;
  currency: string;
}

interface CurrencyOption {
  value: string;
  label: string;
}

const options: CurrencyOption[] = [
  { value: "UAH", label: "₴ UAH" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
];

const customStyles: StylesConfig<CurrencyOption, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    border: state.isFocused
      ? "1px solid #0ef387"
      : "1px solid rgba(250, 250, 250, 0.2)",
    borderRadius: "12px",
    minHeight: "48px",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#0ef387",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 18px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fafafa",
    fontSize: "16px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#fafafa",
    "&:hover": { color: "#0ef387" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#111213",
    borderRadius: "12px",
    marginTop: "4px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 10,
  }),
  option: (base, state) => ({
    ...base,
    color: state.isSelected ? "#fafafa" : "rgba(250, 250, 250, 0.5)",

    backgroundColor: state.isSelected
      ? "#171719"
      : state.isFocused
        ? "rgba(255, 255, 255, 0.05)"
        : "transparent",

    borderRadius: "8px",
    cursor: "pointer",
    padding: "10px 14px",

    "&:active": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  }),
};

export const UserSetsModal = ({ onClose }: { onClose: () => void }) => {
  const { user, updateUser } = useAuthStore();

  const { control, handleSubmit, register } = useForm<UserSettingsForm>({
    defaultValues: {
      name: user?.name || "",
      currency: user?.currency || "UAH",
    },
  });

  const onSubmit = async (data: UserSettingsForm) => {
    try {
      const updatedData = await userService.updateProfile(data);

      updateUser({
        ...updatedData,
        avatarUrl: updatedData.avatarUrl ?? undefined,
      });

      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Profile settings</h2>

        <AvatarField />

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputsRow}>
            <div className={styles.currencyWrapper}>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select
                    instanceId="currency-select"
                    options={options}
                    styles={customStyles}
                    value={options.find((opt) => opt.value === field.value)}
                    onChange={(val) => field.onChange(val?.value)}
                    isSearchable={false}
                  />
                )}
              />
            </div>

            <div className={styles.nameWrapper}>
              <input
                {...register("name")}
                className={styles.input}
                placeholder="Name"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Save
          </button>
        </form>
      </div>
    </div>
  );
};
