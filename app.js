const express = require('express')
const { MongoClient } = require('mongodb')
const app = express()

app.use(express.json())

const client = new MongoClient('mongodb://localhost:27017')
let users; 

async function start(){
    await client.connect()
    const db = client.db('shool') 
    users = db.collection('users')

    const authRoutes = require('./service')(users)
    app.use('/auth', authRoutes)

    app.listen(3000, () => console.log('Сервер запущен на http://localhost:3000'))
}
start() 