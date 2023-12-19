import express from 'express'
import cors from 'cors'
// cookieparser is use to get access
// to perform CRUD operation on users cookies
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

//routes import

import userRouter from "./routes/user.routes.js"


//routes declaration
// http://localhost:8000/api/v1/users/register
app.use("/api/v1/users", userRouter)

export { app }