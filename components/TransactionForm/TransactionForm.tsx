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
import { AntdDatePicker } from "../AntdDatePicker/AntdDatePicker";
import { AntdTimePicker } from "../AntdTimePicker/AntdTimePicker";
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
  selectedCategoryId: string;
};

const FormikSync = () => {
  const { setFieldValue } = useFormikContext<FormValues>();
  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory
  );

  useEffect(() => {
    if (selectedCategory) {
      setFieldValue("category", selectedCategory.id);
    }
  }, [selectedCategory, setFieldValue]);

  return null;
};

const validationSchema = Yup.object().shape({
  type: Yup.string().oneOf(["incomes", "expenses"]).required(),
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
  category: Yup.string().required("Please select a category"),
  sum: Yup.number()
    .typeError("Sum must be a number")
    .min(1, "Minimum amount is 1")
    .max(1000000, "Maximum amount is 1,000,000")
    .required("Sum is required"),
  comment: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(48, "Maximum 48 characters")
    .optional(),
});

const TransactionForm: React.FC<TransactionFormProps> = ({
  selectedCategoryName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory // НОВЕ
  );
  const resetCategory = useTransactionStore((state) => state.resetCategory);

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
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    try {
      await axios.post("/transactions", values);
      toast.success("Transaction added successfully!");
      resetForm();
      resetCategory();
    } catch (error: unknown) {
      let errorMsg = "Request failed";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || "Server error";
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.formContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className={css.form}>
            <FormikSync />

            <div className={css.radioGroup}>
              <label className={css.radioLabel}>
                <Field
                  type="radio"
                  name="type"
                  value="expenses"
                  className={css.radioInput}
                  onChange={() => {
                    setFieldValue("type", "expenses");
                    setFieldValue("category", "");
                    resetCategory();
                  }}
                />
                Expense
              </label>
              <label className={css.radioLabel}>
                <input
                  type="radio"
                  name="type"
                  value="incomes"
                  onChange={() => {
                    setFieldValue("type", "incomes");
                    setFieldValue("category", "");
                    resetCategory();
                  }}
                  className={css.radioInput}
                />
                Income
              </label>
            </div>

            <div className={css.row}>
              <div className={css.fieldGroup}>
                <label className={css.label}>Date</label>
                <AntdDatePicker name="date" />
                <ErrorMessage name="date" component="p" className={css.error} />
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label}>Time</label>
                <AntdTimePicker name="time" />
                <ErrorMessage name="time" component="p" className={css.error} />
              </div>
            </div>

            <div className={css.fieldGroup}>
              <label className={css.label}>Category</label>
              <input
                type="text"
                readOnly
                placeholder="Different"
                className={css.input}
                value={selectedCategory?.name || selectedCategoryName || ""} // НОВЕ
                // НОВЕ для onClick/Полина для тебя
                onClick={() => {
                  useTransactionStore
                    .getState()
                    .setTransactionType(values.type);
                  router.push("/categoriesModal");
                }}
              />
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
                {/* //заглушка */}
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
