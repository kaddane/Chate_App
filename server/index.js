

import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from "cors"
import mongoose from 'mongoose'
import authRoutes from './routes/AuthRout.js'
import contactsRout from './routes/ContactRout.js'
import setupSocket from './socket.js'
import messagesRoute from './routes/MessageRout.js'

dotenv.config()

const app = express()
const port = process.env.PORT
const databaseURL = process.env.DATABASE_URL

app.use(cors({
    origin:[process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials:true
}))

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"))

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactsRout)
app.use("/api/messages", messagesRoute)


const server = app.listen(port, ()=> {
    console.log(`server is runing at http://localhost:${port}`)
})

setupSocket(server)

mongoose.connect(databaseURL).then(() => {
    console.log('db conected')
}).catch((err) => {
    console.log(err.message)
});
























