"use client";

import React, { useState, useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  useFormikContext, // НОВЕ
} from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import css from "./TransactionForm.module.css";
import { useTransactionStore } from "@/lib/store/useTransactionStore"; // НОВЕ
import { useRouter } from "next/navigation"; // НОВЕ

interface FormValues {
  type: "incomes" | "expenses";
  date: string;
  time: string;
  category: string;
  sum: number | "";
  comment: string;
}

type TransactionFormProps = {
  onOpenCategories: (type: "incomes" | "expenses") => void;
  selectedCategoryName: string;
};

// НОВЕ:
const FormikSync = () => {
  const { setFieldValue } = useFormikContext<FormValues>();
  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory,
  );

  useEffect(() => {
    if (selectedCategory) {
      setFieldValue("category", selectedCategory.id);
    }
  }, [selectedCategory, setFieldValue]);

  return null;
};

// НОВЕ end

const validationSchema = Yup.object().shape({
  type: Yup.string().oneOf(["incomes", "expenses"]).required(),
  date: Yup.string().required("Обов’язкове поле"),
  time: Yup.string().required("Обов’язкове поле"),
  category: Yup.string().required("Оберіть категорію"),
  sum: Yup.number()
    .typeError("Сума повинна бути числом")
    .min(1, "Мінімум 1")
    .max(1000000, "Максимум 1,000,000")
    .required("Обов’язкове поле"),
  comment: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(48, "Максимум 48 символів")
    .optional(),
});

const TransactionForm = ({
  onOpenCategories,
  selectedCategoryName,
}: TransactionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory, // НОВЕ
  );
  const resetCategory = useTransactionStore((state) => state.resetCategory); // НОВЕ

  const initialValues: FormValues = {
    type: "expenses",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    category: "",
    sum: "",
    comment: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    setIsLoading(true);
    try {
      await axios.post("/transactions", values);
      toast.success("Транзакцію успішно додано!");
      resetForm();
      resetCategory(); // НОВЕ
    } catch (error: unknown) {
      let errorMsg = "Помилка запиту";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || "Помилка сервера";
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  return (
    <div className={css.formContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className={css.form}>
            <FormikSync /> {/* НОВЕ */}
            {/* Type */}
            <div className={css.radioGroup}>
              <label className={css.radioLabel}>
                <Field
                  type="radio"
                  name="type"
                  value="expenses"
                  className={css.radioInput}
                />
                Expense
              </label>
              <label className={css.radioLabel}>
                <Field
                  type="radio"
                  name="type"
                  value="incomes"
                  className={css.radioInput}
                />
                Income
              </label>
            </div>
            <div className={css.row}>
              <div className={css.fieldGroup}>
                <label className={css.label}>Date</label>
                <Field name="date" type="date" className={css.input} />
                <ErrorMessage name="date" component="p" className={css.error} />
              </div>
              <div className={css.fieldGroup}>
                <label className={css.label}>Time</label>
                <Field name="time" type="time" className={css.input} />
                <ErrorMessage name="time" component="p" className={css.error} />
              </div>
            </div>
            {/* Category */}
            <div className={css.fieldGroup}>
              <label className={css.label}>Category</label>
              <Field
                name="categoryDisplay"
                type="text"
                readOnly
                placeholder="Different"
                className={css.input}
                value={selectedCategory?.name || selectedCategoryName || ""} // НОВЕ
                // НОВЕ для onClick
                onClick={() => {
                  useTransactionStore
                    .getState()
                    .setTransactionType(values.type);
                  router.push("/categoriesModal");
                }}
              />
              {/* Прихований Field для зберігання ID */}
              <Field type="hidden" name="category" />
              <ErrorMessage
                name="category"
                component="p"
                className={css.error}
              />
            </div>
            <div className={css.fieldGroup}>
              <label className={css.label}>Sum</label>
              <div className={css.sumWrapper}>
                <Field
                  name="sum"
                  type="number"
                  placeholder="0.00"
                  className={css.input}
                />
                <span className={css.currency}>UAH</span>
              </div>
              <ErrorMessage name="sum" component="p" className={css.error} />
            </div>
            <div className={css.fieldGroup}>
              <label className={css.label}>Comment</label>
              <Field
                as="textarea"
                name="comment"
                placeholder="Enter text"
                className={`${css.input} ${css.textarea}`}
              />
              <ErrorMessage
                name="comment"
                component="p"
                className={css.error}
              />
            </div>
            <button
              type="submit"
              className={css.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Add"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm;
