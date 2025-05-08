import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import RFB from "novnc-core"; //API
import axios from 'axios' //API
import { mockVMs } from "../../mockData.js";
import Arrow from '../../../../assets/BackArrow.svg'
import Start from '../../../../assets/play.svg'
import Stop from '../../../../assets/stop.svg'
import Restart from '../../../../assets/restart.svg'
import Terminate from '../../../../assets/delete.svg'
import styles from './Server.module.css'

function Server (){
    const { vmid } = useParams()
    const [server, setServer] = useState(null)
    const [error, setError] = useState(null)
    const canvasRef = useRef(null)
    const rfbRef = useRef(null)
    const effectRan1 = useRef(false);

    console.log(vmid)
    console.log(server)
    useEffect(() => {
        if (effectRan1.current) return; // Предотвращаем повторный вызов
        effectRan1.current = true;
        const fetchServerParams = async () =>{
            try{
                const response = await fetch(`http://localhost:1337/api/vm/status/${vmid}`, {
                    method: 'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    }
                })
                const data = await response.json()
                setServer(data.data)
            }catch(error){
                setError("Ошибка загрузки данных ВМ", error);
            }
        }
        fetchServerParams()
        // const interval = setInterval(fetchServerParams, 3000)
        // return () => clearInterval(interval)
    }, [vmid])

    const connectVNC = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/vm/vnc/${vmid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data2 = await response.json();
            console.log(data2);
            if (!data2.data) throw new Error("Не удалось получить данные VNC");

            const { port, ticket } = data2.data;
            console.log(port, ticket);

            // Создаём URL для WebSocket-соединения
            const wsUrl = `wss://pve.starovoytov.online/api2/json/nodes/pve/qemu/${vmid}/vncwebsocket?port=${port}&vncticket=${ticket}`;
            console.log(wsUrl);

            // Инициализация rfbInstance
            const rfbInstance = new RFB(canvasRef.current, wsUrl);
            rfbInstance.scaleViewport = true;
            rfbInstance.background = "#000";
            rfbRef.current = rfbInstance;

            // Обработчики событий для WebSocket
            rfbInstance.addEventListener('connect', () => {
                console.log('WebSocket соединение установлено');
            });

            rfbInstance.addEventListener('disconnect', () => {
                console.log('WebSocket соединение разорвано');
                setTimeout(() => {
                    console.log('Попытка переподключения...');
                    connectVNC();
                }, 5000);
            });

            rfbInstance.addEventListener('error', (error) => {
                console.error('Ошибка WebSocket:', error);
                setError('Ошибка WebSocket: ' + error.message);
            });

        } catch (error) {
            setError("Ошибка подключения к терминалу");
            console.error("Ошибка VNC:", error);
        }
    };

    // Используем useEffect, чтобы подключиться к VNC, когда компонент монтируется
    // useEffect(() => {
    //     connectVNC();

    //     // Очистка при размонтировании компонента
    //     return () => {
    //         if (rfbRef.current) {
    //             rfbRef.current.disconnect();
    //         }
    //     };
    // }, [server]);
    

    const handleAction = async (action) => {
        try{
            await axios.post(`http://localhost:1337/api/vm/${action}/${vmid}`, {}, {
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            })
            alert(`ВМ ${action} успешно выполнено!`)
        }catch(error){
            alert("Ошибка выполнения действия", error.message);
        }
    }
    if (!server) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;

    return(
        <div>
            <h1>{server.name}</h1>
            <p>CPU: {server.cpu || 0}%</p>
            <p>RAM: {server.memory || 0}%</p>
            <button onClick={() => handleAction("start")}>Запуск</button>
            <button onClick={() => handleAction("stop")}>Остановка</button>
            <button onClick={() => handleAction("reboot")}>Перезапуск</button>
            <button onClick={() => handleAction("delete")}>Удаление</button>
            <div ref={canvasRef} style={{ width: "800px", height: "600px", background: "black" }}></div>
        </div>
    )
}

export default Server