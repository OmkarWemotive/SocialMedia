//-------------Database Configuration----------------------------------

const mongoose= require('mongoose')
const { default: validator } = require('validator')
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser:true, useUnifiedTopology:true })
