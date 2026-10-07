import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import customerRoutes from './routes/customer.routes.js'
import productRoutes from './routes/product.routes.js'


const app = express()
const Port = 9001

dotenv.config()
mongoose.connect(process.env.dbURL).then(()=>{
    console.log('DB connected')
}).catch((err)=>{
    console.log(err)
})

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use('/customer', customerRoutes)
app.use('/products', productRoutes)

app.get('/', (req, res)=>{
    res.send("Server is running")
})

app.listen(Port, ()=>{
    console.log('Server Started Successfully')
})
