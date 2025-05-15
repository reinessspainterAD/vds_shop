const { proxmoxRequest, loginToProxmox } = require('./proxmox.js')
const express = require('express')
const expressWs = require('express-ws')
const cors = require('cors')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const VM = require('./models/vm.module.js')

const fs = require('fs');
const https = require('https');

const WebSocket = require('ws');
const { URLSearchParams } = require('url')


const app = express()
// expressWs(app);
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Загрузка ключа и сертификата
const server = https.createServer({
    key: fs.readFileSync('../localhost-key.pem'),
    cert: fs.readFileSync('../localhost.pem')
}, app);

expressWs(app, server); // Важно: передаём HTTPS-сервер

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/vds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Регистрация
app.post('/api/register', async(req, res) =>{
    try{
        const { name, email, password, image } = req.body;

        // Проверка на пустые поля
        if (!name || !email || !password) {
            return res.status(400).json({ status: 'error', error: 'Все поля обязательны для заполнения' });
        }

        // Проверка длины пароля
        if (password.length < 8) {
            return res.status(400).json({ status: 'error', error: 'Пароль должен содержать не менее 8 символов' });
        }

        // Проверка на повтор email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'Email уже зарегистрирован' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            image, // ← это обязательно
        });
        await user.save()
        res.json({ status: 'ok'})
    } catch (e){
        res.json({ status: 'error', error: 'Server error'})
    }
})

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверка на пустые поля
        if (!email || !password) {
            return res.status(400).json({ status: 'error', error: 'Все поля обязательны для заполнения' });
        }

        // Проверка длины пароля
        if (password.length < 8) {
            return res.status(400).json({ status: 'error', error: 'Пароль должен содержать не менее 8 символов' });
        }

        // Поиск пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: 'error', error: 'Неверная почта' });
        }

        // Сравнение пароля
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: 'error', error: 'Неверный пароль' });
        }

        // Создание токена
        const token = jwt.sign(
            { email: user.email },
            'secret123'
        );

        res.json({ status: 'ok', user: token });
    } catch (err) {
        console.error('Ошибка при входе:', err);
        res.status(500).json({ status: 'error', error: 'Ошибка сервера' });
    }
})



app.get('/api/user-data', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Извлекаем токен из заголовка
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'secret123'); // Проверяем токен
        const user = await User.findOne({ email: decoded.email }); // Находим пользователя по email из токена

        if (!user) {
            return res.status(404).json({ status: 'error', error: 'User not found' });
        }

        // Возвращаем данные пользователя (кроме пароля)
        return res.json({ status: 'ok', user: { name: user.name, email: user.email, image: user.image} });
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Invalid token' });
    }
});

// Изменение имени
app.put('/api/user/update-name', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { name } = req.body;

    if (!token || !name) {
        return res.status(400).json({ status: 'error', error: 'Токен и имя обязательны' });
    }

    try {
        const decoded = jwt.verify(token, 'secret123');
        await User.updateOne({ email: decoded.email }, { name });
        return res.json({ status: 'ok', message: 'Имя обновлено' });
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Недопустимый токен' });
    }
});

// Изменение электронной почты
app.put('/api/user/update-email', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { newEmail } = req.body;

    if (!token || !newEmail) {
        return res.status(400).json({ status: 'error', error: 'Токен и email обязательны' });
    }

    try {
        const decoded = jwt.verify(token, 'secret123');

        // Проверка, что новый email ещё не занят
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json({ status: 'error', error: 'Email уже используется' });
        }

        await User.updateOne({ email: decoded.email }, { email: newEmail });
        return res.json({ status: 'ok', message: 'Email обновлён' });
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Недопустимый токен' });
    }
});
// Изменение пароля
app.put('/api/user/update-password', async (req, res) => {
    console.log('req.body:', req.body);
    const token = req.headers.authorization?.split(' ')[1];
    const { password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ status: 'error', error: 'Токен и пароль обязательны' });
    }

    try {
        const decoded = jwt.verify(token, 'secret123');
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ email: decoded.email }, { password: hashedPassword });
        return res.json({ status: 'ok', message: 'Пароль обновлён' });
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Недопустимый токен' });
    }
});

