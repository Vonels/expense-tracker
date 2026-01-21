import css from "./IncomeForm.module.css";

const IncomeForm = () => {
  return (
    <div className={css.incomeForm}>
      <h1 className={css.textTitle}>All Income</h1>
      <p className={css.textPage}>
        Track and celebrate every bit of earnings effortlessly! Gain insights
        into your total revenue in a snap.
      </p>
    </div>
  );
};

export default IncomeForm;
