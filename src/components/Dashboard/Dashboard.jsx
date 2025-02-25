import styles from './Dashboard.module.css'
import LogoText from '../HeaderGroup/LogoText/LogoText.jsx'
import LightSwap from '../HeaderGroup/LightSwap/LightSwap.jsx'
import apiClient from '../../api/apiClient.js'
import ActiveServers from './ActiveServers/ActiveServers.jsx'
import BuyHistory from './BuyHistory/BuyHistory.jsx'
import Settings from './Settings/Settings.jsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function Dashboard(){
    const [userData, setUserData] = useState(null)
    const [currentComponent, setCurrentComponent] = useState('activeServers')

    const componentsMap = {
        activeServers: <ActiveServers />,
        buyHistory: <BuyHistory />,
        settings: <Settings />
    }

    const handleMenuClick = (componentName) => {
        setCurrentComponent(componentName)
    }

    const getUserData = async () => {
        try{
            const response = await apiClient.get('/api/user-data')
            if(response.data.status === 'ok'){
                return response.data.user
            }else{
                console.error('Ошибка получения данных пользователя', response.data.error)
                return null
            }
        }catch(error){
            console.error('Ошибка при получении данных пользователя', error)
            return null
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserData()
            if(data){
                setUserData(data)
            }
        }
        fetchData()
    }, [])

    if(!userData){
        return <div className={styles.emptyData}>Загрузка...</div>
    }

    const renderMenuButton = (componentName, label) => (
        <button
            className={currentComponent === componentName ? `${styles.active}` : ''}
            onClick={() => handleMenuClick(componentName)}
        >
            {label}
        </button>
    );

    // const Logout = () =>{
    //     localStorage.removeItem('token')
    //     const navigate = useNavigate()
    //     navigate('/login')
    // }

    return(
        <section className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.logotext}><LogoText /></div>
                <div className={styles.lightswap}><LightSwap /></div>
            </div>

            <div className={styles.body}>
                <div className={styles.leftside}>
                    <div className={styles.userbox}>
                        <div className={styles.userlogo}>
                            <img src='src/assets/user1.svg' alt="userphoto" />
                            <div>
                                <h2>{userData.name}</h2>
                                <p>{userData.email}</p>
                            </div>
                        </div>
                        <nav className={styles.navbar}>
                            {renderMenuButton('activeServers', 'Активные серверы')}
                            {renderMenuButton('buyHistory', 'История покупок')}
                            {renderMenuButton('settings', 'Настройки')}
                            <button>Выход</button>
                        </nav>
                    </div>
                    <Link className={styles.configurator}>
                        <img src="src/assets/confg.svg" alt="confg" />
                        <p>Конфигуратор</p>
                    </Link>
                </div>
                <div className={styles.rightside}>
                    {componentsMap[currentComponent]}
                </div>
            </div>
        </section>
    )
}

export default Dashboard