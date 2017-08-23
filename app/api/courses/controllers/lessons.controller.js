'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Lesson = mongoose.model('Lesson'),
    LessonModel = require('../models/lessons.model');

/**
 * Create a course
 */
exports.create = function (req, res) {
    var type = req.body.type;
    if (type === 'content') {
        var content = new LessonModel.ContentLesson(req.body);
        content.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(422).send({
                    msg: err
                });
            } else {
                res.send({msg: "Content created", obj: content});
            }
        });
    } else if (type === 'quiz') {
        var quiz = new LessonModel.QuizLesson(req.body);
        quiz.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(422).send({
                    msg: err
                });
            } else {
                res.json({msg: "Content created", obj: quiz});
            }
        });
    } else if (type === 'automaton') {
        var automaton = new LessonModel.AutomatonLesson(req.body);
        automaton.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(422).send({
                    msg: err
                });
            } else {
                res.json({msg: "Content created", obj: automaton});
            }
        });
    } else {
        res.status(500).send({msg: 'Error no correct type specified'});
    }
};


/**
 * Get all courses
 */
exports.getAll = function (req, res) {
    //check here if there are params
    Lesson
        .find()
        .select('-__v')
        .exec(function (err, lessons) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                // var test = Course.schema.methods.toJSONLocalizedOnly(courses, 'de');
                res.json(lessons);
            }
        });
};

exports.get = function (req, res) {
    Lesson
        .findById(req.params.lessonId)
        .select('-__v')
        .exec(function (err, lessons) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                res.json(lessons);
            }
        });
};

exports.update = function (req, res) {
    req.body.data.rightAnswerIndex = parseInt(req.body.data.rightAnswerIndex);
    if (req.body.kind === 'content') {
        LessonModel.ContentLesson.findOneAndUpdate(
            {
                "_id": req.params.lessonId
            },
            req.body,
            {},
            function (err, lesson) {
                if (err) {
                    res.status(500)
                        .json({mgs: "Didnt update Lesson", err: err});
                } else {
                    res.json({msg: "Updated Lesson", obj: lesson});
                }
            });
    }
    if (req.body.kind === 'quiz') {
        console.log(req.body.data);
        LessonModel.QuizLesson.findOneAndUpdate(
            {
                "_id": req.params.lessonId
            },
            req.body,
            {},
            function (err, lesson) {
                if (err) {
                    res.status(500)
                        .json({mgs: "Didnt update Lesson", err: err});
                } else {
                    res.json({msg: "Updated Lesson", obj: lesson});
                }
            });
    }
    if (req.body.kind === 'automaton') {
        console.log(req.body.data);
        LessonModel.AutomatonLesson.findOneAndUpdate(
            {
                "_id": req.params.lessonId
            },
            req.body,
            {},
            function (err, lesson) {
                if (err) {
                    res.status(500)
                        .json({mgs: "Didnt update Lesson", err: err});
                } else {
                    res.json({msg: "Updated Lesson", obj: lesson});
                }
            });
    }
};
exports.delete = function (req, res) {
    LessonModel.LessonsSchema.remove({_id: req.params.lessonId}, function (err) {
        if (err) {
            res.status(500)
                .json({mgs: "Didnt delete Lesson", err: err});
        } else {
            res.json({msg: "Deleted Lesson"});
        }
    });
};


exports.verify = function (req, res) {
    console.log(req.body.data.rightAnswerIndex);
    if (req.body.kind === 'content') {
    }
    if (req.body.kind === 'quiz') {
        Lesson
            .findById(req.params.lessonId)
            .select('-__v')
            .exec(function (err, lesson) {
                var passedLesson = lesson.data.rightAnswerIndex === parseInt(req.body.data.selectedAnswer);
                res.send({msg:"Passsed Lesson",passedLesson:passedLesson,rightAnswerIndex:lesson.data.rightAnswerIndex});
            });
    }
};