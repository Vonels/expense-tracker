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
import { toast } from "react-hot-toast";

const IncomePage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [date, setDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const queryClient = useQueryClient();

  const handleOpenModal = (income?: Income) => {
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
    <div className="">
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
          <div className={css.incomeFormInput}><label htmlFor="search">
            <Icon id="icon-search" className={css.icon} />
          </label>
          <input
            className={css.incomeFormInputSearch}
            type="text"
            id="search"
            name="filter"
            placeholder="Search for anything.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /></div>
          
          <DatePicker
            value={date}
            onChange={(val) => setDate(val)}
          />
          </div>

          <div className={css.incomeFormListCategoris}>
            <ul className={css.incomeFormListStatic}>
              <li className={css.incomeFormListItemStaticCategory}>Category</li>
              <li className={css.incomeFormListItemStaticComment}>Comment</li>
              <li className={css.incomeFormListItemStaticDate}>Date</li>
              <li className={css.incomeFormListItemStaticTime}>Time</li>
              <li className={css.incomeFormListItemStaticSum}>Sum</li>
              <li className={css.incomeFormItemStaticActions}>Actions</li>
            </ul>
            {isLoading ? (
              <p className={css.loadingText}>Loading...</p>
            ) : incomFormList.length === 0 ? (
              <p className={css.noDataText}>No income records found.</p>
            ) : (
              incomFormList.map((income) => (
                <ul
                  key={income.id}
                  className={css.incomeFormListDinamicCategory}
                >
                  <li className={css.incomeFormListItemDinamicCategory}>
                    {income.source || "—"}
                  </li>
                  <li className={css.incomeFormListItemDinamicComment}>
                    {income.comment || "—"}
                  </li>
                  <li className={css.incomeFormListItemDinamicDate}>
                    {income.date}
                  </li>
                  <li className={css.incomeFormListItemDinamicTime}>
                    {income.date.includes("T")
                      ? income.date.split("T")[1].slice(0, 5)
                      : "—"}
                  </li>
                  <li className={css.incomeFormListItemDinamicSum}>
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
        {isModalOpen && (
          <Modal>
            <div className={css.modalContent}>
              <TransactionForm
                isEditing={!!selectedIncome}
                currentTransaction={
                  selectedIncome
                    ? ({
                        _id: selectedIncome.id,
                        type: "incomes",
                        date: selectedIncome.date.split("T")[0],
                        time: selectedIncome.date.includes("T")
                          ? selectedIncome.date.split("T")[1].slice(0, 5)
                          : "00:00",
                        category: {
                          _id: selectedIncome.source,
                          categoryName: selectedIncome.source,
                        },
                        sum: selectedIncome.amount,
                        comment: selectedIncome.comment || "",
                      } as TransactionData)
                    : null
                }
                onClose={handleCloseModal}
              />
            </div>
          </Modal>
        )}
      </div>
  );
};

export default IncomePage;
