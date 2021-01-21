// DEPENDENCIES
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

// INIT SERVER
const server = express();

// MIDDLEWARE
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));


// PORT
const port = process.env.PORT;

// START SERVER
server.listen(port, () => {
    console.log(`SERVER LISTENING ON PORT: ${port}`)
})





