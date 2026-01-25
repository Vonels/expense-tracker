"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchIncomes, deleteIncome } from "@/lib/api/clientApi";
import { Icon } from "../Icon/Icon";
import { TotalExpense } from "../TotalExpense/TotalExpense";
import { TotalIncome } from "../TotalIncome/TotalIncome";
import { Modal } from "../Modal/Modal";
import TransactionForm from "../TransactionForm/TransactionForm";
import css from "./IncomePage.module.css";
import { toast } from "react-toastify";

const IncomePage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [date, setDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<any>(null);

  const queryClient = useQueryClient();

  const handleOpenModal = (income?: any) => {
    setSelectedIncome(income || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIncome(null);
  };

  const { data: incomesData, isLoading } = useQuery({
    queryKey: ["incomes", debouncedSearch, date],
    queryFn: () =>
      fetchIncomes({
        from: date || undefined,
        to: date || undefined,
        search: debouncedSearch || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      toast.success("Income deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete income");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this income?")) {
      deleteMutation.mutate(id);
    }
  };

  const incomFormList = incomesData?.items || [];

  return (
    <div className="container">
      <div className={css.incomePage}>
        <div className={css.title}>
          <h3 className={css.titleText}>All Income</h3>
          <p className={css.titleParagraf}>
            Track and celebrate every bit of earnings effortlessly! Gain
            insights into your total revenue in a snap.
          </p>
        </div>
        <div className={css.total}>
          <TotalIncome />
          <TotalExpense />
        </div>
        <div className={css.incomeForm}>
          <form action="" onSubmit={(e) => e.preventDefault()}>
            <label id="search">
              <Icon id="icon-search" className={css.icon} />
              <input
                className={css.incomeFormInputSearch}
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for anything.."
              ></input>
            </label>
            <label id="date">
              <Icon id="icon-search" className={css.icon} />
              <input
                className={css.incomeFormInputData}
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="dd/mm/yyyy"
              ></input>
            </label>
          </form>
          <div className={css.incomeFormListCategoris}>
            <ul>
              <li className={css.incomeFormListItemCategory}>Category</li>
              <li className={css.incomeFormListItemComment}>Comment</li>
              <li className={css.incomeFormListItemDate}>Date</li>
              <li className={css.incomeFormListItemTime}>Time</li>
              <li className={css.incomeFormListItemSum}>Sum</li>
              <li className={css.incomeFormItem}>Actions</li>
            </ul>
            {isLoading ? (
              <p className={css.loadingText}>Loading...</p>
            ) : incomFormList.length === 0 ? (
              <p className={css.noDataText}>No income records found.</p>
            ) : (
              incomFormList.map((income) => (
                <ul key={income.id} className={css.incomeFormList}>
                  <li className={css.incomeFormListItemText}>
                    {income.source}
                  </li>
                  <li className={css.incomeFormListItemText}>
                    {income.comment || "—"}
                  </li>
                  <li className={css.incomeFormListItemText}>{income.date}</li>
                  <li className={css.incomeFormListItemText}>
                    {income.date.includes("T")
                      ? income.date.split("T")[1].slice(0, 5)
                      : "—"}
                  </li>
                  <li className={css.incomeFormListItemText}>
                    {income.amount.toLocaleString()} / UAH
                  </li>
                  <li className={css.incomeFormBtn}>
                    <button
                      className={css.incomeFormBtnEdit}
                      onClick={() => handleOpenModal(income)}
                    >
                      Edit
                    </button>
                    <button
                      className={css.incomeFormBtnDelete}
                      onClick={() => handleDelete(income.id)}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              ))
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className={css.modalContent}>
            <TransactionForm
              onOpenCategories={() => {}}
              selectedCategoryName={selectedIncome?.source || ""}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IncomePage;
