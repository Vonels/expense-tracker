"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import css from "./ExpensesChart.module.css";
import { fetchCurrentMonthStats, getMe } from "@/lib/api/clientApi";

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
  const { data: userData } = useQuery({
    queryKey: ["user", "current"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["stats", "current-month", userData?.currency],
    queryFn: fetchCurrentMonthStats,
    enabled: !!userData,
  });
  const { finalChartData, isPlaceholder } = useMemo(() => {
    if (!statsData || statsData.length === 0) {
      return {
        isPlaceholder: true,
        finalChartData: [
          {
            name: "No expenses",
            value: 100,
            percent: 0,
            color: "rgba(255, 255, 255, 0.1)",
          },
        ],
      };
    }

    const total = statsData.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const sortedData = [...statsData].sort(
      (a, b) => b.totalAmount - a.totalAmount
    );
    const colors = generateColors(sortedData.length);

    return {
      isPlaceholder: false,
      finalChartData: sortedData.map((cat, index) => ({
        name: cat.category,
        value: cat.totalAmount,
        percent: total > 0 ? Math.round((cat.totalAmount / total) * 100) : 0,
        color: colors[index],
      })),
    };
  }, [statsData]);

  if (isLoading) return <div className={css.loader}>Loading chart...</div>;

  return (
    <div className={css.chartContainer}>
      <h3 className={css.title}>Expenses categories</h3>
      <div className={css.content}>
        <div className={css.chartWrapper}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={finalChartData}
                innerRadius={70}
                outerRadius={110}
                startAngle={180}
                endAngle={0}
                cornerRadius={6}
                paddingAngle={isPlaceholder ? 0 : -4}
                dataKey="value"
                stroke="none"
                cy="80%"
                animationBegin={0}
                animationDuration={800}
              >
                {finalChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={css.chartLabel}>{isPlaceholder ? "0" : "100"}%</div>
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
