const express = require('express')

const path=require('path')
const publicDiretory =path.join(__dirname,'../public');

require("./db_config/db")
const userRouter= require('./routers/user')
const postRouter= require('./routers/post')

// const cors=require('cors')
// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

const app = express()

app.use(express.json())
// app.use(cors(corsOptions)) 
app.use(express.static(publicDiretory))

app.use(userRouter)
app.use(postRouter)

module.exports=app

 