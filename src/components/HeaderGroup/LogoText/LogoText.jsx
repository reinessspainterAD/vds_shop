import styles from './LogoText.module.css'

function LogoText(){
    return(
        <div className={styles.logoText}>
            <h2>CloudSphere</h2>
            <img className={styles.cloud} src="src/assets/CloudLogo.svg" alt="cloudspherelogo" />
            <img className={styles.line} src="src/assets/LineLogo.svg" alt="" />
            <p className={styles.slogan}>Мощь облака в ваших <br></br> руках</p>
        </div>
    )
}

export default LogoText
