const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const spotifyRouter = require('./routes/spotify');

const app = express();

mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}`, {useNewUrlParser: true}); // Insert DB URL here, username and passwords are environment variables

mongoose.connection.on('error', (err) => {
  console.log("MONGOOSE CONNECTION ERROR", err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/spotify', spotifyRouter);

module.exports = app;
