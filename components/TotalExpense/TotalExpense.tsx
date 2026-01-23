"use client";

import { useUserStore } from "@/lib/store/userStore";
import css from "./TotalExpense.module.css";
import { Icon } from "../Icon/Icon";

const currencySymbols: Record<string, string> = {
  usd: "$",
  uah: "₴",
  eur: "€",
};

export const TotalExpense = () => {
  const totalExpenses = useUserStore(
    (state) => state.transactionsTotal.expenses
  );
  const currency = useUserStore((state) => state.currency);

  const symbol = currencySymbols[currency.toLowerCase()] || currency;

  return (
    <div className={css.card}>
      <div className={css.iconWrapperExpense}>
        <Icon id="icon-arrow-down-left2" className={css.icon} />
      </div>
      <div>
        <p className={css.label}>Total Expense</p>
        <p className={css.amount}>
          {symbol}
          {totalExpenses.toLocaleString("en-US", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })}
        </p>
      </div>
    </div>
  );
};
