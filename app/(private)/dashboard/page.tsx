import { TotalIncome } from "@/components/TotalIncome/TotalIncome";
import css from "./Dashboard.module.css";
import { TotalExpense } from "@/components/TotalExpense/TotalExpense";
import { ExpensesChart } from "@/components/ExpensesChart/ExpensesChart";
import TransactionForm from "@/components/TransactionForm/TransactionForm";

export default function DashboardPage() {
  return (
    <main className={css.container}>
      <div className={css.info}>
        <h1 className={css.title}>Expense Log</h1>
        <p className={css.subtitle}>
          Capture and organize every penny spent with ease! A clear view of your
          financial habits at your fingertips.
        </p>
      </div>

      <div className={css.mainLayout}>
        <section className={css.statsSection}>
          <div className={css.summaryCards}>
            <TotalIncome />
            <TotalExpense />
          </div>
          <ExpensesChart />
        </section>
      </div>

      <aside className={css.formSection}>
        <TransactionForm />
      </aside>
    </main>
  );
}
