"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select, { StylesConfig } from "react-select";
import { useAuthStore } from "@/lib/store/authStore";
import { AvatarField } from "./AvatarField";
import styles from "./UserSetsModal.module.css";
import { userService } from "@/lib/api/userService";
import toast from "react-hot-toast";
import axios from "axios";

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserSettingsForm>({
    values: {
      name: user?.name || "",
      currency: user?.currency || "UAH",
    },
  });
  useEffect(() => {
    const syncUser = async () => {
      if (!user) {
        try {
          const response = await axios.get("/api/users/current");
          console.log("Отримані дані:", response.data);
          updateUser(response.data);
        } catch (e) {
          console.error("Помилка завантаження профілю:", e);
        }
      }
    };

    syncUser();
  }, [user, updateUser]);
  const onSubmit = async (data: UserSettingsForm) => {
    try {
      const formattedData = {
        name: data.name,
        currency: data.currency.toLowerCase(),
      };

      const updatedData = await userService.updateProfile(formattedData);

      updateUser({
        name: updatedData.name,
        currency: updatedData.currency.toUpperCase(),
        ...(updatedData.avatarUrl ? { avatarUrl: updatedData.avatarUrl } : {}),
      });

      toast.success("Profile updated!");
    } catch (error: unknown) {
      let errorMessage = "Failed to update settings";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className={styles.title}>Profile settings</h2>

        <AvatarField />

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
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
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                placeholder="Name"
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name.message}</span>
              )}
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
