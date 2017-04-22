'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Course = mongoose.model('Course');


/**
 * Create a course
 */
exports.create = function (req, res) {
    var course = new Course(req.body);

    course.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: err
            });
        } else {
            res.json(course);
        }
    });
};


/**
 * Get all courses
 */
exports.getAll = function (req, res) {
    //check here if there are params
    Course
        .find()
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

/**
 * Get one course with a given urlName
 */
exports.getOne = function (req, res) {
    var id = req.params.courseId;
    Course
        .findOne({_id: id})
        .select('-__v')
        .exec(function (err, doc) {
            var response = {
                status: 200,
                message: doc
            };
            if (err) {
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                response.status = 404;
                response.message = {
                    "message": "course id not found " + id
                };
            }
            res.status(response.status)
                .json(response.message);
        });
};
