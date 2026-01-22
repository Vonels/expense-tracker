"use client";

import { useUserStore } from "@/lib/store/userStore";
import { Icon } from "../Icon/Icon";
import css from "./TotalIncome.module.css";

export const TotalIncome = () => {
  const totalIncomes = useUserStore((state) => state.transactionsTotal.incomes);
  const currency = useUserStore((state) => state.currency);

  return (
    <div className={css.card}>
      <div className={css.iconWrapperIncome}>
        <Icon id="icon-arrow-up-right2" className={css.icon} />
      </div>
      <div>
        <p className={css.label}>Total Income</p>
        <p className={css.amount}>
          {currency}
          {totalIncomes}
        </p>
      </div>
    </div>
  );
};
