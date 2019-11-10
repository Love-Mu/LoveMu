const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');

//Routes
const spotifyRouter = require('./routes/spotify');
const loginRouter = require('./routes/login');



mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


app.use('/api/login', loginRouter);
app.use('/api/spotify', spotifyRouter);

if(!isProduction) {
    app.use(errorHandler());
}
  
//Configure Mongoose
const mongoURL = `mongoDB://${process.env.dbUSER}:${process.env.dbPASS}@`; // Complete db URL (...)

mongoose.connect(mongoURL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));
mongoose.set('debug', true);

//Models
require('./models/Users');

//Config
require('./config/passport');
app.use(require('./routes'));

if(!isProduction) {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
});

app.listen(8000, () => console.log('You got it to work!!!'));

module.exports = app;
