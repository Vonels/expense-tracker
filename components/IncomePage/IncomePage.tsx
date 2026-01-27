"use client";

import css from "./IncomePage.module.css";
import { TotalExpense } from "../TotalExpense/TotalExpense";
import { TotalIncome } from "../TotalIncome/TotalIncome";
import { Icon } from "../Icon/Icon";
import Calendar from "../Calendar/Calendar";
import { getTransactionCategories } from "@/lib/api/clientApi";
import { useQuery } from "@tanstack/react-query";
import { TransactionType } from "@/types/transactions";

interface ExpensePageProps {
  type: TransactionType;
}

const ExpensePage = ({ type }: ExpensePageProps) => {
  const {} = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getTransactionCategories({ type }),
  });

  return (
    <div className="container">
      <div className={css.titleWrapper}>
        <div>
          <h3 className={css.titleExpense}>All Incomes</h3>
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
        <li className={css.row}>
          <p>Cinema</p>
          <p className={css.ellipsis}>John Wick 4</p>
          <p>Sn, 03.03.2023</p>
          <p>14:30</p>
          <p className={css.money}>150 / UAH</p>
          <div className={css.actions}>
            <button className={css.editBtn}>
              <Icon id="icon-Pensil" className={css.iconEdit} />
              Edit
            </button>
            <button className={css.deleteBtn}>
              <Icon id="icon-trash" className={css.iconDelete} />
              Delete
            </button>
          </div>
        </li>
        <li className={css.row}>
          <p>Cinema</p>
          <p className={css.ellipsis}>John Wick 4</p>
          <p>Sn, 03.03.2023</p>
          <p>14:30</p>
          <p className={css.money}>150 / UAH</p>
          <div className={css.actions}>
            <button className={css.editBtn}>
              <Icon id="icon-Pensil" className={css.iconEdit} />
              Edit
            </button>
            <button className={css.deleteBtn}>
              <Icon id="icon-trash" className={css.iconDelete} />
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ExpensePage;
