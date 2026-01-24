"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import css from "./ExpensesChart.module.css";
import { useUserStore } from "@/lib/store/userStore";

const generateColors = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const hue = (145 + i * 8) % 360;
    const lightness = Math.max(20, 60 - i * 12);
    const saturation = 75 - i * 5;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

export const ExpensesChart = () => {
  const categoriesData = useUserStore((state) => state.categories.expenses);
  const totalExpenses = useUserStore(
    (state) => state.transactionsTotal.expenses
  );

  const sortedData = [...categoriesData].sort(
    (a, b) => (b.sum || 0) - (a.sum || 0)
  );

  const chartColors = generateColors(sortedData.length);

  const chartData = sortedData.map((cat, index) => {
    const percentage =
      totalExpenses > 0
        ? Math.round(((cat.sum || 0) / totalExpenses) * 100)
        : 0;

    return {
      name: cat.categoryName,
      value: cat.sum || 0,
      percent: percentage,
      color: chartColors[index],
    };
  });

  return (
    <div className={css.chartContainer}>
      <h3 className={css.title}>Expenses categories</h3>
      <div className={css.content}>
        <div className={css.chartWrapper}>
          <ResponsiveContainer width="100%" height={285}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={100}
                outerRadius={140}
                startAngle={180}
                endAngle={0}
                cornerRadius={8}
                paddingAngle={-5}
                dataKey="value"
                stroke="none"
                cy="65%"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={css.chartLabel}>100%</div>
        </div>

        <ul className={css.legend}>
          {chartData.map((cat) => (
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
