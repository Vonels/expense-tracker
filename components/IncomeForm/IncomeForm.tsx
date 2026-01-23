import { Icon } from "../Icon/Icon";
import { TotalExpense } from "../TotalExpense/TotalExpense";
import { TotalIncome } from "../TotalIncome/TotalIncome";
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
        <TotalIncome />
        <TotalExpense />
      </div>
      <div className={css.incomeForm}>
        <form action="">
          <label id="search">
            <Icon id="icon-search" className={css.icon} />
            {/* <svg className={css.incomeFormSvg} width="20" height="20">
                <use href="/symbol-defs.svg#icon-search"></use>
              </svg> */}
            <input
              className={css.incomeFormInputSearch}
              type="text"
              id="search"
              placeholder="Search for anything.."
            ></input>
          </label>
          <label id="data">
            <Icon id="icon-search" className={css.icon} />
            {/* <svg className={css.incomeFormSvg} width="20" height="20">
                <use href="/symbol-defs.svg#icon-calendar"></use>
              </svg> */}
            <input
              className={css.incomeFormInputData}
              type="data"
              id="data"
              placeholder="dd/mm/yyyy"
            ></input>
          </label>
        </form>
        <div className={css.incomeFormListCategoris}>
          <ul className={css.incomeFormList}>
            <li className={css.incomeFormListItemCategory}>
              Category <p className={css.incomeFormListItemText}>Salary</p>
            </li>

            <li className={css.incomeFormListItemComment}>
              Comment<p className={css.incomeFormListItemText}>IT company</p>
            </li>

            <li className={css.incomeFormListItemDate}>
              Date
              <p className={css.incomeFormListItemText}>Sn, 3.03.2023</p>
            </li>

            <li className={css.incomeFormListItemTime}>
              Time
              <p className={css.incomeFormListItemText}>14:30</p>
            </li>

            <li className={css.incomeFormListItemSum}>
              Sum
              <p className={css.incomeFormListItemText}>35 000 / UAH</p>
            </li>

            <li className={css.incomeFormItem}>
              Actions
              <div className={css.incomeFormBtn}>
                <button className={css.incomeFormBtnEdit}>Edit</button>
                <button className={css.incomeFormBtnDelete}>Delete</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
