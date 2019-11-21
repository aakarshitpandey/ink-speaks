require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const userRouter = require('./routes/users')
const indexRouter = require('./routes/index')


//connection to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

//intializing express
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//setting up the routers
app.use('/', indexRouter)
app.use('/users', userRouter)

//listen to port
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server listening to port: ${port}`))