import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './Configurator.module.css'
import LogoTextRow from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'
import apiClient from '../../api/apiClient.js';
import userLogo from '../../assets/user1.svg'
import DropDowsnMenuD from '../../components/HeaderGroup/DropDownMenuD/DropDownMenuD.jsx';
import home from '../../assets/home.png'


const Configurator = () => {
  const navigation = useNavigate()
  const [userData, setUserData] = useState(null)
  const [openUserMenu, setOpenUserMenu] = useState(false)

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
      days,
      costday: basePrice,
      costfull: totalPrice
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
  
  return (
    <div className={styles.configurator}>
      <div className={styles.header}>
        <LogoTextRow />
        <button className={styles.homeBtn}><img src={home} alt="home" onClick={() => {navigation('/dashboard')}}/></button>
        <div className={styles.usermenu} onClick={() => setOpenUserMenu((prev) => !prev)}>
          <div>
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
          </div>
          <img src={userLogo} alt="userphoto" />  
        </div>
        {
          openUserMenu && <DropDowsnMenuD/>
        }
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