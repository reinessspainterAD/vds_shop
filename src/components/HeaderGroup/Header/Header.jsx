import styles from './Header.module.css'
import LogoText from '../LogoTextColumn/LogoText.jsx'
// import LightSwap from '../LightSwap/LightSwap.jsx'
import LoginButton from '../LoginButton/LoginButton.jsx'
import leftAir from '../../../assets/leftAir.svg'
import rightAir from '../../../assets/rightAir.svg'

function Header(){
    return(
        <section className={styles.header}>
            <img className={styles.leftAir} src={leftAir} alt="leftAir" />
            <div className={styles.comb}>
                <div className={styles.logoText}><LogoText /></div>
                <div className={styles.LoginButton}><LoginButton /></div>
            </div>
            <img className={styles.rightAir} src={rightAir} alt="rightAir" />
        </section>
    )
}

export default Header