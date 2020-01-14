const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');

const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${process.env.USER}:${process.env.PASS}`, {useNewUrlParser: true}); // Insert DB URL here, username and passwords are environment variables

mongoose.connection.on('error', (err) => {
  console.log("MONGOOSE CONNECTION ERROR", err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
}));

module.exports = app;
