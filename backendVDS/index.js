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

app.listen(1337, () =>{
    console.log('SERVER started on 1337')
})