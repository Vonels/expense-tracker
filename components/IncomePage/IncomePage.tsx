"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./IncomePage.module.css";
import { TotalExpense } from "../TotalExpense/TotalExpense";
import { TotalIncome } from "../TotalIncome/TotalIncome";
import { Icon } from "../Icon/Icon";
import Calendar from "../Calendar/Calendar";
import {
  deleteTransactionById,
  getTransactionCategories,
} from "@/lib/api/clientApi";
import {
  TransactionType,
  TransactionData,
  ITransactionListItem, // Припускаю наявність цього типу або заміни на потрібний
} from "@/types/transactions";
import { useUserStore } from "@/lib/store/userStore";
import { Modal } from "../Modal/Modal";
import TransactionForm from "../TransactionForm/TransactionForm";

interface ExpensePageProps {
  type: TransactionType;
}

const ExpensePage = ({ type }: ExpensePageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Використовуємо TransactionData для типізації вибраної транзакції
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);

  const currency = useUserStore((s) => s.currency);
  const upperCurrency = currency.toUpperCase();
  const queryClient = useQueryClient();

  // Отримання даних
  const { data } = useQuery<ITransactionListItem[]>({
    queryKey: ["categories", type],
    queryFn: () => getTransactionCategories({ type }),
  });

  // Мутація видалення
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransactionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", type] });
    },
  });

  const onDeleteTransaction = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Функція відкриття модалки
  const handleOpenEditModal = (item: ITransactionListItem) => {
    // Формуємо структуру, яку очікує TransactionForm (об'єкт з полем transaction)
    setSelectedTransaction({ transaction: item });
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
          />
        </div>
        <Calendar />
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

      {isOpen && (
        <Modal onClose={handleCloseModal}>
          <TransactionForm
            isEditing={!!selectedTransaction}
            currentTransaction={selectedTransaction}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ExpensePage;
