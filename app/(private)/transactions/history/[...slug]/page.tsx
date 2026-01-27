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
  params: Promise<{ slug: string[] }>;
}

const Page = async ({ params }: PageProps) => {
  const queryClient = new QueryClient();
  const { slug } = await params;

  const type = slug[0] as TransactionType;

  await queryClient.prefetchQuery({
    queryKey: ["categories", type],
    queryFn: () => getTransactionCategories({ type }),
  });

  return (
    <section className={css.section}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {slug[0] === "expenses" ? (
          <ExpensePage type={type} />
        ) : (
          <IncomePage type={type} />
        )}
      </HydrationBoundary>
    </section>
  );
};

export default Page;
