"use client";

import React, { useState, useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import css from "./TransactionForm.module.css";
import { AntdDatePicker } from "../AntdDatePicker/AntdDatePicker";
import { AntdTimePicker } from "../AntdTimePicker/AntdTimePicker";

const FormikSyncedFields = ({ categoryId }: { categoryId: string }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (categoryId) {
      setFieldValue("category", categoryId);
    }
  }, [categoryId, setFieldValue]);

  return null;
};

interface FormValues {
  type: "incomes" | "expenses";
  date: string;
  time: string;
  category: string;
  sum: number | "";
  comment: string;
}

interface TransactionFormProps {
  onOpenCategories: (type: "incomes" | "expenses") => void;
  selectedCategoryName: string;
  selectedCategoryId: string;
}

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
  onOpenCategories,
  selectedCategoryName,
  selectedCategoryId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success("Transaction added successfully!");
      resetForm();
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
            <FormikSyncedFields categoryId={selectedCategoryId} />

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
                <input
                  type="radio"
                  name="type"
                  value="incomes"
                  checked={values.type === "incomes"}
                  onChange={() => {
                    setFieldValue("type", "incomes");
                    setFieldValue("category", "");
                  }}
                  className={css.radioInput}
                />
                Income
              </label>
            </div>

            <div className={css.row}>
              <div className={css.fieldGroup}>
                <label className={css.label}>Date</label>
                <div className={css.inputWrapper}>
                  <AntdDatePicker name="date" />
                  <svg className={css.customIcon} width="20" height="20">
                    <use href="/symbol-defs.svg#icon-calendar"></use>
                  </svg>
                </div>
                <ErrorMessage name="date" component="p" className={css.error} />
              </div>

              <div className={css.fieldGroup}>
                <label className={css.label}>Time</label>
                <div className={css.inputWrapper}>
                  <AntdTimePicker name="time" />
                  <svg className={css.customIcon} width="20" height="20">
                    <use href="/symbol-defs.svg#icon-clock"></use>
                  </svg>
                </div>
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
                value={selectedCategoryName || ""}
                onClick={() => onOpenCategories(values.type)}
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
