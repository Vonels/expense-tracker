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
import { AntdTimePicker } from "../TimePicker/TimePicker";
import { useTransactionStore } from "@/lib/store/useTransactionStore";
import { useRouter } from "next/navigation";
import { DatePicker } from "../DatePicker/DatePicker";

interface FormValues {
  type: "incomes" | "expenses";
  date: string;
  time: string;
  category: string;
  sum: number | "";
  comment: string;
}

interface TransactionData {
  _id: string;
  type: "incomes" | "expenses";
  date: string;
  time: string;
  category: {
    _id: string;
    categoryName: string;
  };
  sum: number;
  comment: string;
}

type TransactionFormProps = {
  onOpenCategories: (type: "incomes" | "expenses") => void;
  selectedCategoryName: string;
  currentTransaction?: TransactionData | null;
  isEditing?: boolean;
  onClose?: () => void;
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
  currentTransaction,
  isEditing = false,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory
  );
  const resetCategory = useTransactionStore((state) => state.resetCategory);
  const setCategory = useTransactionStore((state) => state.setCategory);

  useEffect(() => {
    if (isEditing && currentTransaction?.category) {
      setCategory(
        currentTransaction.category._id,
        currentTransaction.category.categoryName
      );
      useTransactionStore
        .getState()
        .setTransactionType(currentTransaction.type);
    }
    return () => {
      resetCategory();
    };
  }, [isEditing, currentTransaction, setCategory, resetCategory]);

  const initialValues: FormValues = {
    type: currentTransaction?.type || "expenses",
    date: currentTransaction?.date || new Date().toISOString().split("T")[0],
    time: currentTransaction?.time || new Date().toTimeString().slice(0, 5),
    category: currentTransaction?.category._id || "",
    sum: currentTransaction?.sum || "",
    comment: currentTransaction?.comment || "",
  };

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    setIsLoading(true);
    try {
      if (isEditing && currentTransaction?._id) {
        await axios.patch(
          `/transactions/${values.type}/${currentTransaction._id}`,
          {
            date: values.date,
            time: values.time,
            category: values.category,
            sum: values.sum,
            comment: values.comment,
          }
        );
        toast.success("Transaction updated successfully!");
      } else {
        await axios.post("/transactions", values);
        toast.success("Transaction added successfully!");
        resetForm();
        resetCategory();
      }
      router.refresh();
      if (onClose) {
        onClose();
      }
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

  const buttonText = isEditing ? "Save" : "Add";
  const loadingText = isEditing ? "Saving..." : "Sending...";

  return (
    <div className={css.formContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
                  checked={values.type === "incomes"}
                  className={css.radioInput}
                />
                Income
              </label>
            </div>

            <div className={css.row}>
              <div className={css.fieldGroup}>
                <label className={css.label}>Date</label>
                <DatePicker name="date" />
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
              {isLoading ? loadingText : buttonText}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm;

{
  /* <TransactionForm
  isEditing={true}
  currentTransaction={selectedTransaction}
  onClose={() => setModalIsOpen(false)}
/>; */
}
