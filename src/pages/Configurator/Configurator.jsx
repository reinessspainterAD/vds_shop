import styles from './Configurator.module.css'
import LogoText from '../../components/HeaderGroup/LogoText/LogoText.jsx'
import home from '../../assets/home.svg'
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import debian from '../../assets/debian.svg'
import ubuntu from '../../assets/ubuntu.svg'
import winServer from '../../assets/winserver.svg'
import { useNavigate } from 'react-router-dom'
import { mockVMs } from '../../components/DashboardGroup/mockData.js';

function Configurator(){
    const navigate = useNavigate()

    const [vmId, setVmId] = useState('');
    const [name, setName] = useState('');
    const [cpuCR, setCpuCR] = useState(1);
    const [socket, setSocket] = useState(1);
    const [memoryGB, setMemoryGB] = useState(1);
    const [diskGB, setDiskGB] = useState(1);
    const [iso, setIso] = useState('');
    const [selectedDisk, setSelectedDisk] = useState(null);
    const [selectedOS, setSelectedOS] = useState(null);

    const handleVmIdChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setVmId(value);
        }
    };

    const handleAddVM = () => {
        if (!vmId || !name || !iso) {
            alert('Заполните все поля и выберите ОС');
            return;
        }

        const newVM = {
            vmId: parseInt(vmId),
            name,
            cpuCR,
            cpuProc: 50,
            memoryGB,
            memoryProc: 10,
            socket,
            diskGB,
            diskProc: 20,
            iso
        };

        mockVMs.push(newVM);
        alert('Виртуальная машина добавлена!');
    };

    return(
        <section className={styles.body}>
            <div className={styles.header}>
                <div className={styles.logoText}><LogoText/></div>
                <div className={styles.leftheader}>
                    <button onClick={() => navigate('/dashboard')}><img src={home} alt="home" /></button>
                </div>
            </div>
            <div className={styles.configurator}>
                <div className={styles.leftside}>
                    <div className={styles.naming}>
                        <div>
                            <h2>Введите индентификатор сервера:</h2>
                            <input type="text" value={vmId} onChange={handleVmIdChange} />
                        </div>
                        <div className={styles.name}>
                            <h2>Введите название сервера:</h2>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.metrics}>
                        <h2>Процессор и память</h2>
                        <p>Количество ядер процессора (3.10 GHz)</p>
                        <div className={styles.cpu}>
                            <Box sx={{ width: 1300 }}>
                                <Slider value={cpuCR} onChange={(e, val) => setCpuCR(val)} step={1} min={1} max={4} />
                            </Box>
                            <div className={styles.value}>{cpuCR}</div>
                            <p>ядра</p>
                        </div>

                        <p>Количество сокетов</p>
                        <div className={styles.socket}>
                            <Box sx={{ width: 1300 }}>
                                <Slider value={socket} onChange={(e, val) => setSocket(val)} step={1} min={1} max={2} />
                            </Box>
                            <div className={styles.value}>{socket}</div>
                            <p>шт</p>
                        </div>

                        <p>Объём оперативной памяти (DDR4)</p>
                        <div className={styles.ram}>
                            <Box sx={{ width: 1300 }}>
                                <Slider value={memoryGB} onChange={(e, val) => setMemoryGB(val)} step={2} min={0} max={16} />
                            </Box>
                            <div className={styles.value}>{memoryGB}</div>
                            <p>Гб</p>
                        </div>

                        <div className={styles.disk}>
                            <h2>Накопитель</h2>
                            <div>
                                <p>Объём накопителя: </p>
                                <button 
                                    className={selectedDisk === 'HDD' ? styles.active : ''} 
                                    onClick={() => setSelectedDisk('HDD')}>HDD</button>
                                <button 
                                    className={selectedDisk === 'SSD' ? styles.active : ''} 
                                    onClick={() => setSelectedDisk('SSD')}>SSD</button>
                            </div>
                            <div className={styles.diskdiv}>
                                <Box sx={{ width: 1300 }}>
                                    <Slider value={diskGB} onChange={(e, val) => setDiskGB(val)} step={7} min={1} max={64} />
                                </Box>
                                <div className={styles.value}>{diskGB}</div>
                                <p>Гб</p>
                            </div>
                        </div>

                        <div className={styles.iso}>
                            <h2>Операционная система</h2>
                            <div>
                                <button 
                                    className={selectedOS === 'debian' ? styles.active : ''} 
                                    onClick={() => { setIso('debian'); setSelectedOS('debian'); }}>
                                    <img src={debian} alt="debian" />
                                    <p>Debian</p>
                                </button>
                                <button 
                                    className={selectedOS === 'ubuntu' ? styles.active : ''} 
                                    onClick={() => { setIso('ubuntu'); setSelectedOS('ubuntu'); }}>
                                    <img src={ubuntu} alt="ubuntu" />
                                    <p>Ubuntu</p>
                                </button>
                                <button 
                                    className={selectedOS === 'winserver' ? styles.active : ''} 
                                    onClick={() => { setIso('winserver'); setSelectedOS('winserver'); }}>
                                    <img src={winServer} alt="winServer" />
                                    <p>WN Server</p>
                                </button>
                            </div>
                            
                        </div>
                    </div>
                    <button className={styles.confirm} onClick={handleAddVM}>Взять в аренду</button>
                </div>
            </div>
        </section>
    )
}

export default Configurator