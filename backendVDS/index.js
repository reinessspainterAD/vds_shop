import express from 'express'
const app = express()
import cors from 'cors'
import mongoose from 'mongoose'
import User from './models/user.model.js'
import jwt from'jsonwebtoken'
import bcrypt from 'bcryptjs'

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/mern-quotes')

app.post('/api/register', async(req, res) =>{
    console.log(req.body)
    try{
        const newPassword = await bcrypt.hash(req.body.password, 10)
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })
        res.json({ status: 'ok' })
    } catch (err){
        res.json({ status: 'error', error: 'Duplicate email'})
    }
})

app.post('/api/login', async (req, res) => {
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
                name: user.name,
                email: user.email,
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

app.listen(1337, () =>{
    console.log('SERVER started on 1337')
})