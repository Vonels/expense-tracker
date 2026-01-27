import Logo from "../Logo/Logo"
import css from './HeaderGuest.module.css'

const HeaderGuest = () => {
    return (<header className='container'>
        <div className={css.header}>
            <Logo href="/" />
        </div>
    </header>)
}
export default HeaderGuest;
