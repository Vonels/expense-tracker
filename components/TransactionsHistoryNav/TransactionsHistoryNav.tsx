"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./TransactionsHistoryNav.module.css";

const TransactionsHistoryNav = () => {
  const pathname = usePathname();

  const isIncome = pathname.includes("income");
  const isExpense = pathname.includes("expense");

  return (
    <ul className={css.list}>
      <li>
        <Link
          href="/transactions/income"
          className={`${css.link} ${isIncome ? css.active : ""}`}
        >
          All Income
        </Link>
      </li>
      <li>
        <Link
          href="/transactions/expense"
          className={`${css.link} ${isExpense ? css.active : ""}`}
        >
          All Expense
        </Link>
      </li>
    </ul>
  );
};
export default TransactionsHistoryNav;
