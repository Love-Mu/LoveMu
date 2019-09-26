const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const spotifyRouter = require('./routes/spotify');
const loginRouter = require('./routes/login');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/login', loginRouter);
app.use('/api/spotify', spotifyRouter);

module.exports = app;
