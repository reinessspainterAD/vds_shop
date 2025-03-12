const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const expressWs = require('express-ws')
const { createProxyMiddleware } = require('http-proxy-middleware');
const User = require('./models/user.model.js')
const VM = require('./models/vm.module.js')
// const { createVM, getVMStatus, stopVM, deleteVM } = require('./proxmox.js')
const { proxmoxRequest } = require('./proxmox.js')
const bodyParser = require('body-parser')
const qs = require("qs");

const app = express()
expressWs(app);
app.use(cors())
app.use(express.json())


// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/vds', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Регистрация
app.post('/api/register', async(req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        await user.save()
        res.json({ status: 'ok'})
    } catch (err){
        res.json({ status: 'error', error: 'Duplicate email'})
    }
})

app.post('/api/login', async (req, res) => {
    // const user = await User.findOne({ email: req.body.email})
    // if (!user) {
    //  return res.json({ status: 'error', error: 'Invalid login'})
    // }

    // const validPassword = await bcrypt.compare(req.body.password, user.password)
    // if(!validPassword){
    //     return res.json({ status: 'error', error: 'Invalid password'})
    // } 

    // if(validPassword){
    //     const token = jwt.sign({ email: user.email }, 'secret123')
    //     res.json({ status: 'ok' },token)
    // }else{
    //     return res.json({ status: 'error' })
    // }
    
    const user = await User.findOne({
        email: req.body.email,
    })

    if(!user) {
        return { status: 'error', error: 'invalid login'}
    }

    const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
    )

    if(isPasswordValid) {
        const token = jwt.sign(
            {
                // name: user.name,
                email: user.email
            },
            'secret123'
        )

        return res.json({ status: 'ok', user: token})
    }else{
        return res.json({ status: 'error', user: false})
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
        return res.json({ status: 'ok', user: { name: user.name, email: user.email } });
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Invalid token' });
    }
});

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
// Создание ВМ
app.post("/api/vm/create", verifyToken, async (req, res) => {
    try {
        // const { vmid, name, sockets, cores, memory, disk, iso } = req.body;
        const user = await User.findOne({ email: req.user.email });

        // const test ={
        //     vmid: 8888,
        //     name: `vm-1111`,
        //     memory: 2048,
        //     sockets: 1,
        //     cores: 1,
        //     net0: 'virtio,bridge=vmbr0',
        //     scsi0: `hdd:10,format=raw`,
        //     ide2: `local:iso/debian-12.6.0-amd64-netinst.iso,media=cdrom`
        // };
        const test ={
            vmid: req.body.vmid,
            name: `vm-${req.body.name}`,
            memory: req.body.memory,
            sockets: req.body.sockets,
            cores: req.body.cores,
            net0: 'virtio,bridge=vmbr0',
            scsi0: `hdd:${req.body.disk},format=raw`,
            ide2: `local:iso/${req.body.iso},media=cdrom`
        };
        console.log("Отправляемые данные в Proxmox:", test);
        const vmResponse = await proxmoxRequest('POST', '/nodes/pve/qemu', test)
        console.log("Ответ Proxmox:", vmResponse);
        // console.log("Отправляемые данные в Proxmox:", vmConfig);
        // const vmResponse = await createVM(vmConfig);
        

        const newVM = new VM({
            userId: user._id,
            vmId: Number(req.body.vmid),
            name: `vm-${req.body.name}`,
            memory: req.body.memory,
            sockets: req.body.sockets,
            cpu: req.body.cores,
            disk: req.body.disk,
            iso: req.body.iso,
        });

        await newVM.save();
        res.json({ status: "ok", data: vmResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение списка ВМ пользователя
app.get('/api/vm/list', verifyToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const vms = await VM.find({ userId: user._id });
    res.json({ status: 'ok', vms });
});

// Получение статуса ВМ
app.get('/api/vm/status/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        const status = await proxmoxRequest('GET', `/nodes/pve/qemu/${vmid}/status/current`);
        res.json({ status: 'ok', data: status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Остановка ВМ
app.post('/api/vm/stop/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        await proxmoxRequest('POST', `/nodes/pve/qemu/${vmid}/status/stop`);
        res.json({ status: 'ok', message: `VM ${vmid} остановлена` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление ВМ
app.delete('/api/vm/delete/:vmid', verifyToken, async (req, res) => {
    try {
        const { vmid } = req.params;
        await proxmoxRequest('DELETE', `/nodes/pve/qemu/${vmid}`);
        await VM.findOneAndDelete({ vmId: vmid });
        res.json({ status: 'ok', message: `VM ${vmid} удалена` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(1337, () =>{
    console.log('SERVER started on 1337')
})