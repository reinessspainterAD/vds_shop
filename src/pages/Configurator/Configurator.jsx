// import styles from './Configurator.module.css'
// import LogoText from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'
// import home from '../../assets/home.svg'
// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Slider from '@mui/material/Slider';
// import debian from '../../assets/debian.svg'
// import ubuntu from '../../assets/ubuntu.svg'
// import winServer from '../../assets/winserver.svg'
// import { useNavigate } from 'react-router-dom'
// import { mockVMs } from '../../components/DashboardGroup/mockData.js';

// function Configurator(){
//     const navigate = useNavigate()

//     const [vmId, setVmId] = useState('');
//     const [name, setName] = useState('');
//     const [cpuCR, setCpuCR] = useState(1);
//     const [socket, setSocket] = useState(1);
//     const [memoryGB, setMemoryGB] = useState(1);
//     const [diskGB, setDiskGB] = useState(1);
//     const [iso, setIso] = useState('');
//     const [selectedDisk, setSelectedDisk] = useState(null);
//     const [selectedOS, setSelectedOS] = useState(null);

//     const handleVmIdChange = (e) => {
//         const value = e.target.value;
//         if (/^\d*$/.test(value)) {
//             setVmId(value);
//         }
//     };

//     const handleAddVM = () => {
//         if (!vmId || !name || !iso) {
//             alert('Заполните все поля и выберите ОС');
//             return;
//         }

//         const newVM = {
//             vmId: parseInt(vmId),
//             name,
//             cpuCR,
//             cpuProc: 50,
//             memoryGB,
//             memoryProc: 10,
//             socket,
//             diskGB,
//             diskProc: 20,
//             iso
//         };

//         mockVMs.push(newVM);
//         alert('Виртуальная машина добавлена!');
//     };

//     return(
//         <section className={styles.body}>
//             <div className={styles.header}>
//                 <div className={styles.logoText}><LogoText/></div>
//                 <div className={styles.leftheader}>
//                     <button onClick={() => navigate('/dashboard')}><img src={home} alt="home" /></button>
//                 </div>
//             </div>
//             <div className={styles.configurator}>
//                 <div className={styles.leftside}>
//                     <div className={styles.naming}>
//                         <div>
//                             <h2>Введите индентификатор сервера:</h2>
//                             <input type="text" value={vmId} onChange={handleVmIdChange} />
//                         </div>
//                         <div className={styles.name}>
//                             <h2>Введите название сервера:</h2>
//                             <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//                         </div>
//                     </div>
//                     <div className={styles.metrics}>
//                         <h2>Процессор и память</h2>
//                         <p>Количество ядер процессора (3.10 GHz)</p>
//                         <div className={styles.cpu}>
//                             <Box sx={{ width: 1300 }}>
//                                 <Slider value={cpuCR} onChange={(e, val) => setCpuCR(val)} step={1} min={1} max={4} />
//                             </Box>
//                             <div className={styles.value}>{cpuCR}</div>
//                             <p>ядра</p>
//                         </div>

//                         <p>Количество сокетов</p>
//                         <div className={styles.socket}>
//                             <Box sx={{ width: 1300 }}>
//                                 <Slider value={socket} onChange={(e, val) => setSocket(val)} step={1} min={1} max={2} />
//                             </Box>
//                             <div className={styles.value}>{socket}</div>
//                             <p>шт</p>
//                         </div>

//                         <p>Объём оперативной памяти (DDR4)</p>
//                         <div className={styles.ram}>
//                             <Box sx={{ width: 1300 }}>
//                                 <Slider value={memoryGB} onChange={(e, val) => setMemoryGB(val)} step={2} min={0} max={16} />
//                             </Box>
//                             <div className={styles.value}>{memoryGB}</div>
//                             <p>Гб</p>
//                         </div>

