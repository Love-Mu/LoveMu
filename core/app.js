const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const io = require('socket.io');
const compression = require('compression');
const profileRouter = require('./routes/profile');
const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');
const messageRouter = require('./routes/message');
const uploadRouter = require('./routes/upload');
const sockets = require('./config/sockets');
const people = [];

const app = express();
app.io = io();

sockets(app.io, people);

mongoose.Promise = global.Promise;

if(process.env.NODE_ENV == 'test'){
  const mongoTest = `mongodb://${process.env.dbTestUSER}:${process.env.dbTestPASS}@127.0.0.1:8717/${process.env.dbTest}` ;
  mongoose.connect(mongoTest, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
}
else{
  const mongoURL = `mongodb://${process.env.dbUSER}:${process.env.dbPASS}@127.0.0.1:8717/${process.env.db}`;
  mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
}

mongoose.connection.on('error', (err) => {
  console.log('Mongoose Connection Error!', err);
});

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, '/public')));
app.use(passport.initialize());

require('./config/passport');

app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/profiles', profileRouter);
app.use('/messages', messageRouter);
app.use('/upload', uploadRouter);

module.exports = app;
