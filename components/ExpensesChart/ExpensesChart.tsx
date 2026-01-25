"use client";

import { useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import css from "./ExpensesChart.module.css";
import { useUserStore } from "@/lib/store/userStore";
import { CategoryStat } from "@/types/expense";

const generateColors = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    if (count <= 1) return `hsl(145, 80%, 60%)`;
    const ratio = i / (count - 1);
    const hue = 145;
    const saturation = 80 - ratio * 80;
    const lightness = 60 - ratio * 35;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

export const ExpensesChart = () => {
  const categoriesData = useUserStore((state) => state.categories.expenses);
  const totalExpenses = useUserStore(
    (state) => state.transactionsTotal.expenses
  );
  const setCategories = useUserStore((state) => state.setCategories);
  const updateTotals = useUserStore((state) => state.updateTotals);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/categories/current-month");
        const data = await response.json();

        const formatted = data.map((item: CategoryStat) => ({
          _id: item._id,
          categoryName: item.category,
          sum: item.totalAmount,
          type: "expenses",
        }));

        const total = data.reduce(
          (acc: number, curr: CategoryStat) => acc + curr.totalAmount,
          0
        );

        setCategories("expenses", formatted);
        updateTotals({ expenses: total });
      } catch (error) {
        console.error("Failed to load statistics:", error);
      }
    };

    fetchStats();
  }, [setCategories, updateTotals]);

  const { finalChartData, isPlaceholder } = useMemo(() => {
    if (categoriesData.length === 0) {
      return {
        isPlaceholder: true,
        finalChartData: [
          {
            name: "Your expenses",
            value: 100,
            percent: 100,
            color: "rgba(255, 255, 255, 0.1)",
          },
        ],
      };
    }

    const sortedData = [...categoriesData].sort(
      (a, b) => (b.sum || 0) - (a.sum || 0)
    );
    const colors = generateColors(sortedData.length);

    return {
      isPlaceholder: false,
      finalChartData: sortedData.map((cat, index) => ({
        name: cat.categoryName,
        value: cat.sum || 0,
        percent:
          totalExpenses > 0
            ? Math.round(((cat.sum || 0) / totalExpenses) * 100)
            : 0,
        color: colors[index],
      })),
    };
  }, [categoriesData, totalExpenses]);

  return (
    <div className={css.chartContainer}>
      <h3 className={css.title}>Expenses categories</h3>
      <div className={css.content}>
        <div className={css.chartWrapper}>
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={finalChartData}
                innerRadius={100}
                outerRadius={140}
                startAngle={180}
                endAngle={0}
                cornerRadius={8}
                paddingAngle={isPlaceholder ? 0 : -5}
                dataKey="value"
                stroke="none"
                cy="65%"
              >
                {finalChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={css.chartLabel}>100%</div>
        </div>

        <ul className={css.legend}>
          {finalChartData.map((cat) => (
            <li key={cat.name} className={css.legendItem}>
              <div className={css.legendName}>
                <span
                  className={css.dot}
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </div>
              <span className={css.percentage}>{cat.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