//                         <div className={styles.disk}>
//                             <h2>Накопитель</h2>
//                             <div>
//                                 <p>Объём накопителя: </p>
//                                 <button 
//                                     className={selectedDisk === 'HDD' ? styles.active : ''} 
//                                     onClick={() => setSelectedDisk('HDD')}>HDD</button>
//                                 <button 
//                                     className={selectedDisk === 'SSD' ? styles.active : ''} 
//                                     onClick={() => setSelectedDisk('SSD')}>SSD</button>
//                             </div>
//                             <div className={styles.diskdiv}>
//                                 <Box sx={{ width: 1300 }}>
//                                     <Slider value={diskGB} onChange={(e, val) => setDiskGB(val)} step={7} min={1} max={64} />
//                                 </Box>
//                                 <div className={styles.value}>{diskGB}</div>
//                                 <p>Гб</p>
//                             </div>
//                         </div>

//                         <div className={styles.iso}>
//                             <h2>Операционная система</h2>
//                             <div>
//                                 <button 
//                                     className={selectedOS === 'debian' ? styles.active : ''} 
//                                     onClick={() => { setIso('debian'); setSelectedOS('debian'); }}>
//                                     <img src={debian} alt="debian" />
//                                     <p>Debian</p>
//                                 </button>
//                                 <button 
//                                     className={selectedOS === 'ubuntu' ? styles.active : ''} 
//                                     onClick={() => { setIso('ubuntu'); setSelectedOS('ubuntu'); }}>
//                                     <img src={ubuntu} alt="ubuntu" />
//                                     <p>Ubuntu</p>
//                                 </button>
//                                 <button 
//                                     className={selectedOS === 'winserver' ? styles.active : ''} 
//                                     onClick={() => { setIso('winserver'); setSelectedOS('winserver'); }}>
//                                     <img src={winServer} alt="winServer" />
//                                     <p>WN Server</p>
//                                 </button>
//                             </div>
                            
//                         </div>
//                     </div>
//                     <button className={styles.confirm} onClick={handleAddVM}>Взять в аренду</button>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default Configurator
// Configurator.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
// import './Configurator.css';
import styles from './Configurator.module.css'
import LogoTextRow from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'

