import styles from './LogoText.module.css'
import logo from '../../../assets/CloudLogo.svg'

function LogoText(){
    return(
        <div className={styles.logoText}>
            <img className={styles.cloud} src={logo} alt="cloudspherelogo" />
            <h2>CloudSphere</h2>
            <div className={styles.line}></div>
            <p className={styles.slogan}>Мощь облака в ваших <br></br> руках</p>
        </div>
    )
}

export default LogoText
