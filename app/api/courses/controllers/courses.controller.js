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
    console.log("create", req.body);
    course.save(function (err) {
        if (err) {
            console.log(err);
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
                console.log(Course.schema.methods);
                // var test = Course.schema.methods.toJSONLocalizedOnly(courses, 'de');
                res.json(courses);
            }
        });
};

/**
 * Get one course with a given urlName
 */
exports.getOne = function (req, res) {
    var id = req.params.courseId;
    if(mongoose.Types.ObjectId.isValid(id)){
        Course
            .findOne({_id: id})
            .select('-__v')
            .exec(function (err, doc) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else if (!doc) {
                    res.status(404).send({msg: "course id not found " + id});
                } else {
                    res.send(doc);
                }
            });
    }else{
        Course
            .findOne({urlName: id})
            .select('-__v')
            .exec(function (err, doc) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else if (!doc) {
                    res.status(404).send({msg: "course id not found " + id});
                } else {
                    res.send(doc);
                }
            });
    }

};