const Configurator = () => {
  const navigation = useNavigate()
  const [serverName, setServerName] = useState("");
  const [password, setPassword] = useState("");
  const [cpuCores, setCpuCores] = useState(1);
  const [ram, setRam] = useState(2);
  const [storageSize, setStorageSize] = useState(10);
  const [storageType, setStorageType] = useState("HDD");
  const [days, setDays] = useState(1);
  const [selectedOS, setSelectedOS] = useState({
    name: "Debian 12",
    template: "debian-12-standard_12.7-1_amd64.tar.zst",
    price: 200
  });

  const [formErrors, setFormErrors] = useState({});

  const generateVMID = () => Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000;
  const [vmid] = useState(generateVMID);


  const corePrice = 200; // Цена за ядро
  const ramPrice = 100;  // Цена за ГБ RAM
  const storagePrice = storageType === 'SSD' ? 2 : 1;

  const basePrice = (
    cpuCores * corePrice +
    ram * ramPrice +
    storageSize * storagePrice +
    selectedOS.price
  );
  const totalPrice = (basePrice * days).toFixed(2);

  const osOptions = [
    { name: "Debian 12", template: "debian-12-standard_12.7-1_amd64.tar.zst", price: 200 },
    { name: "Ubuntu 24.04", template: "ubuntu-24.04-standard_24.04-2_amd64.tar.zst", price: 200 },
    { name: "CentOS 9", template: "centos-9-stream-default_20240828_amd64.tar.xz", price: 1000 }
  ];

  const handleSubmit = async () => {
    const errors = {};
    if (!serverName) errors.name = "Введите имя сервера";
    if (!password) errors.password = "Введите пароль";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({}); // очищаем ошибки

    const configData = {
      vmid,
      name: serverName,
      password,
      memory: ram * 1024,
      cores: cpuCores,
      disk: storageSize,
      template: selectedOS.template,
      days
    }

    try{
      const response = await fetch('https://localhost:1337/api/lxc/create', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(configData)
      })

      const result = await response.json()
      console.log(result)
      if(result.status === "ok"){
        alert("Всё ок") // заменить на модальные окна
        navigation('/dashboard')
      }else{
        alert("Всё не ок")
      }
    }catch(e){
      console.error(e)
      alert("Всё не ок")
    }
  }
  return (
    <div className={styles.configurator}>
      <div className={styles.header}>
        <LogoTextRow />
          
      </div>
      <div className={styles.mainParts}>
        <div className={styles.configLeft}>
          <label className={styles.label}>
            Имя сервера
            <input
              className={formErrors.name ? styles.inputError : ""}
              type="text"
              maxLength={50}
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
            {formErrors.name && <div className={styles.errorText}>{formErrors.name}</div>}
          </label>
    
          <label className={styles.label}>
            Пароль
            <input
              className={formErrors.password ? styles.inputError : ""}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && <div className={styles.errorText}>{formErrors.password}</div>}
          </label>
    
          <div className={styles.configSection}>
            <div className={styles.configLabel}>
              Количество ядер CPU (до 3.7 ГГц):
              <p>+{(cpuCores * corePrice)} ₽</p>
            </div>
            <input
              type="range"
              min={1}
              max={4}
              value={cpuCores}
              onChange={(e) => setCpuCores(Number(e.target.value))}
            />
            <div className={styles}>{cpuCores} ядра</div>
          </div>
    
          <div className={styles.configSection}>
            <div className={styles.configLabel}>
              Объём RAM (DDR4):
              <p>+{(ram * ramPrice)} ₽</p>
            </div>
            <input
              type="range"
              min={2}
              max={16}
              step={2}
              value={ram}
              onChange={(e) => setRam(Number(e.target.value))}
            />
            <div>{ram} ГБ</div>
          </div>
    
          <div className={styles.configSection}>
            <div className={styles.configLabel}>
              Объём накопителя:
              <p>+{(storageSize * storagePrice)} ₽</p>
            </div>
            <div className={styles.storageToggle}>
              <button
                className={storageType === 'HDD' ? styles.active : ''}
                onClick={() => setStorageType('HDD')}
              >
                HDD
              </button>
              <button
                className={storageType === 'SSD' ? styles.active : ''}
                onClick={() => setStorageType('SSD')}
              >
                SSD
              </button>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={storageSize}
              onChange={(e) => setStorageSize(Number(e.target.value))}
            />
            <div>{storageSize} ГБ</div>
          </div>
    
          <div className={styles.configSection}>
            <div className={styles.configLabel}>
              Выбор ОС:
              <p>+{selectedOS.price} ₽</p>
            </div>
            <div className={styles.osOptions}>
              {osOptions.map((os) => (
                <button
                  key={os.name}
                  className={selectedOS.name === os.name ? styles.active : ''}
                  onClick={() => setSelectedOS(os)}
                >
                  {os.name}
                </button>
              ))}
            </div>
          </div>
    
          <div className={styles.configSection}>
            <div className={styles.configLabel}>
              Количество дней аренды:
              <p>{days} дн.</p>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
          </div>
        </div>
    
        <div className={styles.configRight}>
          <h2>Сводка конфигурации</h2>
          <ul>
            <li style={{ color: 'gray', fontStyle: 'italic' }}>VMID: {vmid}</li>
            <li>
              <img src="src\assets\minus.png" alt="" />
              Имя: {serverName || '—'}
            </li>
            <li>
              <img src="src\assets\minus.png" alt="" />
              CPU: {cpuCores} ядер
            </li>
            <li>
              <img src="src\assets\minus.png" alt="" />
              RAM: {ram} ГБ
            </li>
            <li>
              <img src="src\assets\minus.png" alt="" />
              Диск: {storageSize} ГБ ({storageType})
            </li>
            <li>
              <img src="src\assets\minus.png" alt="" />
              ОС: {selectedOS.name}
            </li>
            <li>
              <img src="src\assets\minus.png" alt="" />
              Дней аренды: {days}
            </li>
          </ul>
          <h3>Цена за день: {basePrice.toFixed(2)} ₽</h3>
          <h3>Итого: {totalPrice} ₽</h3>
          <button onClick={handleSubmit}>Добавить в корзину</button>
        </div>
      </div>
    </div>
      
  );
  
};

export default Configurator;