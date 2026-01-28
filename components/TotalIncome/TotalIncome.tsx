"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/userStore";
import { getMe } from "@/lib/api/clientApi";
import { Icon } from "../Icon/Icon";
import css from "./TotalIncome.module.css";

const currencySymbols: Record<string, string> = {
  usd: "$",
  uah: "₴",
  eur: "€",
};

export const TotalIncome = () => {
  const { data: userData } = useQuery({
    queryKey: ["user", "current"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
  const totalIncomes = useUserStore((state) => state.transactionsTotal.incomes);
  const currency = userData?.currency || "usd";
  const updateTotals = useUserStore((state) => state.updateTotals);

  useEffect(() => {
    if (userData?.transactionsTotal) {
      updateTotals({
        incomes: userData.transactionsTotal.incomes,
        expenses: userData.transactionsTotal.expenses,
      });
    }
  }, [userData, updateTotals]);

  const symbol =
    currencySymbols[currency.toLowerCase()] || currency.toUpperCase();

  return (
    <div className={css.card}>
      <div className={css.iconWrapperIncome}>
        <Icon id="icon-arrow-up-right2" className={css.icon} />
      </div>
      <div>
        <p className={css.label}>Total Income</p>
        <div className={css.amount}>
          <span className={css.symbol}>{symbol}</span>
          {(totalIncomes || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
};
