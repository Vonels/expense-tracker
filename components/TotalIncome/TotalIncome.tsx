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
    staleTime: Infinity,
  });

  const totalIncomes = useUserStore((state) => state.transactionsTotal.incomes);
  const currency = useUserStore((state) => state.currency);
  const updateTotals = useUserStore((state) => state.updateTotals);

  useEffect(() => {
    if (userData?.transactionsTotal) {
      updateTotals({
        incomes: userData.transactionsTotal.incomes,
      });
    }
  }, [userData, updateTotals]);

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
          {(totalIncomes || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
};
