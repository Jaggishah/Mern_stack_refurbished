const mongoose = require('mongoose')
// console.log(process.env.mongo_url)
mongoose.connect(process.env.mongo_url)

const connection = mongoose.connection;

connection.on('connected',()=>{
    console.log('Mongoose Connected')
})

connection.on('error',(err)=>{
    console.log('Mongoose Connection failed',process.env.mongo_url)
})

module.exports = connection;