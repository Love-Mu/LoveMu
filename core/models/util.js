//IMPORTANT!!! This file contains username and password for db. It should not be pushed to GitHub

var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://mongodb5388ol:tu8fyw@danu7.it.nuigalway.ie:8717/mongodb5388');
exports.connection = connection;
