'use client';
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import css from './Logo.module.css'

const Logo = () => {
    const { isLoggedIn } = useAuthStore();
    const navigateTo = isLoggedIn
        ? '/transactions' // MainTransactionsPage
        : '/';             // WelcomePage
    return <Link href={navigateTo} aria-label="Home" className={css.link}>
        <svg className={css.logoSvg} width={27} height={16}><use href="../../public/symbol-defs.svg#icon-Logo"/></svg>Expensetracker
    </Link>
};
export default Logo;