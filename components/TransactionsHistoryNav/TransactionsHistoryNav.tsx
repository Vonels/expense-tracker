import Link from 'next/link';
import css from './TransactionsHistoryNav.module.css'
// На сторінці TransactionsHistoryPage елемент навігації, який відповідає обраному типу транзакцій, що відображаються на даній сторінці, повинен мати стилі активного елементу, як зображено на макеті.
const TransactionsHistoryNav = () => {
    return <ul className={css.list}>
            <li>
                <Link href='/' className={css.link}>All Income</Link>
            </li>
            <li>
                <Link href='/' className={css.link}>All Expense</Link>
            </li>
        </ul>
};
export default TransactionsHistoryNav;