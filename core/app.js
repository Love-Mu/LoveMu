const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socket_io = require('socket.io');

const profileRouter = require('./routes/profile');
const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');
const sockets = require('./config/sockets');

const app = express();

const io = socket_io();
app.io = io;

mongoose.Promise = global.Promise;

const mongoURL = `mongodb://${process.env.dbUSER}:${process.env.dbPASS}@127.0.0.1:8717/${process.env.db}`;
console.log(mongoURL);

if(process.env.NODE_ENV == 'test'){
  mongoose.connect(`mongodb://${process.env.dbTestUSER}:${process.env.dbTestPASS}@danu7.it.nuigalway.ie:8717/${process.env.dbTest}`, {useNewUrlParser: true, useUnifiedTopology:true}); 
}
else{
  mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology:true, socketTimeoutMS: 45000, keepAlive: true, reconnectTries: 10});
//  mongoose.connect(`mongodb://${process.env.dbUSER}:${process.env.dbPASS}@127.0.0.1:27017/${process.env.db}`, {useNewUrlParser: true, useUnifiedTopology:true}); // Insert DB URL here, username and passwords are environment variables
}

mongoose.connection.on('error', (err) => {
  console.log('Mongoose Connection Error!', err);
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/dist/client')));
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');

app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/profiles/', profileRouter);

io.on('connection', sockets.connection);

module.exports = app;
