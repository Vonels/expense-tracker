"use client";

import { useUserStore } from "@/lib/store/userStore";
import css from "./TotalIncome.module.css";
import { Icon } from "../Icon/Icon";

const currencySymbols: Record<string, string> = {
  usd: "$",
  uah: "₴",
  eur: "€",
};

export const TotalIncome = () => {
  const totalIncomes = useUserStore((state) => state.transactionsTotal.incomes);
  const currency = useUserStore((state) => state.currency);

  const symbol = currencySymbols[currency.toLowerCase()] || currency;

  return (
    <div className={css.card}>
      <div className={css.iconWrapperIncome}>
        <Icon id="icon-arrow-up-right2" className={css.icon} />
      </div>
      <div>
        <p className={css.label}>Total Income</p>
        <p className={css.amount}>
          {symbol}
          {totalIncomes.toLocaleString("en-US", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })}
        </p>
      </div>
    </div>
  );
};
