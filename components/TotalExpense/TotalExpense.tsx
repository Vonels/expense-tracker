"use client";

import { useUserStore } from "@/lib/store/userStore";
import { Icon } from "../Icon/Icon";
import css from "./TotalExpense.module.css";

export const TotalExpense = () => {
  const totalExpenses = useUserStore(
    (state) => state.transactionsTotal.expenses,
  );
  const currency = useUserStore((state) => state.currency);

  return (
    <div className={css.card}>
      <div className={css.iconWrapperExpense}>
        <Icon id="icon-arrow-down-left2" className={css.icon} />
      </div>
      <div>
        <p className={css.label}>Total Expense</p>
        <p className={css.amount}>
          {currency}
          {totalExpenses}
        </p>
      </div>
    </div>
  );
};
