'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
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

var _getOneCourse = function(req,res,callback){
    var id = req.params.courseId;
    if(mongoose.Types.ObjectId.isValid(id)){
        Course
            .findOne({_id: id})
            .select('-__v')
            .exec(function (err, course) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else if (!course) {
                    res.status(404).send({msg: "course id not found " + id});
                } else {
                  callback(course);
                }
            });
    }else{
        Course
            .findOne({urlName: id})
            .select('-__v')
            .exec(function (err, course) {
                if (err) {
                    console.log(err);
                    res.status(500).send(err);
                } else if (!course) {
                    res.status(404).send({msg: "course id not found " + id});
                } else {
                    callback(course);
                }
            });
    }
};

/**
 * Get one course with a given urlName
 */
exports.getOne = function (req, res) {
    _getOneCourse(req,res,function(course){
        res.send(course);
    });
};

exports.update = function(req,res){
    _getOneCourse(req,res,function(course){
        course.name =req.body.name;
        course.description = req.body.description;
        course.sections = req.body.sections;
        course.save(function (err) {
            if (err) {
                res.send({msg:'Couldnt update Course'});
            } else {
                res.send({msg: "Updated Course"});
            }
        })
    });
};

var _addSection = function (req, res, course) {
    if (_.find(course.sections, {name: req.body.name}) === undefined) {
        course.sections.push(req.body);
        course.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send({msg: "Section Created"});
            }
        })
    } else {
        res.send({msg: "name '" + req.body.name + "' is not unique"});
    }
};



/**
 * Sections
 */
exports.createSection = function(req,res){
    _getOneCourse(req,res,function(course){
        _addSection(req,res,course);
    });
};