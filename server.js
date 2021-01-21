// DEPENDENCIES
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const userRoutes = require('./routes/auth/index');

// INIT SERVER
const server = express();

// MIDDLEWARE
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/users', userRoutes);

// DB CONNECT
const db = process.env.DB;
try {
    mongoose.connect(
        db, 
        { 
            useNewUrlParser:true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log('Connected To DB'))
    .catch(err => console.log(err));  
} catch(err) {
    console.log(err);
}


// PORT
const port = process.env.PORT;

// START SERVER
server.listen(port, () => {
    console.log(`SERVER LISTENING ON PORT: ${port}`)
})





