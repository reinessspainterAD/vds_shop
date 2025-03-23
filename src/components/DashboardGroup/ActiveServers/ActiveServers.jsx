import styles from './ActiveServers.module.css'
// import { useEffect, useState, useRef } from 'react' /Для Api
import { useNavigate } from 'react-router-dom'
import { mockVMs } from "../mockData.js"; // для заглушки
import debian from '../../../assets/debian.svg'
import ubuntu from '../../../assets/ubuntu.svg'
import winServer from '../../../assets/winserver.svg'
import cpu from '../../../assets/cpu.svg'
import ram from '../../../assets/ram.svg'
import disk from '../../../assets/disk.svg'

function ActiveServers(){
    // Реальное API
    // const [servers, setServers] = useState([])
    // const navigate = useNavigate()
    // const effectRan = useRef(false);

    // useEffect(() => {
    //     if (effectRan.current) return; // Предотвращаем повторный вызов
    //     effectRan.current = true;
    //     const fetchServers = async() => {
    //         try{
    //             const response = await fetch('http://localhost:1337/api/vm/list', {
    //                 method: 'GET',
    //                 headers: { 
    //                     'Content-Type':'application/json',
    //                     'Authorization': `Bearer ${localStorage.getItem("token")}`,
    //                 },
    //             })
    //             const data = await response.json()
                

    //             console.log("Ответ от API:", response); // Посмотрим, что реально приходит
    //             console.log("response.data:", data.vms); // Проверяем data
    //             setServers(data.vms);
    //         }catch(error){
    //             console.error('Ошибка загрузки серверов', error.message)
    //         }
    //     }
    //     fetchServers()
    // }, [])
    // return(
    //     <div className={styles.div}>
    //         <h2>Активные сервера</h2>
    //         <div className={styles.vms}>
    //             {servers.map((server) => (
    //                 <div
    //                     key={server.vmId}
    //                     className={styles.server_card}
    //                     onClick={() => navigate(`/dashboard/vm/${server.vmId}`)}
    //                 >
    //                     <h3>{server.name}</h3>
    //                     <p>CPU: {server.cpu}</p>
    //                     <p>RAM: {server.memory}</p>
    //                     <p>Disk: {server.disk}</p>
    //                 </div>
    //             ))}

    //         </div>
    //     </div>
    // )

    //Mock.js

    const navigate = useNavigate();

    return (
        <div className={styles.activeServers}>
            <h2>Активные сервера</h2>
            <div className={styles.servbox}>
                {mockVMs.map((server) => (
                    <div 
                        key={server.vmId} 
                        className={styles.serverCard}
                        onClick={() => navigate(`/dashboard/vm/${server.vmId}`)}
                    >
                        <div className={styles.metrics}>
                            <img 
                                src={
                                    server.iso === 'debian' ? debian :
                                    server.iso === 'ubuntu' ? ubuntu :
                                    winServer
                                }
                                alt={server.iso}
                            />
                            <h3>{server.name}</h3>

                            <div className={styles.rightpart}>
                                <p><img src={cpu} alt="cpu" /> {server.cpuProc}%</p>
                                <p><img src={ram} alt="ram" /> {server.memoryProc}%</p>
                                <p><img src={disk} alt="disk" /> {server.diskProc}%</p>
                            </div>
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ActiveServers