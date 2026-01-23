"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import css from "./ExpensesChart.module.css";
import { useUserStore } from "@/lib/store/userStore";

const COLORS = ["#0ef387", "#0ebb69", "#fafafa", " rgba(250, 250, 250, 0.2)"];

export const ExpensesChart = () => {
  const categoriesData = useUserStore((state) => state.categories.expenses);

  const chartData = categoriesData.map((cat, index) => {
    const percentage =
      categoriesData.length > 0 ? Math.round(100 / categoriesData.length) : 0;

    return {
      name: cat.categoryName,
      value: percentage,
      color: COLORS[index % COLORS.length],
    };
  });

  return (
    <div className={css.chartContainer}>
      <h3 className={css.title}>Expenses categories</h3>
      <div className={css.content}>
        <div className={css.chartWrapper}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={90}
                startAngle={180}
                endAngle={0}
                cornerRadius={6}
                paddingAngle={-20}
                dataKey="value"
                stroke="none"
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
              <span className={css.percentage}>{cat.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
