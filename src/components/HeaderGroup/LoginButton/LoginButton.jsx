import styles from './LoginButton.module.css'

function LoginButton(){
    const login = () => {
        window.location.href = '/login'
    }
    return(
        <div className={styles.loginButton}>
            <button onClick={login}>
                <img src="src/assets/user.svg" alt="userIcon" />
                <p>Войти</p>
            </button>
        </div>
    )
}

export default LoginButton