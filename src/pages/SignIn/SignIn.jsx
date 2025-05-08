import styles from './SignIn.module.css'
import LogoText from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import clsx from 'clsx'

function SignIn(){
    //Логика авторизации
        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
        const [errors, setErrors] = useState({})

        async function loginUser(event){
            event.preventDefault()
            setErrors({})

            try{
                const response = await fetch('https://localhost:1337/api/login', {
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
                    window.location.href = '/dashboard'
                }else{
                    // Обработка ошибок с сервера
                    const newErrors = {}
                    if(data.error.includes('Неверный пароль')){
                        newErrors.password = data.error
                    }else if(data.error.includes('Неверная почта')){
                        newErrors.email = data.error
                    }else if(data.error.includes('Пароль должен')){
                        newErrors.password = data.error
                    }else if(data.error.includes('поля')){
                        if (!email) newErrors.email = 'Имя обязательно'
                        if (!password) newErrors.password = 'Пароль обязателен'
                    }else{
                        alert(data.error)
                    }
                    setErrors(newErrors)
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
                        className={clsx({ [styles.inputError]: errors.email })}
                        
                    />
                </div>
                {errors.email && (
                    <div className={styles.errorEmail}>{errors.email}</div>
                )}
                <div className={styles.password}>
                    <img src="src/assets/password.svg" alt="" />
                    <input 
                        type="password"
                        placeholder='Пароль'
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