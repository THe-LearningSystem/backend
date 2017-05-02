'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash');


var _this = this;
/**
 * Signup
 */
exports.signup = function (req, res) {
    console.log(req.body);
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = new User(req.body);
        console.log(newUser);
        // save the user
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                return res.json(err);
            } else {
                res.json({success: true, msg: 'Successful created new user.'});
                console.log("created user");
            }
        });
    }
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
    User.findOne({
        username: req.body.username
    }, ['username', '_id', 'password'], function (err, user) {
        if (err) throw err;

        if (!user) {
            return res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                  var  tokenUser = {};
                  tokenUser.id = user._id;
                  tokenUser.username = user.username;

                    _this.getUserRights(user._id, function (rights) {
                        if(rights.length > 0){
                            tokenUser.rights = rights;
                        }
                        console.log("signed in",rights,tokenUser);
                        // if user is found and password is right create a token
                        var token = jwt.sign(tokenUser, config.jwt.secret, {expiresIn: config.jwt.expiration});
                        // return the information including token as JSON

                        res.json({success: true, token: 'JWT ' + token});
                    });

                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};

exports.getUserRights = function (userId, callback) {
    console.log(userId);
    User
        .findById(userId)
        .select('roles')
        .populate({
            path: 'roles',
            model: 'Role',
            populate: {
                path: 'rights',
                model: 'Right',
                select:'name'
            }
        })
        .exec(function (err, user) {
            var onlyRights = [];
            _.forEach(user.roles, function (role) {

                _.forEach(role.rights, function (right) {
                    //lodash union didn't work strange so i wrote it mysqlf
                    if (onlyRights.length === 0) {
                        onlyRights.push(right.name);
                    } else {
                        var found = false;
                        _.forEach(onlyRights, function (onlyRight) {
                            if (onlyRight === right.name) {
                                found = true;
                                return true;
                            }
                        });
                        if (!found)
                            onlyRights.push(right.name);
                    }
                })
            });
            callback(onlyRights);
        });
};

