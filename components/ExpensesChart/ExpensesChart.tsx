"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import css from "./ExpensesChart.module.css";
import { CategoryStat } from "@/types/expense";
import { fetchCurrentMonthStats } from "@/lib/api/clientApi";

interface FormattedCategory {
  _id: string;
  categoryName: string;
  sum: number;
}

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
  const [stats, setStats] = useState<FormattedCategory[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data: CategoryStat[] = await fetchCurrentMonthStats();

        const formatted = data.map((item) => ({
          _id: item._id,
          categoryName: item.category,
          sum: item.totalAmount,
        }));

        const totalAmount = data.reduce(
          (acc, curr) => acc + curr.totalAmount,
          0
        );

        setStats(formatted);
        setTotal(totalAmount);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      }
    };

    fetchStats();
  }, []);

  const { finalChartData, isPlaceholder } = useMemo(() => {
    if (stats.length === 0) {
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

    const sortedData = [...stats].sort((a, b) => b.sum - a.sum);
    const colors = generateColors(sortedData.length);

    return {
      isPlaceholder: false,
      finalChartData: sortedData.map((cat, index) => ({
        name: cat.categoryName,
        value: cat.sum,
        percent: total > 0 ? Math.round((cat.sum / total) * 100) : 0,
        color: colors[index],
      })),
    };
  }, [stats, total]);

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
                paddingAngle={isPlaceholder ? 0 : -5}
                dataKey="value"
                stroke="none"
                cy="80%"
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
