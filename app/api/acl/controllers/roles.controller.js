'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
    Right = mongoose.model('Right');


exports.create = function (req, res) {
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

exports.getAll = function (req, res) {
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

exports.getOne = function (req, res) {
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

exports.update = function (req, res) {
    Role
        .findOne({_id: req.params.roleId})
        .exec(function (err, role) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                if(req.body.rightId !== undefined){
                    var rightId = mongoose.Types.ObjectId(req.body.rightId);
                    var hasRight = role.rights.some(function (right) {
                        return right.equals(rightId);
                    });
                    if (!hasRight && req.body.state) {
                        role.rights.push(req.body.rightId);
                        role.save(function (err) {
                            if (err) {
                                res.send({msg: err});
                            } else {
                                res.send({msg: "Added Right to Role Successful"});

                            }
                        })
                    } else if (hasRight && !req.body.state) {
                        role.rights.pull(req.body.rightId);
                        role.save(function (err) {
                            if (err) {
                                res.send({msg: err});
                            } else {
                                res.send({msg: "Removed Right from Role Successful"});
                            }
                        })
                    }
                }else{
                    role.name = req.body.name;
                    role.description = req.body.description;
                    role.save(function () {
                        if (err) {
                            res.send({msg: err});
                        } else {
                            res.send({msg: "Updated Role successful."});
                        }
                    })
                }
            }
        });
};

exports.delete = function (req, res) {
    Role.remove({_id: req.params.roleId}, function (err) {
        if (err) {
            res.send({msg: err});
        } else {
            res.send({msg: "Removed Role successful."});
        }
    })
};

