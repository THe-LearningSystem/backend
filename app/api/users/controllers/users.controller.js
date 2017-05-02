'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');


exports.getUsers = function (req, res) {
    User
        .find()
        .select('-password -__v')
        .populate('roles', '-rights -description -__v')
        .exec(function (err, users) {
            if (err) {
                return res.status(422).send(err);
            } else {
                res.json(users);
            }
        });
};


/**
 * Unique
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


exports.update = function (req, res) {
    console.log("here", req.body, req.params);
    User
        .findOne({_id: req.params.userId})
        .exec(function (err, user) {
            if (err) {
                console.log("test");
                res.status(500)
                    .json(err);
            } else {
                user.roles = req.body.roles;
                user.save(function () {
                    if (err) {
                        res.send({msg: err});
                    } else {
                        res.send({msg: "Updated User successful."});
                    }
                })
            }
        });
};