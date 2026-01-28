import { TotalIncome } from "@/components/TotalIncome/TotalIncome";
import css from "./Dashboard.module.css";
import { TotalExpense } from "@/components/TotalExpense/TotalExpense";
import { ExpensesChart } from "@/components/ExpensesChart/ExpensesChart";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getMe } from "@/lib/api/serverApi";

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

export default async function DashboardPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user", "current", "currency"],
    queryFn: () => getMe(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={css.mainContainer}>
        <div className={css.mainLayout}>
          <section className={css.statsSection}>
            <div className={css.info}>
              <h1 className={css.title}>Expense Log</h1>
              <p className={css.subtitle}>
                Capture and organize every penny spent with ease!
              </p>
            </div>

            <div className={css.summaryCards}>
              <TotalIncome />
              <TotalExpense />
            </div>
            <ExpensesChart />
          </section>

          <aside className={css.formSection}>
            <TransactionForm />
          </aside>
        </div>
      </main>
    </HydrationBoundary>
  );
}
