"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./ExpensePage.module.css";
import { TotalExpense } from "../TotalExpense/TotalExpense";
import { TotalIncome } from "../TotalIncome/TotalIncome";
import { Icon } from "../Icon/Icon";
import Calendar from "../Calendar/Calendar";
import {
  deleteTransactionById,
  getTransactionCategories,
} from "@/lib/api/clientApi";
import { TransactionType, TransactionTypeData } from "@/types/transactions";
import { useUserStore } from "@/lib/store/userStore";
import { Modal } from "../Modal/Modal";
import TransactionForm from "../TransactionForm/TransactionForm";
import { format } from "date-fns";

interface ExpensePageProps {
  type: TransactionType;
}

const ExpensePage = ({ type }: ExpensePageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedTransaction, setSelectedTransaction] = useState<{
    transaction: TransactionTypeData;
    total: number;
  } | null>(null);

  const currency = useUserStore((s) => s.currency);
  const upperCurrency = currency.toUpperCase();
  const queryClient = useQueryClient();

  const { data } = useQuery<TransactionTypeData[]>({
    queryKey: ["categories", type, selectedDate, searchQuery],
    queryFn: () =>
      getTransactionCategories({
        type,
        date: selectedDate,
        search: searchQuery,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransactionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", type] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });

  const onDeleteTransaction = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(format(date, "yyyy-MM-dd"));
    } else {
      setSelectedDate("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.currentTarget.value);
  };

  const handleOpenEditModal = (item: TransactionTypeData) => {
    setSelectedTransaction({
      transaction: item,
      total: 0,
    });
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="container">
      <div className={css.titleWrapper}>
        <div>
          <h3 className={css.titleExpense}>
            All {type === "expenses" ? "Expense" : "Income"}
          </h3>
          <p className={css.textExpense}>
            View and manage every transaction seamlessly! Your entire financial
            landscape, all in one place.
          </p>
        </div>
        <div className={css.totals}>
          <TotalIncome />
          <TotalExpense />
        </div>
      </div>

      <div className={css.filterWrapper}>
        <div className={css.filterInputWrapper}>
          <label htmlFor="filterSearch">
            <Icon id="icon-search" className={css.iconSearch} />
          </label>
          <input
            type="text"
            id="filterSearch"
            className={css.filterInput}
            placeholder="Search for anything.."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Calendar onDateSelect={handleDateSelect} />
      </div>

      <ul className={css.list}>
        <li className={css.header}>
          <p>Category</p>
          <p>Comment</p>
          <p>Date</p>
          <p>Time</p>
          <p>Sum</p>
          <p>Actions</p>
        </li>

        {data &&
          data.map((item) => (
            <li className={css.row} key={item._id}>
              <p>{item.category?.categoryName || "Other"}</p>
              <p className={css.ellipsis}>{item.comment}</p>
              <p>{item.date}</p>
              <p>{item.time}</p>
              <p className={css.money}>
                {item.sum} / {upperCurrency}
              </p>
              <div className={css.actions}>
                <button
                  className={css.editBtn}
                  onClick={() => handleOpenEditModal(item)}
                >
                  <Icon id="icon-Pensil" className={css.iconEdit} />
                  <span className={css.hideBtn}>Edit</span>
                </button>
                <button
                  className={css.deleteBtn}
                  onClick={() => onDeleteTransaction(item._id)}
                  disabled={deleteMutation.isPending}
                >
                  <Icon id="icon-trash" className={css.iconDelete} />
                  <span className={css.hideBtn}>Delete</span>
                </button>
              </div>
            </li>
          ))}
      </ul>

      {isOpen && selectedTransaction && (
        <Modal onClose={handleCloseModal}>
          <TransactionForm
            isEditing={!!selectedTransaction}
            currentTransaction={{
              transaction: {
                _id: selectedTransaction.transaction._id,
                type: selectedTransaction.transaction.type,
                date: selectedTransaction.transaction.date,
                time: selectedTransaction.transaction.time,
                category: selectedTransaction.transaction.category._id,
                sum: selectedTransaction.transaction.sum,
                comment: selectedTransaction.transaction.comment,
              },
              total: selectedTransaction.total,
            }}
            selectedCategoryName={selectedTransaction.transaction.category}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ExpensePage;
