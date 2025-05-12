import styles from './ClosedServers.module.css'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import debian from '../../../assets/debian.svg'
import ubuntu from '../../../assets/ubuntu.svg'
import centos from '../../../assets/winserver.svg'
import errorpng from '../../../assets/error.png'

dayjs.locale('ru');
dayjs.extend(localizedFormat);

function ClosedServers(){
    const [containers, setContainers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getOSIcon = (ostype) =>{
        if(ostype.includes('ubuntu')){
            return ubuntu
        } else if(ostype.includes('debian')){
            return debian
        } else{
            return centos
        }
    }

    useEffect(() => {
        const fetchContainers = async () => {
            try{
                const response = await fetch('https://localhost:1337/api/lxc/negativelist', {
                    method: 'GET',
                    headers:{
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json()
                console.log(data)
                setContainers(data.containers)
            }catch(error){
                console.error('Ошибка загрузки серверов', error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchContainers()
    }, [])

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;
    if (containers.length === 0) return <div className={styles.error}>
        <img src={errorpng} alt="error" />    
        <p>Нет закрытых серверов</p>
    </div>;

    return(
        <div className={styles.closedServers}>
            <h2>Закрытые сервера</h2>
            {containers.map(container => (
                <div key={container.id} className={styles.serverItem}>
                    <div>
                        <h3>{container.name}</h3>
                        <img src={getOSIcon(container.os)} alt={container.os} />
                    </div>
                    <div>
                        <p><strong>VM ID:</strong> {container.vmId}</p>
                        <p><strong>CPU:</strong> {container.cpu} ядра</p>
                        <p><strong>Память:</strong> {container.memory/1024} Гб</p>
                        <p><strong>Диск:</strong> {container.disk} Гб</p>
                    </div>
                    <div>
                        <p><strong>ОС:</strong> {container.os}</p>
                        <p><strong>Дата начала аренды:</strong> {dayjs(container.startDate).format('D MMMM YYYY, HH:mm')}</p>
                        <p><strong>Дата окончания аренды:</strong> {dayjs(container.endDate).format('D MMMM YYYY, HH:mm')}</p>
                        <p><strong>Цена (за день):</strong> {container.costDay} ₽</p>
                        <p><strong>Стоимость:</strong> {container.costFull} ₽</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ClosedServers