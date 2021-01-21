// DEPENDENCIES
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const userRoutes = require('./routes/auth/index');

// INIT SERVER
const server = express();

// MIDDLEWARE
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/users', userRoutes);


// PORT
const port = process.env.PORT;

// START SERVER
server.listen(port, () => {
    console.log(`SERVER LISTENING ON PORT: ${port}`)
})





