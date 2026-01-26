// "use client";
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { Modal } from "@/components/Modal/Modal";
// import { useTransactionStore } from "@/lib/store/useTransactionStore";
// import { api } from "@/lib/api/api";
// import iziToast from "izitoast";
// import css from "@/components/Modal/Modal.module.css";
// import { AxiosError } from "axios";

// interface ICategory {
//   _id: string;
//   categoryName: string;
//   type: "incomes" | "expenses";
// }

// interface CategoriesResponse {
//   incomes: ICategory[];
//   expenses: ICategory[];
// }

// export default function CategoriesModal() {
//   const router = useRouter();
//   const transactionType = useTransactionStore((state) => state.transactionType);
//   const displayTitle = transactionType === "incomes" ? "Incomes" : "Expenses";
//   const queryClient = useQueryClient();
//   const setCategory = useTransactionStore((state) => state.setCategory);

//   const [inputValue, setInputValue] = useState("");
//   const [editId, setEditId] = useState<string | null>(null);

//   const { data, isLoading } = useQuery<CategoriesResponse>({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const res = await api.get("/categories");
//       const allCategories = res.data;
//       return {
//         incomes: allCategories.filter(
//           (cat: ICategory) => cat.type === "incomes",
//         ),
//         expenses: allCategories.filter(
//           (cat: ICategory) => cat.type === "expenses",
//         ),
//       };
//     },
//   });

