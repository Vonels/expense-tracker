// "use client";

// import { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Select, { StylesConfig } from "react-select";
// import { useAuthStore } from "@/lib/store/authStore";
// import { AvatarField } from "./AvatarField";
// import styles from "./UserSetsModal.module.css";
// import { userService } from "@/lib/api/userService";
// import toast from "react-hot-toast";
// import axios from "axios";

// interface UserSettingsForm {
//   name: string;
//   currency: string;
// }

// interface CurrencyOption {
//   value: string;
//   label: string;
// }

// const options: CurrencyOption[] = [
//   { value: "UAH", label: "₴ UAH" },
//   { value: "USD", label: "$ USD" },
//   { value: "EUR", label: "€ EUR" },
// ];

// const customStyles: StylesConfig<CurrencyOption, false> = {
//   control: (base, state) => ({
//     ...base,
//     backgroundColor: "transparent",
//     border: state.isFocused
//       ? "1px solid #0ef387"
//       : "1px solid rgba(250, 250, 250, 0.2)",
//     borderRadius: "12px",
//     minHeight: "48px",
//     boxShadow: "none",
//     cursor: "pointer",
//     "&:hover": {
//       borderColor: "#0ef387",
//     },
//   }),
//   valueContainer: (base) => ({
//     ...base,
//     padding: "0 18px",
//   }),
//   singleValue: (base) => ({
//     ...base,
//     color: "#fafafa",
//     fontSize: "16px",
//   }),
//   indicatorSeparator: () => ({
//     display: "none",
//   }),
//   dropdownIndicator: (base) => ({
//     ...base,
//     color: "#fafafa",
//     "&:hover": { color: "#0ef387" },
//   }),
//   menu: (base) => ({
//     ...base,
//     backgroundColor: "#111213",
//     borderRadius: "12px",
//     marginTop: "4px",
//     border: "1px solid rgba(255, 255, 255, 0.1)",
//     zIndex: 10,
//   }),
//   option: (base, state) => ({
//     ...base,
//     color: state.isSelected ? "#fafafa" : "rgba(250, 250, 250, 0.5)",
//     backgroundColor: state.isSelected
//       ? "#171719"
//       : state.isFocused
//         ? "rgba(255, 255, 255, 0.05)"
//         : "transparent",
//     borderRadius: "8px",
//     cursor: "pointer",
//     padding: "10px 14px",
//     "&:active": {
//       backgroundColor: "rgba(255, 255, 255, 0.1)",
//     },
//   }),
// };

// export const UserSetsModal = ({ onClose }: { onClose: () => void }) => {
//   const { user, updateUser } = useAuthStore();

//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   const {
//     control,
//     handleSubmit,
//     register,
//     formState: { errors },
//   } = useForm<UserSettingsForm>({
//     values: {
//       name: user?.name || "",
//       currency: user?.currency || "UAH",
//     },
//   });
//   useEffect(() => {
//     const syncUser = async () => {
//       if (!user) {
//         try {
//           const response = await axios.get("/api/users/current");
//           console.log("Отримані дані:", response.data);
//           updateUser(response.data);
//         } catch (e) {
//           console.error("Помилка завантаження профілю:", e);
//         }
//       }
//     };

//     syncUser();
//   }, [user, updateUser]);
//   const onSubmit = async (data: UserSettingsForm) => {
//     try {
//       const formattedData = {
//         name: data.name,
//         currency: data.currency.toLowerCase(),
//       };

//       const updatedData = await userService.updateProfile(formattedData);

//       updateUser({
//         name: updatedData.name,
//         currency: updatedData.currency.toUpperCase(),
//         ...(updatedData.avatarUrl ? { avatarUrl: updatedData.avatarUrl } : {}),
//       });

//       toast.success("Profile updated!");
//     } catch (error: unknown) {
//       let errorMessage = "Failed to update settings";

//       if (axios.isAxiosError(error)) {
//         errorMessage = error.response?.data?.message || error.message;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }

