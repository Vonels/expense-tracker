import css from "./IncomeForm.module.css";

const IncomePage = () => {
  return (
    <div className={css.incomePage}>
      <div className={css.title}>
        <h1 className={css.titleText}>All Income</h1>
        <p className={css.titleParagraf}>
          Track and celebrate every bit of earnings effortlessly! Gain insights
          into your total revenue in a snap.
        </p>
      </div>
      <div className={css.total}>
        <div className={css.totalIncome}>
          <svg></svg>
          <ul>
            <li>Total Income</li>
            <li>$909.000</li>
          </ul>
        </div>
        <div className={css.totalExpense}>
          <svg></svg>
          <ul>
            <li>Total Expense</li>
            <li>$259.000</li>
          </ul>
        </div>
      </div>
      <div className={css.incomeForm}>
        <form>
          <input>Search for anything..</input>
          <input>dd/mm/yyyy</input>
        </form>
        <div>
          <ul>
            <li>
              Category<p>Salary</p>
            </li>

            <li>
              Comment<p>IT company</p>
            </li>

            <li>
              Date
              <p>Sn, 3.03.2023</p>
            </li>

            <li>
              Time
              <p>14:30</p>
            </li>

            <li>
              Sum
              <p>35 000 / UAH</p>
            </li>

            <li>
              Actions
              <div>
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
