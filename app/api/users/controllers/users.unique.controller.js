'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Signout
 */
exports.isUsernameUnique = function (req, res) {
    var username = req.params.username;
    User
        .findOne({username: username})
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: doc
            };
            if (err || !doc) {
                response.status = 404;
                res.status(response.status).json();
            } else {
                response.status = 200;
                res.status(response.status).json();
            }
        });
};


exports.isEmailUnique = function (req, res) {
    var email = req.params.email;
    User
        .findOne({email: email})
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: doc
            };
            if (err || !doc) {
                response.status = 404;
                res.status(response.status).json();
            } else {
                response.status = 200;
                res.status(response.status).json();
            }
        });
};