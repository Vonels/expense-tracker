'use client';
import { Icon } from '../Icon/Icon';
import css from './BurgerMenuBtn.module.css';

type Props = {
    onClick: () => void;
}

const BurgerMenuBtn = ({ onClick }: Props) => {
    
    return <button
        type='button'
        className={css.burgerBtn}
        onClick={onClick}
    >
        <Icon
            id={'icon-Icon'}
            className={css.burgerIcon}
        />
    </button>
};
export default BurgerMenuBtn;