"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userSettingsSchema } from "@/schemas/userSettingsSchema";
import { AvatarField } from "./AvatarField";
import { userService } from "@/lib/api/userService";
import { useUserStore } from "@/lib/store/userStore";
import styles from "./UserSetsModal.module.css";
import axios from "axios";

interface UserResponse {
  name: string;
  currency: string;
}

export const UserSetsModal = () => {
  const router = useRouter();

  const { name, currency, updateUser } = useUserStore();

  const initialData = {
    name: name || "",
    currency: currency || "uah",
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

        <AvatarField />

        <Formik
          initialValues={initialData}
          validationSchema={userSettingsSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const responseData: UserResponse =
                await userService.updateProfile(values);

              updateUser({
                name: responseData.name,
                currency: responseData.currency,
              });

              console.log("Успіх! Профіль оновлено.");
            } catch (error: unknown) {
              if (axios.isAxiosError(error)) {
                const message =
                  error.response?.data?.message || "Помилка збереження";
                console.error(message);
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
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
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
