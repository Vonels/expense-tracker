"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";

const CATEGORIES_MODAL_FROM = "categoriesModalFrom";
const OPEN_CATEGORIES_MODAL = "openCategoriesModal";
const DASHBOARD_PATH = "/dashboard";
const EXPENSES_HISTORY_PATH = "/transactions/history/expenses";
const INCOMES_HISTORY_PATH = "/transactions/history/incomes";
import { useTransactionStore } from "@/lib/store/useTransactionStore";
import axios from "axios";
import css from "@/components/Modal/Modal.module.css";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/lib/api/clientApi";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { toast } from "react-hot-toast";

interface IFormValues {
  newCategoryName: string;
}

export interface ICategory {
  _id: string;
  categoryName: string;
  type: "incomes" | "expenses";
}

export interface CategoriesResponse {
  incomes: ICategory[];
  expenses: ICategory[];
}

export interface CreateCategoryDto {
  categoryName: string;
  type: "incomes" | "expenses";
}

const validationSchema = Yup.object().shape({
  newCategoryName: Yup.string()
    .trim()
    .min(2, "Name must be 2-16 characters")
    .max(16, "Name must be 2-16 characters")
    .required("Category name is required"),
});

export default function CategoriesModal() {
  const router = useRouter();
  const transactionType = useTransactionStore((state) => state.transactionType);
  const setCategory = useTransactionStore((state) => state.setCategory);

  const displayTitle = transactionType === "incomes" ? "Incomes" : "Expenses";

  const [data, setData] = useState<CategoriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isRedirecting] = useState(true); // full-page /categoriesModal always redirects

  const categoriesToDisplay = useMemo(
    () => (data ? data[transactionType] : []),
    [data, transactionType]
  );

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const result = await getCategories();
      setData(result);
    } catch (error: unknown) {
      let errorMsg = "Failed to load categories";

      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.error || error.message;
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const from =
      typeof window !== "undefined"
        ? sessionStorage.getItem(CATEGORIES_MODAL_FROM)
        : null;
    if (!from) {
      router.replace(DASHBOARD_PATH);
      return;
    }
    if (from === DASHBOARD_PATH) {
      sessionStorage.setItem(OPEN_CATEGORIES_MODAL, "1");
      router.replace(DASHBOARD_PATH);
      return;
    }
    if (from === EXPENSES_HISTORY_PATH || from === INCOMES_HISTORY_PATH) {
      router.replace(from);
      return;
    }
    router.replace(DASHBOARD_PATH);
  }, [router]);

  if (isRedirecting) {
    return null;
  }

  const onFormikSubmit = async (
    values: IFormValues,
    { resetForm }: FormikHelpers<IFormValues>
  ) => {
    const name = values.newCategoryName.trim();
    try {
      if (editId) {
        await updateCategory(editId, name);
      } else {
        await createCategory({
          type: transactionType,
          categoryName: name,
        });
      }

      resetForm();
      setEditId(null);
      toast.success(editId ? "Category updated" : "Category added");
      await loadCategories();
    } catch (error: unknown) {
      let errorMsg = "Something went wrong";

      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.error || error.message;
      }

      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Deleted successfully");
      await loadCategories();
    } catch (error: unknown) {
      let errorMsg = "Error deleting";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          errorMsg = "Can't remove! Some transactions depend on this category";
        } else {
          errorMsg = error.response?.data?.error || error.message;
        }
      }

      toast.error(errorMsg);
    }
  };

  const handleSelect = (id: string, name: string) => {
    setCategory(id, name);
    router.back();
  };

  return (
    <Modal>
      <h2 className={css.titleCategoriesModal}>{displayTitle}</h2>
      <p className={css.allCategoryTxt}>All Category</p>

      <Formik
        initialValues={{ newCategoryName: "" }}
        validationSchema={validationSchema}
        onSubmit={onFormikSubmit}
        enableReinitialize={false}
      >
        {({ setFieldValue, errors, touched, isSubmitting }) => (
          <>
            <ul className={css.listCategoriesModal}>
              {isLoading && <li className={css.loadingText}>Loading...</li>}

              {!isLoading &&
                categoriesToDisplay &&
                categoriesToDisplay.map((cat) => (
                  <li
                    key={cat._id}
                    className={`${css.itemCategory} ${
                      editId === cat._id ? css.chosenCategoryBg : ""
                    }`}
                  >
                    <span>{cat.categoryName}</span>

                    <div className={css.actionBtns}>
                      <button
                        onClick={() => handleSelect(cat._id, cat.categoryName)}
                      >
                        <svg width="16" height="16">
                          <use href="/symbol-defs.svg#icon-Vector"></use>
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          setEditId(cat._id);
                          setFieldValue("newCategoryName", cat.categoryName);
                        }}
                      >
                        <svg width="16" height="16">
                          <use href="/symbol-defs.svg#icon-Pensil"></use>
                        </svg>
                      </button>

                      <button onClick={() => handleDelete(cat._id)}>
                        <svg width="16" height="16">
                          <use href="/symbol-defs.svg#icon-trash-2"></use>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>

            <div className={css.footerModal}>
              <p className={css.newCategoryTxt}>
                {editId ? "Edit Category" : "New Category"}
              </p>
              <Form>
                <div
                  className={`${css.inputWrapper} ${touched.newCategoryName && errors.newCategoryName ? css.inputError : ""}`}
                >
                  <Field
                    name="newCategoryName"
                    className={css.inputCategoriesModal}
                    placeholder="Enter the text"
                  />

                  <button
                    type="submit"
                    className={css.btnCategoriesModal}
                    disabled={isSubmitting}
                  >
                    {editId ? "Edit" : "Add"}
                  </button>
                </div>
                <ErrorMessage
                  name="newCategoryName"
                  component="p"
                  className={css.errorLabel}
                />
              </Form>
            </div>
          </>
        )}
      </Formik>
    </Modal>
  );
}
