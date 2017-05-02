'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Right = mongoose.model('Right');

exports.create = function (req, res) {
    var right = new Right(req.body);
console.log(right);
    right.save(function (err) {
        if (err) {
            res.send({msg: err});
        } else {
            res.json({msg: "Created Right successful."});
        }
    });
};

exports.getAll = function (req, res) {
    Right
        .find()
        .select('-__v')
        .exec(function (err, rights) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                res.json(rights);
            }
        });
};

exports.update = function (req, res) {
    Right
        .findOne({_id: req.params.rightId})
        .exec(function (err, right) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                right.name = req.body.name;
                right.description = req.body.description;
                right.save(function () {
                    if (err) {
                        res.send({msg: err});
                    } else {
                        res.send({msg: "Updated Role successful."});
                    }
                })
            }
        });
};

exports.delete = function (req, res) {
    Right.remove({_id: req.params.rightId}, function (err) {
        if (err) {
            res.send({msg: err});
        } else {
            res.send({msg: "Removed Right successful."});
        }
    })
};
