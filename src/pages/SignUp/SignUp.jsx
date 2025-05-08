import styles from './SignUp.module.css'
import LogoText from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'

function SignIn(){
    const navigation = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    async function registerUser(event){
        event.preventDefault()
        setErrors({})

        try{
            const response = await fetch('https://localhost:1337/api/register', {
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
            }else{
                // Обработка ошибок с сервера
                const newErrors = {}
                if (data.error.includes('Email')) {
                    newErrors.email = data.error
                } else if (data.error.includes('Пароль')) {
                    newErrors.password = data.error
                } else if (data.error.includes('поля')) {
                    if (!name) newErrors.name = 'Имя обязательно'
                    if (!email) newErrors.email = 'Email обязателен'
                    if (!password) newErrors.password = 'Пароль обязателен'
                } else {
                    alert(data.error)
                }
                setErrors(newErrors)
            }
        }catch(error){
            console.error('Ошибка при авторизации:', error);
            alert('Ошибка подключения к серверу');
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
                        placeholder="Ваше имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={clsx({ [styles.inputError]: errors.name })}   
                    />
                </div>
                {errors.name && (
                    <div className={styles.errorName}>{errors.name}</div>
                )}
                <div className={styles.email}>
                    <img src="src/assets/email.svg" alt="email" />
                    <input
                        type="email"
                        placeholder="Электронная почта"
                        value={email}    
                        onChange={(e) => setEmail(e.target.value)}
                        className={clsx({ [styles.inputError]: errors.email })}
                    />
                </div>
                {errors.email && (
                    <div className={styles.errorEmail}>{errors.email}</div>
                )}
                <div className={styles.password}>
                    <img src="src/assets/password.svg" alt="password" />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}    
                        onChange={(e) => setPassword(e.target.value)}
                        className={clsx({ [styles.inputError]: errors.password })}
                    />
                    
                </div>
                {errors.password && (
                    <div className={styles.errorPassword}>{errors.password}</div>
                )}
                <button className={styles.confirm} type='submit'>
                    <img src="src/assets/SignUPINArrow.svg" alt="" />
                </button>

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