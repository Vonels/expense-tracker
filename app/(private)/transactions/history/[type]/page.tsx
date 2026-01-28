import IncomePage from "@/components/IncomePage/IncomePage";
import css from "./Expense.module.css";
import ExpensePage from "@/components/ExpensePage/ExpensePage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTransactionCategories } from "@/lib/api/clientApi";
import { TransactionType } from "@/types/transactions";

interface PageProps {
  params: Promise<{ type: TransactionType }>;
}

const Page = async ({ params }: PageProps) => {
  const queryClient = new QueryClient();
  const { type } = await params;

  await queryClient.prefetchQuery({
    queryKey: ["categories", type],
    queryFn: () => getTransactionCategories({ type }),
  });

  return (
    <section className={css.section}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {type === "expenses" ? (
          <ExpensePage type={type} />
        ) : (
          <IncomePage type={type} />
        )}
      </HydrationBoundary>
    </section>
  );
};

export default Page;
