import styles from './Header.module.css'
import LogoText from '../LogoText/LogoText.jsx'
// import LightSwap from '../LightSwap/LightSwap.jsx'
import LoginButton from '../LoginButton/LoginButton.jsx'


function Header(){
    return(
        <section className={styles.header}>
            <div className={styles.logoText}><LogoText /></div>
            <div className={styles.rightSide}>
                {/* <LightSwap /> */}
                <LoginButton />
            </div>
        </section>
    )
}

export default Header