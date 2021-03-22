const app=require('./app')

const port = process.env.PORT || 4000

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

// "start": "env-cmd -f ./config/dev.env node src/index.js"

