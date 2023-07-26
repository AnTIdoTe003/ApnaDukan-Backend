import express from 'express'
import dotenv from 'dotenv'
import {mongoose} from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import connectDb from './config/userConfig.js'
import router from './routes/authRoutes.js'
import categoryRoute from './routes/categoryRoutes.js'
import productRoute from './routes/productRoutes.js'
import orderRoute from './routes/orderRoutes.js'
dotenv.config()
// app initialization
const app = express()

// database connection settings
connectDb()

// middleware
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// api route
app.use('/api/v1/auth', router)
app.use('/api/v1/category',categoryRoute)
app.use("/api/v1/product", productRoute);
app.use('/api/v1/orders', orderRoute)
const PORT = process.env.PORT || 4000

app.listen(PORT, ()=>{
    console.log(`Server listening on ${PORT}`)
})