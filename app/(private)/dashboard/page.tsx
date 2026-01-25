import { TotalIncome } from "@/components/TotalIncome/TotalIncome";
import css from "./Dashboard.module.css";
import { TotalExpense } from "@/components/TotalExpense/TotalExpense";
import { ExpensesChart } from "@/components/ExpensesChart/ExpensesChart";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense Log | ExpenseTracker",
  description:
    "Capture and organize every penny spent with ease! A clear view of your financial habits at your fingertips.",
  openGraph: {
    title: "Expense Log | ExpenseTracker",
    description:
      "Manage your finances effectively with our intuitive expense log.",
    type: "website",
    // images: ['/og-image.png'],
  },
  twitter: {
    card: "summary_large_image",
    title: "Expense Log | ExpenseTracker",
    description: "Track your expenses and incomes with visual charts.",
  },
};

export default function DashboardPage() {
  const handleOpenCategories = (type: "incomes" | "expenses") => {};

  return (
    <main className={css.container}>
      <div className={css.mainLayout}>
        <section className={css.statsSection}>
          <div className={css.info}>
            <h1 className={css.title}>Expense Log</h1>
            <p className={css.subtitle}>
              Capture and organize every penny spent with ease! A clear view of
              your financial habits at your fingertips.
            </p>
          </div>

          <div className={css.summaryCards}>
            <TotalIncome />
            <TotalExpense />
          </div>
          <ExpensesChart />
        </section>

        <aside className={css.formSection}>
          <TransactionForm
          // onOpenCategories={handleOpenCategories}
          // selectedCategoryName="Category"
          />
        </aside>
      </div>
    </main>
  );
}
