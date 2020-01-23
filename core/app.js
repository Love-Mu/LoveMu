const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const profileRouter = require('./routes/profile');
const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');

const theSecret = "HENLO FREN";

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://mongodb5388ol:tu8fyw@danu7.it.nuigalway.ie:8717/mongodb5388`, {useNewUrlParser: true}); // Insert DB URL here, username and passwords are environment variables

mongoose.connection.on('error', (err) => {
  console.log("MONGOOSE CONNECTION ERROR", err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: theSecret,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");

app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/profile/', profileRouter);

module.exports = app;
