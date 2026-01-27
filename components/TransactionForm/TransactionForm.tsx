"use client";

import React, { useState, useEffect } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  useFormikContext,
  FieldProps,
} from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import css from "./TransactionForm.module.css";

import { useTransactionStore } from "@/lib/store/useTransactionStore";
import { useRouter } from "next/navigation";
import { DatePicker } from "../DatePicker/DatePicker";
import { CustomTimePicker } from "../TimePicker/TimePicker";
import { TransactionData } from "@/types/transactions";
import { useAuthStore } from "@/lib/store/authStore";
import { Icon } from "../Icon/Icon";
import * as api from "@/lib/api/clientApi";
import dayjs from "dayjs";

interface FormValues {
  type: "incomes" | "expenses";
  date: string;
  time: string;
  category: string;
  sum: number;
  comment: string;
}

interface TransactionFormProps {
  onOpenCategories?: (type: "incomes" | "expenses") => void;
  selectedCategoryName?: string;
  currentTransaction?: TransactionData | null;
  isEditing?: boolean;
  onClose?: () => void;
}

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
  currentTransaction,
  isEditing = false,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const currentCurrency = user?.currency || "UAH";

  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory
  );
  const resetCategory = useTransactionStore((state) => state.resetCategory);
  const setCategory = useTransactionStore((state) => state.setCategory);

  // useEffect(() => {
  //   if (isEditing && currentTransaction?.category) {
  //     setCategory(
  //       currentTransaction.category._id,
  //       currentTransaction.category.categoryName
  //     );
  //     useTransactionStore
  //       .getState()
  //       .setTransactionType(currentTransaction.type);
  //   }
  //   return () => {
  //     resetCategory();
  //   };
  // }, [isEditing, currentTransaction, setCategory, resetCategory]);

  const initialValues: FormValues = {
    type: "expenses",
    date: "",
    time: "",
    category: "",
    sum: 0,
    comment: "",
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    const formattedDate = values ? dayjs(values.date).format("YYYY-MM-DD") : "";
    const formattedTime = values.time.slice(0, 5);
    // const payload = values.time.slice(0, 5);

    // console.log(payload);
    console.log(formattedDate);
    setIsLoading(true);

    const responseData = {
      ...values,
      date: formattedDate,
      time: formattedTime,
    };

    await api.createTransaction(responseData);
    // try {
    // if (isEditing && currentTransaction?._id) {
    //   await api.updateTransaction(
    //     values.type,
    //     currentTransaction._id,
    //     values
    //   );
    //   toast.success("Transaction updated successfully!");
    // } else {

    toast.success("Transaction added successfully!");

    resetForm();
    resetCategory();
  };

  // router.refresh();

  // const targetPath =
  //   values.type === "expenses"
  //     ? "transaction/history/expense"
  //     : "transaction/history/incomes";
  // router.push(targetPath);

  // if (onClose) onClose();
  // } catch (error: unknown) {
  //   let errorMsg = "Request failed";
  //   if (axios.isAxiosError(error)) {
  //     errorMsg = error.response?.data?.message || "Server error";
  //   }
  //   toast.error(errorMsg);
  // } finally {
  //   setIsLoading(false);
  // }
  // };

  // const buttonText = isEditing ? "Save" : "Add";
  // const loadingText = isEditing ? "Saving..." : "Sending...";

  return (
    <div className={css.formContainer}>
      {onClose && (
        <button
          type="button"
          className={css.closeBtn}
          onClick={onClose}
          aria-label="Close form"
        >
          <Icon id="icon-Close" className={css.closeBtnIcon} />
        </button>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className={css.form}>
            <FormikSync />

            <div
              className={css.radioGroup}
              role="radiogroup"
              aria-label="Transaction type"
            >
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
                  checked={values.type === "incomes"}
                  className={css.radioInput}
                />
                Income
              </label>
            </div>

            <div className={css.row}>
              <div className={css.fieldGroup}>
                <label htmlFor="date-picker" className={css.label}>
                  Date
                </label>
                <Field name="date">
                  {({ field, meta, form }: FieldProps) => (
                    <DatePicker
                      id="date-picker"
                      name={field.name}
                      value={field.value}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                      error={meta.touched && meta.error}
                    />
                  )}
                </Field>
                <ErrorMessage name="date" component="p" className={css.error} />
              </div>

              <div className={css.fieldGroup}>
                <label htmlFor="time-picker" className={css.label}>
                  Time
                </label>
                <CustomTimePicker id="time-picker" name="time" />
                <ErrorMessage name="time" component="p" className={css.error} />
              </div>
            </div>

            <div className={css.fieldGroup}>
              <label htmlFor="category-select" className={css.label}>
                Category
              </label>
              <input
                id="category-select"
                type="text"
                role="button"
                aria-haspopup="dialog"
                readOnly
                placeholder="Different"
                className={`${css.input} ${
                  touched.category && errors.category ? css.inputError : ""
                }`}
                value={selectedCategory?.name || ""}
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
              <label htmlFor="sum-input" className={css.label}>
                Sum
              </label>
              <div className={css.sumWrapper}>
                <Field name="sum">
                  {({ field, meta }: FieldProps<FormValues["sum"]>) => (
                    <input
                      {...field}
                      id="sum-input"
                      type="number"
                      placeholder="0.00"
                      aria-invalid={meta.touched && !!meta.error}
                      aria-errormessage="sum-error"
                      className={`${css.input} ${
                        meta.touched && meta.error ? css.inputError : ""
                      }`}
                    />
                  )}
                </Field>
                <span className={css.currency}>{currentCurrency}</span>
              </div>
              <ErrorMessage name="sum">
                {(msg) => (
                  <p id="sum-error" role="alert" className={css.error}>
                    {msg}
                  </p>
                )}
              </ErrorMessage>
            </div>

            <div className={css.fieldGroup}>
              <label htmlFor="comment" className={css.label}>
                Comment
              </label>
              <Field
                as="textarea"
                id="comment"
                name="comment"
                placeholder="Enter text"
                maxLength={48}
                className={`${css.input} ${css.textarea} ${
                  touched.comment && errors.comment ? css.inputError : ""
                }`}
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
              {/* {isLoading ? loadingText : buttonText} */}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm;
