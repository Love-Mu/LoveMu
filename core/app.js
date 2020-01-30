const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const profileRouter = require('./routes/profile');
const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect(`mongodb://${process.env.dbUSER}:${process.env.dbPASS}@danu7.it.nuigalway.ie:8717/${process.env.db}`, {useNewUrlParser: true, useUnifiedTopology:true}); // Insert DB URL here, username and passwords are environment variables

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
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({}));

require('./config/passport');

app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/profile/', profileRouter);

module.exports = app;
