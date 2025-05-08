import styles from './ActiveServers.module.css'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import debian from '../../../assets/debian.svg'
import ubuntu from '../../../assets/ubuntu.svg'
import winServer from '../../../assets/winserver.svg'
import cpuIcon from '../../../assets/cpu.svg'
import ramIcon from '../../../assets/ram.svg'
import diskIcon from '../../../assets/disk.svg'

function ActiveServers(){
    const [servers, setServers] = useState([])
    const [expanded, setExpanded] = useState(null)
    const navigate = useNavigate()
    const effectRan = useRef(false);

    const getOSIcon = (ostype) =>{
        // switch (ostype){
        //     case 'ubuntu': return ubuntu
        //     case 'debian': return debian
        //     case 'windows': return winServer
        //     default: return null
        // }
        if(ostype.includes('ubuntu')){
            return ubuntu
        }
    }

    const toggleExpand = (id) =>{
        setExpanded(prev => prev === id ? null : id)
    }


    useEffect(() => {
        if (effectRan.current) return; // Предотвращаем повторный вызов
        effectRan.current = true;
        const fetchServers = async() => {
            try{
                const response = await fetch('https://localhost:1337/api/lxc/list', {
                    method: 'GET',
                    headers: { 
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                const data = await response.json()
                console.log("Ответ от API:", response); // Посмотрим, что реально приходит
                console.log("response.data:", data.containers); // Проверяем data
                setServers(data.containers);
            }catch(error){
                console.error('Ошибка загрузки серверов', error.message)
            }
        }
        fetchServers()
    }, [])

    return (
        <div className={styles.container}>
            <h2>Активные сервера</h2>
            <div className={styles.vms}>
                {servers.map((server) => (
                    <div key={server.vmId} className={styles.server_card}>
                        <div className={styles.server_summary} onClick={() => toggleExpand(server.vmId)}>
                            <div className={styles.server_header}>
                                <h3>{server.name}</h3>
                                <span className={styles.status}>{server.status}</span>
                            </div>
                            <div className={styles.os_info}>
                                <img src={getOSIcon(server.iso)} alt={server.iso} className={styles.os_icon} />
                                <span>{server.iso}</span>
                            </div>
                            <div className={styles.controls}>
                                <button>Вкл</button>
                                <button>Выкл</button>
                                <button>Перезапуск</button>
                                <button className={styles.delete}>Удалить</button>
                            </div>
                        </div>

                        {expanded === server.vmId && (
                            <div className={styles.expanded}>
                                <div className={styles.rental_info}>
                                    <p>Аренда: {server.startDate} — {server.endDate}</p>
                                    <p>Осталось: {server.timeLeft}</p>
                                </div>
                                <div className={styles.config}>
                                    <div><img src={cpuIcon} alt="CPU" /> {server.cpu} ядер</div>
                                    <div><img src={ramIcon} alt="RAM" /> {server.memory} ГБ</div>
                                    <div><img src={diskIcon} alt="Disk" /> {server.disk} ГБ</div>
                                </div>
                                <div className={styles.graphs}>
                                    {/* Заглушка — сюда можно вставить компонент графика */}
                                    <div className={styles.placeholder}>[ Графики CPU / RAM / Сеть ]</div>
                                </div>
                                <button className={styles.terminal}>Подключиться к консоли</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ActiveServers