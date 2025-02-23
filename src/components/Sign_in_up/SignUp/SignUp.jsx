import styles from './SignUp.module.css'
import LogoText from '../../HeaderGroup/LogoText/LogoText.jsx'
import LightSwap from '../../HeaderGroup/LightSwap/LightSwap.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function SignIn(){
    const navigation = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function registerUser(event){
        console.log("sads")
        event.preventDefault()
        try{
            const response = await fetch('http://localhost:1337/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            })
            const data = await response.json()
            if(data.status === 'ok'){
                navigation('/login')
            }
        }catch(error){
            console.error('Ошибка при авторизации:', error);
            alert('Произошла ошибка при авторизации');
        }
    }
    return(
        <section className={styles.signUp}>
            <img className={styles.cloud1} src="src/assets/signcloud1.svg" alt="signcloud1" />
            <img className={styles.cloud2} src="src/assets/signcloud2.svg" alt="signcloud2" />
            <img className={styles.cloud3} src="src/assets/signcloud3.svg" alt="signcloud3" />
            <img className={styles.cloud4} src="src/assets/signcloud4.svg" alt="signcloud4" />
            <div className={styles.logoText}><LogoText /></div>
            <form className={styles.form} onSubmit={registerUser}>
                <h2>Регистрация</h2>
                <img src="src/assets/SignInLine.svg" alt="SignInLine" />

                <div className={styles.name}>
                    <img src="src/assets/userSign.svg" alt="userSign" />
                    <input
                        type="text"
                        placeholder='Ваше имя'
                        value={name}
                        onChange={(e) => setName(e.target.value)}    
                    />
                </div>
                <div className={styles.email}>
                    <img src="src/assets/email.svg" alt="email" />
                    <input
                        type="email"
                        placeholder='Электронная почта'
                        value={email}    
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.password}>
                    <img src="src/assets/password.svg" alt="password" />
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
            <div className={styles.lightSwitch}><LightSwap/></div>
        </section>
    )
}

export default SignIn