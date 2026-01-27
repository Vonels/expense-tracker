"use client";

import css from "./ExpensePage.module.css";
import { TotalExpense } from "../TotalExpense/TotalExpense";
import { TotalIncome } from "../TotalIncome/TotalIncome";
import { Icon } from "../Icon/Icon";
import Calendar from "../Calendar/Calendar";
import {
  deleteTransactionById,
  getTransactionCategories,
} from "@/lib/api/clientApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TransactionType } from "@/types/transactions";
import { useUserStore } from "@/lib/store/userStore";
import { Modal } from "../Modal/Modal";
import TransactionForm from "../TransactionForm/TransactionForm";
import { useState } from "react";

interface ExpensePageProps {
  type: TransactionType;
}

const ExpensePage = ({ type }: ExpensePageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currency = useUserStore((s) => s.currency);
  const upperCurrency = currency.toUpperCase();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getTransactionCategories({ type }),
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => deleteTransactionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", type] });
    },
    onError: () => {},
  });

  const onDeleteTransaction = (id: string) => {
    deleteTransaction.mutate(id);
  };

  const handleOpenMadal = () => {
    setIsOpen(true);
  };

  return (
    <div className="container">
      <div className={css.titleWrapper}>
        <div>
          <h3 className={css.titleExpense}>All Expense</h3>
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
            name="filter"
            className={css.filterInput}
            placeholder="Search for anything.."
          />
        </div>

        <Calendar />
      </div>
      <ul className={css.list}>
        {/* HEADER */}
        <li className={css.header}>
          <p>Category</p>
          <p>Comment</p>
          <p>Date</p>
          <p>Time</p>
          <p>Sum</p>
          <p>Actions</p>
        </li>

        {/* ITEM */}
        {data &&
          data.map((item) => (
            <li className={css.row} key={item._id}>
              <p>{item.category.categoryName}</p>
              <p className={css.ellipsis}>{item.comment}</p>
              <p>{item.date}</p>
              <p>{item.time}</p>
              <p className={css.money}>
                {item.sum} / {upperCurrency}
              </p>
              <div className={css.actions}>
                <button className={css.editBtn} onClick={handleOpenMadal}>
                  <Icon id="icon-Pensil" className={css.iconEdit} />
                  Edit
                </button>
                <button
                  className={css.deleteBtn}
                  onClick={() => onDeleteTransaction(item._id)}
                >
                  <Icon id="icon-trash" className={css.iconDelete} />
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
      {isOpen && (
        <Modal>
          <TransactionForm />
        </Modal>
      )}
    </div>
  );
};

export default ExpensePage;
