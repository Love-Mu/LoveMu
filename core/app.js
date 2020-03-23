const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const socket_io = require('socket.io');
const compression = require('compression');

const profileRouter = require('./routes/profile');
const spotifyRouter = require('./routes/spotify');
const authRouter = require('./routes/authentication');
const messageRouter = require('./routes/message');
const sockets = require('./config/sockets');

const app = express();

const io = socket_io();
app.io = io;

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
app.use(express.static(path.join(__dirname, '/dist/client')));
app.use(passport.initialize());

require('./config/passport');

app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);
app.use('/profiles', profileRouter);
app.use('/messages', messageRouter);
/*io.engine.generateId = (req) => {
  return "custom:id:" + req.user._id;
}*/
/*io.engine.generateId = function (req) {
  return req.user._id;
}*/
var people={};
app.io.on('connection', (socket) => {
  people[socket.handshake.query.id]=socket.id;
  
  console.log('A User Connected with ID: ' + socket.handshake.query.id);

  socket.on('disconnect', () => {
      console.log('A User Disconnected');
  });

  socket.on('dm', function(data) {
    io.to(people[data.recipient]).emit('message', data);
  });
});

module.exports = app;
