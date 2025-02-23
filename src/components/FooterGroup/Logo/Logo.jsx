import styles from './Logo.module.css'

function Logo(){
    return(
        <div className={styles.logo}>
            <div>
                <p>CloudSphere</p>
                <img src="src/assets/BlackCloudLogo.svg" alt="BlackLogo" />
            </div>
            <p>© 2025 CloudSphere. Все права защищены.</p>
        </div>
    )
}

export default Logo