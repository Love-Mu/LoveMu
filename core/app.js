const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const spotifyRouter = require('./routes/spotify');
const loginRouter = require('./routes/login');

const mongoURL = `mongodb://${process.env.dbUser}:${process.env.dbPass}@danu7.it.nuigalway.ie:8717/${process.env.DB}`; // Complete db URL (...)

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));
mongoose.set('debug', true);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', loginRouter);
app.use('/spotify', spotifyRouter);

module.exports = app;
