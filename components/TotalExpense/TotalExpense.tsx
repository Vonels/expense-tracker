"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/clientApi";
import { Icon } from "../Icon/Icon";
import css from "./TotalExpense.module.css";
import { useUserStore } from "@/lib/store/userStore";

const currencySymbols: Record<string, string> = {
  usd: "$",
  uah: "₴",
  eur: "€",
};

export const TotalExpense = () => {
  const { data: userData } = useQuery({
    queryKey: ["user", "current"],
    queryFn: getMe,
  });

  const totalExpenses = useUserStore(
    (state) => state.transactionsTotal.expenses
  );
  const currency = useUserStore((state) => state.currency);
  const updateTotals = useUserStore((state) => state.updateTotals);

  useEffect(() => {
    if (userData?.transactionsTotal) {
      updateTotals({
        expenses: userData.transactionsTotal.expenses,
        incomes: userData.transactionsTotal.incomes,
      });
    }
  }, [userData, updateTotals]);

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
          {(totalExpenses || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
};
