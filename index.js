// importing of all the modules will be here //
const express=require("express")
const cors=require("cors")
const connection = require("./db")
const userRouter = require("./routes/user.routes")
require("dotenv").config()

// ****************************************** //

// calling of all the modules will be here //

const app=express()

// ****************************************** //


// all the middlewares here
app.use(cors())
app.use(express.json())
app.use("/user",userRouter)

// ****************************************** //



//all the logic here

app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("connected to the db")
        console.log(`server is running at port:-${process.env.PORT}`)
    } catch (error) {
        console.log(error.message)
    }
})
// ****************************************** //