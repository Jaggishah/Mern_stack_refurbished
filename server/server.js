const express = require('express')
const app = express()
require('dotenv').config();
app.use(express.json());
const port = process.env.PORT || 5000 ; 
const dbConfig = require('./config/dbConfig')

const userRoute = require('./routes/UsersRoute');

app.use('/api/users',userRoute);


app.listen(port,()=>console.log(`Node/Express  Js Server Started On Port ${port}`))