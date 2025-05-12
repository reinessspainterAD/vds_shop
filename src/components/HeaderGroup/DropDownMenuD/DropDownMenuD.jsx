import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './DropDownMenuD.module.css'
import settings from '../../../assets/settings.png'
import logout from '../../../assets/logout.png'

const DropDowsnMenuD = () =>{
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token') // Удаляем токен
        console.log("Токен удален, перенаправление на login...") // Логируем удаление
        navigate('/login')
    }

    return(
        <div className={styles.dropDownMenu}>
            <ul className={styles.ul}>
                <li onClick={() => {navigate('/')}}>
                    <img src={settings} alt="" />
                    Настройки
                </li>
                <li onClick={handleLogout}>
                    <img src={logout} alt="" />
                    Выйти
                </li>
            </ul>
        </div>
    )
}

export default DropDowsnMenuD