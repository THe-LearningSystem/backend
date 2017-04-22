'use strict';

/**
 * Module dependencies.
 */
var config = require('./config'),
    _ = require('lodash'),
    path = require('path'),
    mongoose = require('mongoose');


module.exports.connect = function () {
    _.forEach(config.files.models, function (modelPath) {
        require(path.resolve(modelPath));
    });

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db.uri, config.db.options, function (err) {
        if (err) {
            console.error('Could not connect to MongoDB!', err);
        } else {
            mongoose.set('debug', true);
        }
    });
};


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + config.db.uri);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


