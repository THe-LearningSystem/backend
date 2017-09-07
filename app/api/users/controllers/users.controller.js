'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');


exports.getUsers = function (req, res) {
    User
        .find()
        .select('-password -__v -preferredLanguage -enrolledCourses -roles')
        .populate('roles', '-rights -description -__v ')
        .exec(function (err, users) {
            if (err) {
                return res.status(422).send(err);
            } else {
                res.json(users);
            }
        });
};

exports.getUsersShort = function (req, res) {
    User
        .find()
        .select('_id username')
        .exec(function (err, users) {
            if (err) {
                return res.status(422).send(err);
            } else {
                res.json(users);
            }
        });
};


exports.get = function (req, res) {
    console.log(req.user);
    User
        .findById(req.params.userId)
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


exports.update = function (req, res) {
    User.update({_id: req.params.userId}, req.body, function (err, user) {
        if (err) {
            res.send({msg: "couldnt update user", err: err});
        } else {
            res.send({msg: "Updated User successful."});
        }
    })
};


exports.delete = function (req, res) {
    // User.remove({_id: req.params.userId}, function (err) {
    //     if (err) {
    //         res.send({msg: err});
    //     } else {
    //         res.send({msg: "Removed User successful."});
    //     }
    // })
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

/**
 * Lesson
 */
exports.getEnrolledCourses = function (req, res) {
    User
        .findById(req.params.userId)
        .exec(function (err, user) {
            if (err) {
                res.status(500).json({msg: "Cant add Lesson to User", err: err});
            } else {
                var enrolledCourse = null;
                var id = mongoose.Types.ObjectId(req.params.courseId);
                if (_.find(user.enrolledCourses, {_id: id}) !== undefined) {
                    enrolledCourse = _.find(user.enrolledCourses, {_id: id});
                    res.json(enrolledCourse);
                } else {
                    res.json(null);
                }
            }
        });
};

exports.enrollToCourse = function (req, res) {
    User
        .findById(req.params.userId)
        .exec(function (err, user) {
            if (err) {
                res.status(500).json({msg: "Cant enroll Course", err: err});
            } else {
                var id = mongoose.Types.ObjectId(req.params.courseId);
                if (_.find(user.enrolledCourses, {_id: id}) === undefined) {
                    user.enrolledCourses.push({_id: id, lessonData: []});
                    user.save(function () {
                        if (err) {
                            res.status(500).json({msg: "Not successfull enrolled", err: err});
                        } else {
                            res.json({msg: "Sucessfull enrolled"});
                        }
                    });
                } else {
                    res.status(500).json({msg: "Cant enroll Course, Already Enrolled", err: err});
                }
            }
        });
};

exports.addPassedLesson = function (req, res) {
    User
        .findById(req.params.userId)
        .exec(function (err, user) {
            if (err) {
                res.status(500).json({msg: "Cant add Lesson to User", err: err});
            } else {
                var enrolledCourse = null;
                var id = mongoose.Types.ObjectId(req.params.courseId);
                if (_.find(user.enrolledCourses, {_id: id}) !== undefined) {
                    enrolledCourse = _.find(user.enrolledCourses, {_id: id});
                    var lessonId = mongoose.Types.ObjectId(req.params.lessonId);
                    var foundLesson = false;
                    var foundLessonIndex = null;
                    _.forEach(enrolledCourse.lessonData, function (lesson, index) {
                        if (lesson._id == req.params.lessonId) {
                            foundLesson = true;
                            foundLessonIndex = index;
                        }
                    });
                    if (foundLesson) {
                        enrolledCourse.lessonData[foundLessonIndex].passed = req.body.passed;
                        console.log("test");
                    } else {
                        enrolledCourse.lessonData.push(req.body);
                    }
                    user.save(function () {
                        if (err) {
                            res.status(500).json({msg: "Error updating user passed lessons", err: err});
                        } else {
                            res.json({msg: "Sucessfull updated pass"});
                        }
                    });
                } else {
                    res.status(500).json({msg: "Not enrolled to course", err: err});
                }
            }
        });
};

//not used anymore. This method isnt updated
exports.removePassedLesson = function (req, res) {
    User
        .findById(req.params.userId)
        .exec(function (err, user) {
            if (err) {
                res.status(500).json({msg: "Cant add Lesson to User", err: err});
            } else {
                var enrolledCourse = null;
                var id = mongoose.Types.ObjectId(req.params.courseId);
                if (_.find(user.enrolledCourses, {courseId: id}) !== undefined) {
                    enrolledCourse = _.find(user.enrolledCourses, {courseId: id});
                    var lessonId = mongoose.Types.ObjectId(req.params.lessonId);
                    var foundLesson = false;
                    _.forEach(enrolledCourse.lessonData, function (lesson) {
                        if (lesson == req.params.lessonId) {
                            foundLesson = true;
                        }
                    });
                    if (foundLesson) {
                        enrolledCourse.lessonData.pull(lessonId);
                        user.save(function () {
                            if (err) {
                                res.status(500).json({msg: "Couldnt remove passed Lesson to user", err: err});
                            } else {
                                res.json({msg: "Sucessfull removed pass"});
                            }
                        });
                    } else {
                        res.status(500).json({msg: "Didnt pass"});
                    }
                } else {
                    res.status(500).json({msg: "Not enrolled to course", err: err});
                }
            }
        });
};

