const express = require('express')

require("./db_config/db")
const userRouter= require('./routers/user')
const postRouter= require('./routers/post')

const app = express()

app.use(express.json()) 
app.use(userRouter)
app.use(postRouter)

module.exports=app

