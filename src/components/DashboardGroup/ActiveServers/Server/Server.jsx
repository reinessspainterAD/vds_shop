import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
// import RFB from "novnc-core"; //API
// import axios from 'axios' //API
import { mockVMs } from "../../mockData.js";
import Arrow from '../../../../assets/BackArrow.svg'
import Start from '../../../../assets/play.svg'
import Stop from '../../../../assets/stop.svg'
import Restart from '../../../../assets/restart.svg'
import Terminate from '../../../../assets/delete.svg'
import styles from './Server.module.css'

function Server (){
    // Реальное API
    // const { vmid } = useParams()
    // const [server, setServer] = useState(null)
    // const [error, setError] = useState(null)
    // const canvasRef = useRef(null)
    // const rfbRef = useRef(null)
    // const effectRan1 = useRef(false);
    // const effectRan2 = useRef(false);

    // useEffect(() => {
    //     if (effectRan1.current) return; // Предотвращаем повторный вызов
    //     effectRan1.current = true;
    //     const fetchServerParams = async () =>{
    //         try{
    //             const response = await fetch(`http://localhost:1337/api/vm/status/${vmid}`, {
    //                 method: 'GET',
    //                 headers:{
    //                     'Content-Type':'application/json',
    //                     'Authorization': `Bearer ${localStorage.getItem("token")}`
    //                 }
    //             })
    //             const data = await response.json()
    //             setServer(data.data)
    //         }catch(error){
    //             setError("Ошибка загрузки данных ВМ", error);
    //         }
    //     }
    //     fetchServerParams()
    //     // const interval = setInterval(fetchServerParams, 3000)
    //     // return () => clearInterval(interval)
    // }, [vmid])

    // useEffect(() => {
    //     if (!server) return;
    //     if (effectRan2.current) return;
    //     effectRan2.current = true;
    
    //     const connectVNC = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:1337/api/vm/vnc/${vmid}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${localStorage.getItem("token")}`
    //                 }
    //             });
    
    //             const data2 = await response.json();
    //             if (!data2.data) throw new Error("Не удалось получить данные VNC");
    
    //             const { port, ticket } = data2.data;
    //             const wsUrl = `wss://pve.starovoytov.online/api2/json/nodes/pve/qemu/${vmid}/vncwebsocket?port=${port}&ticket=${ticket}`;
    
    //             // Передаём в RFB не WebSocket, а ссылку на canvas
    //             const rfbInstance = new RFB(canvasRef.current, wsUrl);
    //             rfbInstance.scaleViewport = true;
    //             rfbInstance.background = "#000";
    //             // rfbInstance.viewportDrag = true;
    
    //             rfbRef.current = rfbInstance;
    
    //         } catch (error) {
    //             setError("Ошибка подключения к терминалу");
    //             console.error("Ошибка VNC:", error);
    //         }
    //     };
    
    //     connectVNC();
    
    //     return () => {
    //         if (rfbRef.current) {
    //             rfbRef.current.disconnect();
    //         }
    //     };
    // }, [server]);
    

    // const handleAction = async (action) => {
    //     try{
    //         await axios.post(`http://localhost:1337/api/vm/${action}/${vmid}`, {}, {
    //             headers:{
    //                 'Content-Type':'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem("token")}`
    //             }
    //         })
    //         alert(`ВМ ${action} успешно выполнено!`)
    //     }catch(error){
    //         alert("Ошибка выполнения действия", error.message);
    //     }
    // }
    // if (!server) return <p>Загрузка...</p>;
    // if (error) return <p>{error}</p>;

    // return(
    //     <div>
    //         <h1>{server.name}</h1>
    //         <p>CPU: {server.cpu || 0}%</p>
    //         <p>RAM: {server.memory || 0}%</p>
    //         <button onClick={() => handleAction("start")}>Запуск</button>
    //         <button onClick={() => handleAction("stop")}>Остановка</button>
    //         <button onClick={() => handleAction("reboot")}>Перезапуск</button>
    //         <button onClick={() => handleAction("delete")}>Удаление</button>
    //         <div ref={canvasRef} style={{ width: "800px", height: "600px", background: "black" }}></div>
    //     </div>
    // )

    //Mock.js
    const navigate = useNavigate();
    const { vmid } = useParams();
    const server = mockVMs.find((vm) => vm.vmId === Number(vmid));

    if (!server) return <p>Сервер не найден</p>;

    return (
        <div className={styles.server}>
            <div className={styles.header}>
                <button onClick={() => navigate('/dashboard/')} className={styles.backButton}><img src={Arrow} alt="arrow" /></button>
                <h1>{server.name} ({server.vmId})</h1>
            </div>
            <div className={styles.params}>
                <div>
                    <p>Использование процессора: {server.cpuProc}% / {server.cpuCR} CPU(s)</p>
                    <p>Использование оперативной памяти: {server.memoryProc}% / {server.memoryGB} GB(s)</p>
                    <p>Использование дискового пространства: {server.diskProc}% / {server.diskGB} GB(s)</p>
                </div>
                <div>
                    <p>Количество ядер процессора: {server.cpuCR}</p>
                    <p>Количество сокетов процессора: {server.socket}</p>
                    <p>Оболочка операционной системы: {server.iso}</p>
                </div>
                <div className={styles.buttonGrid}>
                    <button><img src={Start} alt="start" /> Запуск</button>
                    <button><img src={Stop} alt="stop" />Остановка</button>
                    <button><img src={Restart} alt="restart" />Рестарт</button>
                    <button><img src={Terminate} alt="terminate" />Удалить</button>
                </div>
            </div>
            <div className={styles.terminal}>
                Terminal
            </div>

        </div>
        // <div>
        //     <h1>{server.name}</h1>
        //     <p>CPU: {server.cpu}%</p>
        //     <p>RAM: {server.memory}%</p>
        //     <button>Запуск</button>
        //     <button>Остановка</button>
        //     <button>Перезапуск</button>
        //     <button>Удаление</button>
        //     <div style={{ width: "600px", height: "400px", background: "black" }}>Mock VNC</div>
        // </div>
    );
}

export default Server