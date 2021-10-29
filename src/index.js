const express = require('express')
const app = express()
const User = require('./db/models/user')
const Tasks = require('./db/models/tasks')
const userRouter = require('./router/user')
const taskRouter = require('./router/tasks')
require('./db/mongoose')
const port = process.env.port || 3000
//to parse post request
app.use(express.json())


// app.post('/upload', upload.single('upload'), (req,res)=>{
//     res.send()
// } )

app.use(userRouter)

app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up and running at ' + port)
})

