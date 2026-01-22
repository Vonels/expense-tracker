"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import css from "./ExpensesChart.module.css";
import { useUserStore } from "@/lib/store/userStore";

const COLORS = ["#0ef387", "#202020", "#ffffff", "#4e4e4e"];

export const ExpensesChart = () => {
  const categoriesData = useUserStore((state) => state.categories.expenses);

  const chartData = categoriesData.map((cat, index) => ({
    name: cat.categoryName,
    value: 25,
    color: COLORS[index % COLORS.length],
  }));

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
                outerRadius={80}
                startAngle={180}
                endAngle={0}
                paddingAngle={5}
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
              <span className={css.percentage}>25%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
