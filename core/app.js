const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('../config.js');
const profileRouter = require('./routes/profile');
const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${config.USER}:${config.PASS}@danu7.it.nuigalway.ie:8717/${config.DB}`, {useNewUrlParser: true}); // Insert DB URL here, username and passwords are environment variables

mongoose.connection.on('error', (err) => {
  console.log("MONGOOSE CONNECTION ERROR", err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/profile/', profileRouter);

module.exports = app;
