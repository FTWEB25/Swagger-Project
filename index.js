// importing of all the modules will be here //
const express=require("express")
const cors=require("cors")
const connection = require("./db")
const userRouter = require("./routes/user.routes")
require("dotenv").config()
const swaggerJsDoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")

// ****************************************** //

// calling of all the modules will be here //

const app=express()

// ****************************************** //

// swagger API configuration //

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Swagger Project",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:8080"
            }
        ]
    },
    apis:["./routes/*.js"]
}

//Swagger API specification

const openAPIspec=swaggerJsDoc(options)


// Swagger API UI build

app.use("/docs",swaggerUi.serve,swaggerUi.setup(openAPIspec))




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