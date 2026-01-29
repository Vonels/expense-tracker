"use client";

import React, { useEffect, useMemo } from "react";
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
import { toast } from "react-hot-toast";
import css from "./TransactionForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTransactionStore } from "@/lib/store/useTransactionStore";
import { useRouter, usePathname } from "next/navigation";
import { DatePicker } from "../DatePicker/DatePicker";
import { CustomTimePicker } from "../TimePicker/TimePicker";
import {
  CategoryData,
  TransactionData,
  TransactionFormValues,
  TransactionType,
} from "@/types/transactions";
import { useAuthStore } from "@/lib/store/authStore";
import { Icon } from "../Icon/Icon";
import dayjs from "dayjs";
import { useUserStore } from "@/lib/store/userStore";
import { createTransaction, updateTransaction } from "@/lib/api/clientApi";
import axios from "axios";

interface TransactionFormProps {
  onOpenCategories?: (type: TransactionType) => void;
  selectedCategoryName?: CategoryData;
  currentTransaction?: TransactionData | null;
  isEditing?: boolean;
  onClose?: () => void;
}

const FormikSync = () => {
  const { setFieldValue } = useFormikContext<TransactionFormValues>();
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

const FormikAutoSave = () => {
  const { values, dirty } = useFormikContext<TransactionFormValues>();
  const setDraftData = useTransactionStore((state) => state.setDraftData);

  useEffect(() => {
    if (dirty) {
      const timeout = setTimeout(() => {
        setDraftData(values);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [values, setDraftData, dirty]);

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
    .optional()
    .required("Comment is required"),
});

const TransactionForm: React.FC<TransactionFormProps> = ({
  currentTransaction,
  isEditing = false,
  onClose,
  selectedCategoryName,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useQueryClient();

  const setTransactionType = useTransactionStore(
    (state) => state.setTransactionType
  );
  const resetCategory = useTransactionStore((state) => state.resetCategory);
  const setCategory = useTransactionStore((state) => state.setCategory);
  const transactionType = useTransactionStore((state) => state.transactionType);
  const selectedCategory = useTransactionStore(
    (state) => state.selectedCategory
  );
  const draftData = useTransactionStore((state) => state.draftData);
  const resetDraft = useTransactionStore((state) => state.resetDraft);

  const { transactionsTotal, updateTotals } = useUserStore();

  const user = useAuthStore((state) => state.user);
  const currentCurrency = user?.currency || "UAH";

  const transactionId = useMemo(() => {
    return currentTransaction?.transaction?._id;
  }, [currentTransaction]);

  const updateMutation = useMutation({
    mutationFn: ({
      type,
      id,
      payload,
    }: {
      type: TransactionType;
      id: string;
      payload: TransactionFormValues;
    }) => updateTransaction(type, id, payload),
    onSuccess: () => {
      toast.success("Updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      if (onClose) onClose();
    },
    onError: (error: unknown) => {
      let errorMsg = "Request failed";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || "Update failed";
      }
      toast.error(errorMsg);
    },
  });

  useEffect(() => {
    return () => {
      resetCategory();
    };
  }, [resetCategory]);

  useEffect(() => {
    if (isEditing && currentTransaction) {
      const data = currentTransaction.transaction;
      setTransactionType(data.type as TransactionType);

      if (!selectedCategory) {
        const catId = data.category;
        const catName = selectedCategoryName?.categoryName || "";
        if (catId && catName) {
          setCategory(catId, catName);
        }
      }
    }
  }, [
    isEditing,
    currentTransaction,
    setCategory,
    setTransactionType,
    selectedCategory,
    selectedCategoryName,
  ]);

  const initialValues: TransactionFormValues = useMemo(() => {
    if (isEditing && currentTransaction?.transaction) {
      const data = currentTransaction.transaction;
      return {
        type: (data.type as TransactionType) || "expenses",
        date: dayjs(data.date).format("YYYY-MM-DD"),
        time: data.time || "",
        category: data.category || "",
        sum: data.sum || "",
        comment: data.comment || "",
      };
    }

    return {
      type:
        draftData?.type || (transactionType as TransactionType) || "expenses",
      date: draftData?.date || new Date().toISOString().split("T")[0],
      time: draftData?.time || new Date().toTimeString().slice(0, 8),
      category: selectedCategory?.id || draftData?.category || "",
      sum: draftData?.sum || "",
      comment: draftData?.comment || "",
    };
  }, [
    isEditing,
    currentTransaction,
    transactionType,
    selectedCategory,
    draftData,
  ]);
  const handleSubmit = async (
    values: TransactionFormValues,
    { resetForm }: FormikHelpers<TransactionFormValues>
  ) => {
    const formattedPayload = {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      time: values.time.slice(0, 5),
      sum: Number(values.sum),
    };

    if (isEditing && transactionId) {
      updateMutation.mutate({
        type: values.type,
        id: transactionId,
        payload: formattedPayload,
      });
    } else {
      try {
        await createTransaction(formattedPayload);
        const currentTotal = transactionsTotal[values.type];
        updateTotals({ [values.type]: currentTotal + formattedPayload.sum });
        toast.success("Added successfully!");

        resetForm();
        resetDraft();
        resetCategory();
        setTransactionType("expenses");

        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["user", "current"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      } catch (error: unknown) {
        let errorMsg = "Request failed";
        if (axios.isAxiosError(error)) {
          errorMsg = error.response?.data?.message || "Creation failed";
        }
        toast.error(errorMsg);
      }

      router.refresh();

      // const targetPath =
      //   values.type === "expenses"
      //     ? "/transactions/history/expenses"
      //     : "/transactions/history/incomes";
      // router.push(targetPath);
      if (onClose) onClose();
    }
  };

  return (
    <div
      className={`${css.formContainer} ${isEditing ? css.formModalContainer : ""}`}
    >
      {onClose && (
        <button type="button" className={css.closeBtn} onClick={onClose}>
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
            {!isEditing && <FormikAutoSave />}

            <div className={css.radioGroup}>
              <label className={css.radioLabel}>
                <Field
                  type="radio"
                  name="type"
                  value="expenses"
                  disabled={isEditing}
                  className={css.radioInput}
                  onChange={() => {
                    setFieldValue("type", "expenses");
                    setTransactionType("expenses");
                    setFieldValue("category", "");
                    resetCategory();
                  }}
                />
                Expense
              </label>
              <label className={css.radioLabel}>
                <Field
                  type="radio"
                  name="type"
                  value="incomes"
                  className={css.radioInput}
                  onChange={() => {
                    setFieldValue("type", "incomes");
                    setTransactionType("incomes");
                    setFieldValue("category", "");
                    resetCategory();
                  }}
                />
                Income
              </label>
            </div>

            <div className={css.row}>
              <div className={css.fieldGroup}>
                <label className={css.label}>Date</label>
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
                <label className={css.label}>Time</label>
                <CustomTimePicker id="time-picker" name="time" />
                <ErrorMessage name="time" component="p" className={css.error} />
              </div>
            </div>

            <div className={css.fieldGroup}>
              <label className={css.label}>Category</label>
              <input
                type="text"
                readOnly
                placeholder="Select category"
                className={`${css.input} ${touched.category && errors.category ? css.inputError : ""}`}
                value={
                  selectedCategory?.name ||
                  selectedCategoryName?.categoryName ||
                  ""
                }
                onClick={() => {
                  setTransactionType(values.type);
                  if (typeof window !== "undefined") {
                    window.sessionStorage.setItem(
                      "categoriesModalFrom",
                      pathname ?? "/dashboard"
                    );
                  }
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
                <Field name="sum">
                  {({ field, meta }: FieldProps) => (
                    <input
                      {...field}
                      type="number"
                      placeholder="0.00"
                      className={`${css.input} ${meta.touched && meta.error ? css.inputError : ""}`}
                    />
                  )}
                </Field>
                <span className={css.currency}>{currentCurrency}</span>
              </div>
              <ErrorMessage name="sum" component="p" className={css.error} />
            </div>

            <div className={css.fieldGroup}>
              <label className={css.label}>Comment</label>
              <Field
                as="textarea"
                name="comment"
                placeholder="Enter text"
                className={`${css.input} ${css.textarea} ${touched.comment && errors.comment ? css.inputError : ""}`}
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending
                ? isEditing
                  ? "Saving..."
                  : "Sending..."
                : isEditing
                  ? "Save"
                  : "Add"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionForm;
