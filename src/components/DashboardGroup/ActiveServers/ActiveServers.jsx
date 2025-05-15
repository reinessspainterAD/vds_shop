import styles from './ActiveServers.module.css'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import errorpng from '../../../assets/errorNoData.svg'

import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';


import debian from '../../../assets/debian.svg'
import ubuntu from '../../../assets/ubuntu.svg'
import centos from '../../../assets/winserver.svg'
import start from '../../../assets/play.svg'
import stop from '../../../assets/stop.svg'
import restart from '../../../assets/restart.svg'
import del from '../../../assets/delete.svg'
import downArrow from '../../../assets/downArrow.png'
import upArrow from '../../../assets/upArrow.png'

function ActiveServers(){
    const [servers, setServers] = useState([]);
    const [expandedIds, setExpandedIds] = useState([]);
    const [serverStatus, setServerStatus] = useState({});
    const navigate = useNavigate();
    const effectRan = useRef(false);
    const intervalRef = useRef({});

    const [graphData, setGraphData] = useState({});
    const graphIntervalRef = useRef({});

    const getOSIcon = (ostype) =>{
        if(ostype.includes('ubuntu')){
            return ubuntu
        } else if(ostype.includes('debian')){
            return debian
        } else{
            return centos
        }
    }

    const fetchGraphData = async (vmid) => {
        try {
            const response = await fetch(`https://localhost:1337/api/lxc/status/${vmid}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            const newEntry = {
                time: new Date().toLocaleTimeString(),
                cpu: +(data.data.data.cpu * 100).toFixed(2),
                mem: +(data.data.data.mem / 1024 / 1024).toFixed(2), // MB
                disk: +(data.data.data.disk / 1024 / 1024).toFixed(2), // MB
            };

            setGraphData(prev => {
                const updated = [...(prev[vmid] || []), newEntry].slice(-20); // max 20 точек
                return { ...prev, [vmid]: updated };
            });
        } catch (error) {
            console.error(`Ошибка обновления графиков VM ${vmid}:`, error.message);
        }
    };

    const fetchStatus = async (vmid) => {
        try {
            const response = await fetch(`https://localhost:1337/api/lxc/status/${vmid}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setServerStatus(prev => ({ ...prev, [vmid]: data.data.data }));
        } catch (error) {
            console.error(`Ошибка загрузки статуса VM ${vmid}:`, error.message);
        }
    };

    const toggleExpand = (vmid) => {
        setExpandedIds(prev => {
            const isExpanded = prev.includes(vmid);
            const updated = isExpanded ? prev.filter(id => id !== vmid) : [...prev, vmid];

            // если открываем — запустить интервал
            if (!isExpanded) {
                fetchStatus(vmid);
                fetchGraphData(vmid);

                const statusInt = setInterval(() => fetchStatus(vmid), 1000);
                const graphInt = setInterval(() => fetchGraphData(vmid), 10000);

                intervalRef.current[vmid] = statusInt;
                graphIntervalRef.current[vmid] = graphInt;
            } else {
                // если закрываем — удалить интервалы
                clearInterval(intervalRef.current[vmid]);
                clearInterval(graphIntervalRef.current[vmid]);
                delete intervalRef.current[vmid];
                delete graphIntervalRef.current[vmid];
            }

            return updated;
        });
    };


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
        return () => {
            Object.values(intervalRef.current).forEach(clearInterval);
            Object.values(graphIntervalRef.current).forEach(clearInterval);
        };
    }, [])

    const formatUptime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        if (d > 0) return `${d}д ${h}ч`;
        if (h > 0) return `${h}ч ${m}м`;
        if (m > 0) return `${m}м ${s}с`;
        return `${s}с`;
    };

    const formatGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);

    const formatTimeLeft = (endDateStr) => {
        const now = new Date();
        const endDate = new Date(endDateStr);
        const diffMs = endDate - now;

        if (diffMs <= 0) return 'Время истекло';

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

        return `${diffDays}д ${diffHours}ч ${diffMinutes}м`;
    };

    const handleStart = async (e, vmid) => {
        e.stopPropagation();
        try {
            const response = await fetch(`https://localhost:1337/api/lxc/start/${vmid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Ошибка запуска:', error.message);
        }
    };

    const handleStop = async (e, vmid) => {
        e.stopPropagation();
        try {
            const response = await fetch(`https://localhost:1337/api/lxc/stop/${vmid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Ошибка остановки:', error.message);
        }
    };

    const handleRestart = async (e, vmid) => {
        e.stopPropagation();
        try {
            const response = await fetch(`https://localhost:1337/api/lxc/restart/${vmid}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Ошибка перезапуска:', error.message);
        }
    };

    const handleDelete = async (e, vmid) => {
    e.stopPropagation();
        try {
            const response = await fetch(`https://localhost:1337/api/lxc/delete/${vmid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const result = await response.json();
            console.log(result.message);

            // Удалить из интерфейса
            setServers(prev => prev.filter(server => server.vmId !== vmid));

            // Убрать из expanded, если он был раскрыт
            if (expanded === vmid) {
                setExpandedIds(null);
            }

            // Также очистить status, если он больше не нужен
            setServerStatus(prev => {
                const updated = { ...prev };
                delete updated[vmid];
                return updated;
            });
        } catch (error) {
            console.error('Ошибка удаления:', error.message);
        }
    };

    useEffect(() => {
        const timers = {};

        servers.forEach(server => {
            const end = new Date(server.endDate).getTime();
            const now = Date.now();
            const timeLeft = end - now;

            if (timeLeft > 0) {
                timers[server.vmId] = setTimeout(() => {
                    console.log(`Время истекло для VM ${server.vmId}, останавливаем и удаляем...`);

                    handleStop({ stopPropagation: () => {} }, server.vmId);
                    setTimeout(() => handleDelete({ stopPropagation: () => {} }, server.vmId), 5000); // задержка на 5 сек
                }, timeLeft);
            } else {
                // Уже истекло — сразу обрабатываем
                handleStop({ stopPropagation: () => {} }, server.vmId);
                setTimeout(() => handleDelete({ stopPropagation: () => {} }, server.vmId), 5000);
            }
        });

        // Очистка при размонтировании
        return () => {
            Object.values(timers).forEach(clearTimeout);
        };
    }, [servers]);

    if (servers.length === 0) return <div className={styles.error}>
            <img src={errorpng} alt="error" />    
            <h2>Нет активных серверов</h2>
            <p>Для аренды сервера перейдите в конфигуратор</p>
        </div>;

    return (
        <div className={styles.activeServers}>
            <h2 className={styles.h2}>Активные сервера</h2>
            <div className={styles.serversBox}>
                {servers.map((server) => (
                    <div key={server.vmId} className={styles.serverItem}>
                        <div className={styles.idk}>
                            <div className={styles.serverHeader}>
                                <div className={styles.leftHeader}>
                                    <img src={getOSIcon(server.os)} alt={server.iso} className={styles.osIcon} />
                                    <h3>{server.name}</h3>
                                    <button onClick={() => toggleExpand(server.vmId)}>
                                        <img
                                            src={expandedIds.includes(server.vmId) ? upArrow : downArrow}
                                            alt="Раскрыть"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <span>Статус: {serverStatus[server.vmId]?.status || 'неизвестно'}</span>
                                <button onClick={(e) => handleStart(e, server.vmId)}>
                                    <img src={start} alt="" />
                                    Запустить
                                </button>
                                <button onClick={(e) => handleStop(e, server.vmId)}>
                                    <img src={stop} alt="" />
                                    Выключить
                                </button>
                                <button onClick={(e) => handleRestart(e, server.vmId)}>
                                    <img src={restart} alt="" />
                                    Перезапустить
                                </button>
                                <button onClick={(e) => handleDelete(e, server.vmId)}>
                                    <img src={del} alt="" />
                                    Удалить
                                </button>
                            </div>
                        </div>

                        {expandedIds.includes(server.vmId)&& (
                            <div className={styles.expanded}>
                                {serverStatus[server.vmId] ? (
                                    <div className={styles.subDiv}>
                                        <div className={styles.metrics}>
                                            <p><strong>Тип:</strong> {serverStatus[server.vmId].type.toUpperCase()}</p>
                                            <p><strong>Uptime:</strong> {formatUptime(serverStatus[server.vmId].uptime)}</p>
                                            <p><strong>CPU:</strong> {(serverStatus[server.vmId].cpu * 100).toFixed(2)}% ({serverStatus[server.vmId].cpus} ядра)</p>
                                            <p>
                                                <strong>Память:</strong> {formatGB(serverStatus[server.vmId].mem)} ГБ из {formatGB(serverStatus[server.vmId].maxmem)} ГБ
                                            </p>
                                            <p>
                                                <strong>Диск:</strong> {formatGB(serverStatus[server.vmId].disk)} ГБ из {formatGB(serverStatus[server.vmId].maxdisk)} ГБ
                                            </p>
                                            <p>
                                                <strong>Осталось времени:</strong>{' '}
                                                {formatTimeLeft(server.endDate)}
                                            </p>
                                        </div>
                                        
                                        <div className={styles.graphs}>
                                            
                                            <div>
                                                <h3>CPU</h3>
                                                <LineChart width={300} height={200} data={graphData[server.vmId] || []}>
                                                    <XAxis dataKey="time" />
                                                    <Tooltip/>
                                                    <CartesianGrid stroke='grey' strokeDasharray='5 5'/>
                                                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={3} dot={false} />
                                                </LineChart>
                                            </div>
                                            <div>
                                                <h3>Память</h3>
                                                <LineChart width={300} height={200} data={graphData[server.vmId] || []}>
                                                    <XAxis dataKey="time" />
                                                    <Tooltip/>
                                                    <CartesianGrid stroke='grey' strokeDasharray='5 5'/>
                                                    <Line type="monotone" dataKey="mem" stroke="#82ca9d" strokeWidth={3} dot={false} />
                                                </LineChart>
                                            </div>
                                            <div>
                                                <h3>Диск</h3>
                                                <LineChart width={300} height={200} data={graphData[server.vmId] || []}>
                                                    <XAxis dataKey="time"/>
                                                    <Tooltip/>
                                                    <CartesianGrid stroke='grey' strokeDasharray='5 5'/>
                                                    <Line type="monotone" dataKey="disk" stroke="#ffc658" strokeWidth={3} dot={false} />
                                                </LineChart>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p>Загрузка статуса...</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ActiveServers