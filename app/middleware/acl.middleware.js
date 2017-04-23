'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    password = require('passport'),
    passwordJwtStrategies = require('../passport'),
    User = require('../api/users/models/users.model'),
    Right = require('../api/acl/models/rights.model');

module.exports.acl = function (option) {
    return function (req, res, next) {
        password.authenticate('jwt', {session: false}, function (err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).end();
            }
            User
                .findById(user._id)
                .select('_id username roles')
                .populate({
                    path: 'roles',
                    model: 'Role',
                    select: '-__v -description',
                    populate: {
                        path: 'rights',
                        model: 'Right',
                        select: '-__v -description'

                    }
                })
                .exec(function (err, user) {
                    req.user = user;
                    var onlyRights = [];
                    _.forEach(req.user.roles, function (role) {
                        _.forEach(role.rights, function (right) {
                            //lodash union didn't work strange so i wrote it mysqlf
                            if (onlyRights.length === 0) {
                                onlyRights.push(right);
                            } else {
                                var found = false;
                                _.forEach(onlyRights, function (onlyRight) {
                                    if (onlyRight._id === right._id) {
                                        found = true;
                                        return true;
                                    }
                                });
                                if (!found)
                                    onlyRights.push(right);
                            }
                        })
                    });
                    req.onlyRights = onlyRights;
                    if (option !== undefined && _.findIndex(req.onlyRights, function (o) {
                            return o.name === option
                        }) !== -1) {
                        next();
                    } else {
                        return res.status(403).end();
                    }
                })
        })(req, res, next);
    }
};