//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className={styles.backdrop} onClick={onClose}>
//       <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//         <button
//           className={styles.closeBtn}
//           onClick={onClose}
//           aria-label="Close modal"
//         >
//           ×
//         </button>
//         <h2 className={styles.title}>Profile settings</h2>

//         <AvatarField />

//         <form
//           className={styles.form}
//           onSubmit={handleSubmit(onSubmit)}
//           noValidate
//         >
//           <div className={styles.inputsRow}>
//             <div className={styles.currencyWrapper}>
//               <Controller
//                 name="currency"
//                 control={control}
//                 render={({ field }) => (
//                   <Select
//                     instanceId="currency-select"
//                     options={options}
//                     styles={customStyles}
//                     value={options.find((opt) => opt.value === field.value)}
//                     onChange={(val) => field.onChange(val?.value)}
//                     isSearchable={false}
//                   />
//                 )}
//               />
//             </div>

//             <div className={styles.nameWrapper}>
//               <input
//                 {...register("name", {
//                   required: "Name is required",
//                   minLength: {
//                     value: 2,
//                     message: "Name must be at least 2 characters",
//                   },
//                 })}
//                 className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
//                 placeholder="Name"
//               />
//               {errors.name && (
//                 <span className={styles.errorText}>{errors.name.message}</span>
//               )}
//             </div>
//           </div>

//           <button type="submit" className={styles.submitBtn}>
//             Save
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select, { StylesConfig } from "react-select";
import toast from "react-hot-toast";
import axios from "axios";

import { useAuthStore } from "@/lib/store/authStore";
import { userService } from "@/lib/api/userService";
import { AvatarField } from "./AvatarField";
import styles from "./UserSetsModal.module.css";
import { getMe } from "@/lib/api/clientApi";

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
    "&:hover": { borderColor: "#0ef387" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 18px" }),
  singleValue: (base) => ({ ...base, color: "#fafafa", fontSize: "16px" }),
  indicatorSeparator: () => ({ display: "none" }),
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
  }),
};

const validationSchema = Yup.object({
  name: Yup.string().min(2, "Too short!").required("Required"),
  currency: Yup.string().required("Required"),
});

export const UserSetsModal = ({ onClose }: { onClose: () => void }) => {
  const { user, updateUser, _hasHydrated } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      currency: user?.currency || "UAH",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedData = await userService.updateProfile({
          name: values.name,
          currency: values.currency.toLowerCase(),
        });

        updateUser({
          name: updatedData.name,
          currency: updatedData.currency.toUpperCase(),
        });

        toast.success("Profile updated!");
        onClose();
      } catch (error: unknown) {
        let errorMessage = "Update failed";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        }
        toast.error(errorMessage);
      }
    },
  });

  useEffect(() => {
    const syncUser = async () => {
      if (!_hasHydrated) return;

      try {
        const userData = await getMe();
        const formattedData = {
          ...userData,
          name: userData.name || "",
          avatarUrl: userData.avatarUrl || null,
          currency: (userData.currency || "UAH").toUpperCase(),
        };

        updateUser(formattedData);

        formik.setValues({
          name: formattedData.name,
          currency: formattedData.currency,
        });
      } catch (e) {
        console.error("Sync error:", e);
      }
    };

    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!_hasHydrated) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Profile settings</h2>

        <AvatarField
          key={user?.avatarUrl || "default"}
          avatarUrl={user?.avatarUrl || null}
          userName={user?.name || "User"}
          onAvatarChange={(newUrl) => {
            updateUser({ avatarUrl: newUrl });
          }}
        />
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <div className={styles.inputsRow}>
            <div className={styles.currencyWrapper}>
              <Select
                instanceId="currency-select"
                options={options}
                styles={customStyles}
                value={options.find(
                  (opt) => opt.value === formik.values.currency
                )}
                onChange={(option) =>
                  formik.setFieldValue("currency", option?.value)
                }
                isSearchable={false}
              />
            </div>

            <div className={styles.nameWrapper}>
              <input
                name="name"
                className={`${styles.input} ${formik.errors.name ? styles.inputError : ""}`}
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <span className={styles.errorText}>{formik.errors.name}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};
