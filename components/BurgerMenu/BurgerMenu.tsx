'use client';

import { useEffect } from 'react';
import css from './BurgerMenu.module.css';
import TransactionsHistoryNav from '../TransactionsHistoryNav/TransactionsHistoryNav';
import { Icon } from '../Icon/Icon';
import UserMenu from '../UserMenu/UserMenu';

type Props = {
    isOpen: boolean,
    onClose: ()=>void,
}
const BurgerMenu = ({isOpen,onClose}: Props) => {
    useEffect(() => {
        if (!isOpen) return;
        
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleEsc);
        return ()=> document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onClose])

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (!isOpen) return null;

    return (<div className={css.backdrop} onClick={handleBackdropClick}>
        <div className={css.modal}>
            <button type="button" className={css.closeBtn} onClick={onClose}>
                <Icon id={'icon-Close'} className={css.icon} />
        </button>
        <div className={css.content}>
            <UserMenu className={css.userMenu} />
                
            <div className={css.navBlock}>
                <TransactionsHistoryNav variant="burger" onNavigate={onClose}/>
            </div>
        </div>
        </div>
    </div>)

}

export default BurgerMenu;
