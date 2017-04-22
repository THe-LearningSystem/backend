'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
    Right = mongoose.model('Right');

/**
 * Roles
 */
exports.createRight = function (req, res) {
    var right = new Right(req.body);

    right.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: err
            });
        } else {
            res.json(right);
        }
    });
};
exports.getAllRights = function (req, res) {
    Right
        .find()
        .select('-__v')
        .exec(function (err, rights) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                res.json(rights);
            }
        });
};


/**
 * Roles
 */
exports.createRole = function (req, res) {
    var rights = req.body.rights;

    var role = new Role(req.body);
    role.rights = [];
    _.forEach(rights, function (right) {
        role.rights.push(right);
    });
    role.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: err
            });
        } else {
            res.json(role);
        }
    });
};

exports.getAllRoles = function (req, res) {
    //check here if there are params
    Role
        .find()
        .select('-__v')
        .populate('rights', '-__v')
        .exec(function (err, courses) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                res.json(courses);
            }
        });
};
exports.getRole = function (req, res) {
    //check here if there are params
    var id = req.param.roleId;
    Role
        .findOne({_id: id})
        .select('-__v')
        .exec(function (err, courses) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                res.json(courses);
            }
        });
};

exports.getSpareRole = function (req, res) {
    Role
        .findOne({_id: req.params.roleId})
        .select('name rights -_id')
        .populate('rights', 'name -_id')
        .exec(function (err, courses) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                res.json(courses);
            }
        });
};


