import styles from './LoginButton.module.css'

function LoginButton(){
    const login = () => {
        window.location.href = '/login'
    }
    return(
        <div className={styles.loginButton}>
            <p className={styles.slogan}>Создайте свой первый сервер за 5 минут — <br />просто, быстро, доступно!</p>
            <button onClick={login}>
                <p className={styles.authP}>Войти</p>
            </button>
        </div>
    )
}

export default LoginButton