import styles from './Dashboard.module.css'
import LogoText from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'
import apiClient from '../../api/apiClient.js'
import ActiveServers from '../../components/DashboardGroup/ActiveServers/ActiveServers.jsx'
import ClosedServers from '../../components/DashboardGroup/ClosedServers/ClosedServers.jsx'
import DropDownMenuD from '../../components/HeaderGroup/DropDownMenuD/DropDownMenuD.jsx'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userLogo from '../../assets/user1.svg'


function Dashboard(){
    const [userData, setUserData] = useState(null)
    const [currentComponent, setCurrentComponent] = useState('activeServers')
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const navigate = useNavigate()

    const componentsMap = {
        activeServers: <ActiveServers />,
        closedServers: <ClosedServers />,
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

    return(
        <section className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.logoText}><LogoText /></div>
                <div className={styles.navbar}>
                    {renderMenuButton('activeServers', 'Активные сервера')}
                    {renderMenuButton('closedServers', 'Закрытые сервера')}
                    <button onClick={() => {navigate('/configurator')}}>Конфигуратор</button>
                </div>
                <div className={styles.usermenu} onClick={() => setOpenUserMenu((prev) => !prev)}>
                    <div>
                        <h2>{userData.name}</h2>
                        <p>{userData.email}</p>
                    </div>
                    <img src={userLogo} alt="userphoto" />
                    
                </div>
                {
                    openUserMenu && <DropDownMenuD />
                }
                
            </div>

            <div className={styles.body}>
                {componentsMap[currentComponent]}
            </div>
        </section>
    )

    // return(
    //     <section className={styles.dashboard}>
    //         <div className={styles.header}>
    //             <div className={styles.logotext}><LogoText /></div>
    //         </div>

    //         <div className={styles.body}>
    //             <div className={styles.leftside}>
    //                 <div className={styles.userbox}>
    //                     <div className={styles.userlogo}>
    //                         <img src={userLogo} alt="userphoto" />
    //                         <div>
    //                             <h2>{userData.name}</h2>
    //                             <p>{userData.email}</p>
    //                         </div>
    //                     </div>
    //                     <nav className={styles.navbar}>
    //                         {renderMenuButton('activeServers', 'Активные серверы')}
    //                         {/* {renderMenuButton('buyHistory', 'История покупок')}
    //                         {renderMenuButton('settings', 'Настройки')} */}
    //                         <button onClick={handleLogout}>Выход</button>
    //                     </nav>
    //                 </div>
    //                 <Link className={styles.configurator} to={'/configurator'}>
    //                     {/* <img src="src/assets/confg.svg" alt="confg" /> */}
    //                     <p>Конфигуратор</p>
    //                 </Link>
    //             </div>
    //             <div className={styles.rightside}>
    //                 {componentsMap[currentComponent]}
    //             </div>
    //         </div>
    //     </section>
    // )
}

export default Dashboard