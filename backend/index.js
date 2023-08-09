const express = require('express');
const app= express();
const db= require('./config/mongoose')
const  cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));


app.get('/', (req,res)=>{
    res.send("Hello World!");
})


app.use('/api/v1/users', require('./routes/index'));
app.use('/api/v1/task', require('./routes/taskRoutes'))
app.listen(1212, (error)=>{
    if(error){
        console.log("Server",error.message);
    }
    console.log("server start");
})