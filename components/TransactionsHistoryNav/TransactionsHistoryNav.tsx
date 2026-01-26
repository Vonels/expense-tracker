"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./TransactionsHistoryNav.module.css";

type Props = {
  variant?: "header" | "burger";
  onNavigate?: () => void;
};
const TransactionsHistoryNav = ({ variant = "header", onNavigate }: Props) => {
  const pathname = usePathname();

  const isIncome = pathname.includes("income");
  const isExpense = pathname.includes("expense");

  return (
    <ul className={`${css.list} ${css[variant]}`}>
      <li>
        <Link
          href="/income"
          className={`${css.link} ${isIncome ? css.active : ""}`}
          onClick={onNavigate}
        >
          All Income
        </Link>
      </li>
      <li>
        <Link
          href="/expense"
          className={`${css.link} ${isExpense ? css.active : ""}`}
          onClick={onNavigate}
        >
          All Expense
        </Link>
      </li>
    </ul>
  );
};
export default TransactionsHistoryNav;