//   const categoryMutation = useMutation({
//     mutationFn: async (name: string) => {
//       if (editId) {
//         return api.patch(`/categories/${editId}`, { categoryName: name });
//       }
//       return api.post("/categories", {
//         type: transactionType,
//         categoryName: name,
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//       setInputValue("");
//       setEditId(null);
//       iziToast.success({
//         message: editId ? "Category updated" : "Category added",
//       });
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       iziToast.error({
//         title: "Error",

//         message: error.response?.data?.message || "Something went wrong",
//       });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => api.delete(`/categories/${id}`),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["categories"] });
//       iziToast.success({ message: "Deleted successfully" });
//     },
//     onError: (error: AxiosError<{ message: string }>) => {
//       if (error.response?.status === 409) {
//         iziToast.error({
//           message:
//             "409 Can`t remove! Some transactions depend on this category",
//         });
//       } else {
//         iziToast.error({
//           message: error.response?.data?.message || "Error deleting category",
//         });
//       }
//     },
//   });

//   const handleSubmit = () => {
//     if (inputValue.length < 2 || inputValue.length > 16) {
//       iziToast.warning({ message: "Name must be 2-16 characters" });
//       return;
//     }
//     categoryMutation.mutate(inputValue);
//   };

//   const handleSelect = (id: string, name: string) => {
//     setCategory(id, name);
//     router.back();
//   };

//   const handleEditInit = (id: string, name: string) => {
//     setEditId(id);
//     setInputValue(name);
//   };

//   const categoriesToDisplay = data ? data[transactionType] : [];

//   return (
//     <Modal>
//       <h2 className={css.titleCategoriesModal}>{displayTitle}</h2>
//       <p className={css.allCategoryTxt}>All Category</p>

//       <ul className={css.listCategoriesModal}>
//         {isLoading && <li>Loading...</li>}

//         {categoriesToDisplay.map((cat: ICategory) => (
//           <li
//             key={cat._id}
//             className={`${css.itemCategory} ${editId === cat._id ? css.chosenCategoryBg : ""}`}
//           >
//             <span>{cat.categoryName}</span>
//             <div className={css.actionBtns}>
//               <button onClick={() => handleSelect(cat._id, cat.categoryName)}>
//                 <svg width="14" height="14">
//                   <use href="/symbol-defs.svg#icon-Vector"></use>
//                 </svg>
//               </button>

//               <button onClick={() => handleEditInit(cat._id, cat.categoryName)}>
//                 <svg width="14" height="14">
//                   <use href="/symbol-defs.svg#icon-Pensil"></use>
//                 </svg>
//               </button>

//               <button onClick={() => deleteMutation.mutate(cat._id)}>
//                 <svg width="14" height="14">
//                   <use href="/symbol-defs.svg#icon-trash-2"></use>
//                 </svg>
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <div className={css.footerModal}>
//         <p className={css.newCategoryTxt}>
//           {editId ? "Edit Category" : "New Category"}
//         </p>
//         <div className={css.inputWrapper}>
//           <input
//             className={css.inputCategoriesModal}
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             placeholder="Enter the text"
//           />
//           <button
//             className={css.btnCategoriesModal}
//             onClick={handleSubmit}
//             disabled={categoryMutation.isPending}
//           >
//             {categoryMutation.isPending ? "..." : editId ? "Edit" : "Add"}
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Modal } from "@/components/Modal/Modal";
import { useTransactionStore } from "@/lib/store/useTransactionStore";
import { api } from "@/lib/api/api";
import iziToast from "izitoast";
import { AxiosError } from "axios";
import css from "@/components/Modal/Modal.module.css";

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

export default function CategoriesModal() {
  const router = useRouter();

  const transactionType = useTransactionStore((state) => state.transactionType);
  const setCategory = useTransactionStore((state) => state.setCategory);

  const displayTitle = transactionType === "incomes" ? "Incomes" : "Expenses";

  const [data, setData] = useState<CategoriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const categoriesToDisplay = useMemo(
    () => (data ? data[transactionType] : []),
    [data, transactionType]
  );

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // NEW
      const res = await api.get<ICategory[]>("/categories");
      const allCategories = Array.isArray(res.data) ? res.data : [];
      const organizedData: CategoriesResponse = {
        incomes: allCategories.filter((cat) => cat.type === "incomes"),
        expenses: allCategories.filter((cat) => cat.type === "expenses"),
      };

      setData(organizedData); // NEW
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      iziToast.error({
        title: "Error",
        message: err.response?.data?.message || "Failed to load categories",
      });
    } finally {
      setIsLoading(false);
    }
  };
  //NEW
  useEffect(() => {
    loadCategories();
  }, []); // NEW

  const handleSubmit = async () => {
    const name = inputValue.trim();

    if (name.length < 2 || name.length > 16) {
      iziToast.warning({ message: "Name must be 2-16 characters" });
      return;
    }

    try {
      if (editId) {
        await api.patch(`/categories/${editId}`, { categoryName: name });
      } else {
        await api.post("/categories", {
          type: transactionType,
          categoryName: name,
        });
      }

      setInputValue("");
      setEditId(null);

      iziToast.success({
        message: editId ? "Category updated" : "Category added",
      });

      await loadCategories();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      iziToast.error({
        title: "Error",
        message: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      iziToast.success({ message: "Deleted successfully" });
      await loadCategories();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      if (err.response?.status === 409) {
        iziToast.error({
          message:
            "409 Can`t remove! Some transactions depend on this category",
        });
        return;
      }

      iziToast.error({
        message: err.response?.data?.message || "Error deleting category",
      });
    }
  };

  const handleSelect = (id: string, name: string) => {
    setCategory(id, name);
    router.back();
  };

  const handleEditInit = (id: string, name: string) => {
    setEditId(id);
    setInputValue(name);
  };

  return (
    <Modal>
      <h2 className={css.titleCategoriesModal}>{displayTitle}</h2>
      <p className={css.allCategoryTxt}>All Category</p>

      <ul className={css.listCategoriesModal}>
        {isLoading && <li>Loading...</li>}

        {!isLoading &&
          categoriesToDisplay.map((cat) => (
            <li
              key={cat._id}
              className={`${css.itemCategory} ${
                editId === cat._id ? css.chosenCategoryBg : ""
              }`}
            >
              <span>{cat.categoryName}</span>

              <div className={css.actionBtns}>
                <button onClick={() => handleSelect(cat._id, cat.categoryName)}>
                  <svg width="16" height="16">
                    <use href="/symbol-defs.svg#icon-Vector"></use>
                  </svg>
                </button>

                <button
                  onClick={() => handleEditInit(cat._id, cat.categoryName)}
                >
                  <svg width="16" height="16">
                    <use href="/symbol-defs.svg#icon-Pensil"></use>
                  </svg>
                </button>

                <button onClick={() => handleDelete(cat._id)}>
                  <svg width="16" height="14">
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

        <div className={css.inputWrapper}>
          <input
            className={css.inputCategoriesModal}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter the text"
          />

          <button className={css.btnCategoriesModal} onClick={handleSubmit}>
            {editId ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
