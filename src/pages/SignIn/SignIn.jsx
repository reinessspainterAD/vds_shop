import styles from './SignIn.module.css'
import LogoText from '../../components/HeaderGroup/LogoText/LogoText.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
function SignIn(){
    //Логика авторизации
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')

        async function loginUser(event){
            event.preventDefault()
            try{
                const response = await fetch('http://localhost:1337/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                })
    
                const data = await response.json()
    
                if(data.user) {
                    localStorage.setItem('token', data.user)
                    alert('Login Succsessful')
                    window.location.href = '/dashboard'
                    console.log({
                        email: data.user.email, // Правильный доступ к данным
                        password: data.user.password, // Если пароль возвращается
                    })
                }else{
                    alert('Неверная почта или пароль')
                }

            }catch (error) {
                console.error('Ошибка при авторизации:', error);
                alert('Произошла ошибка при авторизации');
            }

            
        }
    return(
        <section className={styles.signIn}>
            <img className={styles.cloud1} src="src/assets/signcloud1.svg" alt="signcloud1" />
            <img className={styles.cloud2} src="src/assets/signcloud2.svg" alt="signcloud2" />
            <img className={styles.cloud3} src="src/assets/signcloud3.svg" alt="signcloud3" />
            <img className={styles.cloud4} src="src/assets/signcloud4.svg" alt="signcloud4" />
            <div className={styles.logoText}><LogoText /></div>
            <form className={styles.form} onSubmit={loginUser}>
                <h2>Вход</h2>
                <img src="src/assets/SignInLine.svg" alt="SignInLine" />

                <div className={styles.email}>
                    <img src="src/assets/email.svg" alt="" />
                    <input
                        type="email"
                        placeholder='Электронная почта'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.password}>
                    <img src="src/assets/password.svg" alt="" />
                    <input 
                        type="password"
                        placeholder='Пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.btnWrapper}>
                    <button className={styles.reg}>
                        <Link className={styles.regL} to='/register'>
                            <p>Регистрация</p>
                        </Link>
                    </button>
                    <button className={styles.login}>
                        <Link className={styles.loginL} to='/login'>
                            <p>Войти</p>
                        </Link>
                    </button>
                </div>
            </form>
        </section>
    )
}

export default SignIn