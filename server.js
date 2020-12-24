const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

// Load env variables 
dotenv.config({path: './config/config.env'})

// routes files
const users = require('./routes/user');

// connect to database
connectDB();

// initialize app
const app = express()

// body parser (middleware)
app.use(express.json())

const PORT = process.env.PORT || 4000

// Routes
app.use('/user', users)

// listen on port
app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)