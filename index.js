require('express-async-errors')
const winston = require('winston')
require("winston-mongodb")
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const config = require('config')
const express = require('express')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movie')
const rentals = require('./routes/rentals')
const users = require('./routes/user')
const auth = require('./routes/auth')
const error = require('./middleware/error')
const app = express()

app.use(express.json());
app.use('/api/customers', customers);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)

app.use(error)

winston.exceptions.handle(new winston.transports.File({ filename : 'uncaughtExceptions.log'}))

process.on('unhandledRejection', (ex) => {
    throw ex;
})

winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({ db : 'mongodb://localhost:27017/vidly' }));

if(!config.get('jwtPrivateKey')){
    throw new Error('FATAL ERROR : jwtPrivateKey is not defined')
    process.exit(1)
}

mongoose.connect('mongodb://localhost:27017/vidly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB', err))

/*const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
     
    // Connection URL
const url = 'mongodb://localhost:27017';
     
    // Database Name
const dbName = 'vidly';
     
    // Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to MongoDB");
     
    const db = client.db(dbName);
     
      client.close();
});*/


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))