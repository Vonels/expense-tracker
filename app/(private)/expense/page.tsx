import css from "./Expense.module.css";
import ExpensePage from "@/components/ExpensePage/ExpensePage";

const Page = () => {
  return (
    <section className={css.section}>
      <ExpensePage />
    </section>
  );
};

export default Page;
