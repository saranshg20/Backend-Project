// below require will work but it is inconsistent with import
// require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.on("error", (error) => {
        console.log("Error:", error)
        throw error
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Process is running on port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection failed!!", err)
})








// // Approach 1: Non modular approach to connect with DB
// import { express } from "express"
// // whenever establishing connection with database
// // use async await because connection establishment might
// // take some time
// // Also use try and catch blocks

// const app = express()

// (async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("Error", error)
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     }
//     catch(error){
//         console.error("Error: ", error)
//         throw error
//     }
// })()