// Изменение аватара
app.put('/api/user/update-avatar', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { image } = req.body;

    if (!token || !image) {
        return res.status(400).json({ status: 'error', error: 'Токен и изображение обязательны' });
    }

    try {
        const decoded = jwt.verify(token, 'secret123');
        await User.updateOne({ email: decoded.email }, { image });
        return res.json({ status: 'ok', message: 'Аватар обновлён' });
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Недопустимый токен' });
    }
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


app.use(bodyParser.urlencoded({ extended: true })) // Указываем, что данные передаются как x-www-form-urlencoded
app.use(bodyParser.json());

// Middleware для проверки токена пользователя
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'].split(" ")[1];;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, "secret123", (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = decoded;
        next();
        console.log('ok')
    });
};

app.post("/api/lxc/create", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        const containerData = {
            vmid: req.body.vmid,
            hostname: `ct-${req.body.name}`,
            memory: req.body.memory,
            cores: req.body.cores,
            net0: 'name=eth0,bridge=vmbr0,ip=dhcp',
            rootfs: `hdd:${req.body.disk}`, // например: "local:8"
            ostemplate: `local:vztmpl/${req.body.template}`, // пример: "local:vztmpl/debian-11-standard_11.0-1_amd64.tar.gz"
            password: req.body.password,
            storage: 'hdd', // Хранилище, где создается контейнер
            swap: 512,
            arch: "amd64",
            unprivileged: 1,
            features: "nesting=1"
        };

        console.log("Отправляемые данные в Proxmox:", containerData);
        const lxcResponse = await proxmoxRequest('POST', '/nodes/pve/lxc', containerData);
        console.log("Ответ Proxmox:", lxcResponse);

        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(startDate.getDate() + Number(req.body.days))
        
        const newContainer = new VM({
            userId: user._id,
            vmId: Number(req.body.vmid),
            name: `ct-${req.body.name}`,
            memory: req.body.memory,
            cpu: req.body.cores,
            disk: req.body.disk,
            os: req.body.template,
            startDate,
            endDate,
            active: true,
            costDay: req.body.costday,
            costFull: req.body.costfull
        });

        await newContainer.save();
        res.json({ status: "ok", data: lxcResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение списка контейнеров пользователя
app.get('/api/lxc/list', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const containers = await VM.find({ userId: user._id , active: true}); // Модель VM переиспользована
        console.log("Найденные контейнеры:", containers);
        return res.json({ status: 'ok', containers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/lxc/negativelist', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const containers = await VM.find({ userId: user._id , active: false}); // Модель VM переиспользована
        console.log("Найденные контейнеры:", containers);
        return res.json({ status: 'ok', containers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение статуса контейнера
app.get('/api/lxc/status/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        const status = await proxmoxRequest('GET', `/nodes/pve/lxc/${vmid}/status/current`);
        
        res.json({ status: 'ok', data: status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Остановка контейнера
app.post('/api/lxc/stop/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        await proxmoxRequest('POST', `/nodes/pve/lxc/${vmid}/status/stop`);
        res.json({ status: 'ok', message: `Контейнер ${vmid} остановлен` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление контейнера
app.delete('/api/lxc/delete/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;

        // Удаление самого контейнера в Proxmox
        await proxmoxRequest('DELETE', `/nodes/pve/lxc/${vmid}`);

        // Обновление записи в БД: помечаем как неактивную
        const updated = await VM.findOneAndUpdate(
            { vmId: vmid },
            { active: false },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: `Контейнер с vmId ${vmid} не найден.` });
        }

        res.json({ status: 'ok', message: `Контейнер ${vmid} деактивирован (удалён логически)` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Перезагрузка контейнера
app.post('/api/lxc/restart/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        await proxmoxRequest('POST', `/nodes/pve/lxc/${vmid}/status/reboot`);
        res.json({ status: 'ok', message: `Контейнер ${vmid} перезапущен` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запуск контейнера
app.post('/api/lxc/start/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        await proxmoxRequest('POST', `/nodes/pve/lxc/${vmid}/status/start`);
        res.json({ status: 'ok', message: `Контейнер ${vmid} запущен` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.ws('/api/lxc/console/:vmid', async (ws, req) => {
    const { vmid } = req.params;

    try{
        // 1. Логинимся и получаем ticket
        const session = await loginToProxmox();
        console.log(session)

        // 2. Получаем данные VNC
        const response = await axios.post(`https://pve.starovoytov.online/api2/json/nodes/pve/lxc/${vmid}/termproxy`, 
            {}, 
            {
            headers: {
                Cookie: `PVEAuthCookie=${session.ticket}`,
                CSRFPreventionToken: session.CSRFPreventionToken
            },
            httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
        });
        console.log(response)

        const { port, ticket } = response.data.data;
        console.log(port, ticket)

        // 3. Устанавливаем соединение с Proxmox WebSocket
        const target = new WebSocket(`wss://pve.starovoytov.online/api2/json/nodes/pve/lxc/${vmid}/vncwebsocket?port=${port}&vncticket=${encodeURIComponent(ticket)}`, {
            headers: {
                Cookie: `PVEAuthCookie=${session.ticket}`
            },
            rejectUnauthorized: false
        });

        // 4. Проксируем данные
        target.on('open', () => {
            // Отправляем ping для поддержания соединения
            setInterval(() => {
                if (target.readyState === WebSocket.OPEN) {
                    target.ping();
                }
            }, 10000); // Пинг каждую секунду или нужный интервал
        
            ws.on('message', msg => target.send(msg));
            target.on('message', msg => ws.send(msg));
        });

        target.on('close', () => {
            console.log('WebSocket connection to Proxmox closed');
            ws.close(); // Закрываем клиентский WebSocket
        });
        
        ws.on('close', () => {
            console.log('WebSocket connection from client closed');
            target.close(); // Закрываем серверный WebSocket
        });

        target.on('error', (err) => {
            console.error('WebSocket error with Proxmox:', err.message);
            ws.close(); // Закрываем WebSocket на стороне клиента
        });

        ws.on('error', (err) => {
            console.error('WebSocket error with client:', err.message);
            target.close(); // Закрываем WebSocket на стороне сервера
        });
    }catch(e){
        console.error('Ошибка подключения к Proxmox:', e.message)
    }
})
// //Подключение к терминалу
// const wss = new WebSocket.Server({ server, path: '/api/lxc/terminal' });

// wss.on('connection', async(clientSocket, req) =>{
//     const urlParams = new URLSearchParams(req.url.split('?')[1])
//     const vmid = urlParams.get('vmid')

//     try{
//         //Получение токена
//         const termproxyRes = await proxmoxRequest(
//             'POST',
//             `/nodes/pve/lxc/${vmid}/termproxy`,
//             {}
//         )
//         const { port, ticket } = termproxyRes.data
//         console.log(port, ticket)

//         const proxmoxSocket = new WebSocket(`wss://pve.starovoytov.online/api2/json/nodes/pve/lxc/${vmid}/vncwebsocket?port=${port}&vncticket=${encodeURIComponent(ticket)}`, {
//             headers:{
//                 'Cookie': `PVEAuthCookie=${ticket}`
//             },
//             rejectUnauthorized: false
//         })

//         proxmoxSocket.on('open', () => {
//             //связь между клиентом и proxmox
//             clientSocket.on('message', msg => proxmoxSocket.send(msg))
//             proxmoxSocket.on('message', msg => clientSocket.send(msg))
//         })

//         proxmoxSocket.on('close', () => clientSocket.close())
//         clientSocket.on('close', () => proxmoxSocket.close())
        
//     }catch(e){
//         console.error('Ошибка подключения к контейнеру:', e.message)
//         clientSocket.close()
//     }
// })



server.listen(1337, () =>{
    console.log('HTTPS сервер запущен на порту 1337')
})