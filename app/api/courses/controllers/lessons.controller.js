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
                return res.status(422).send({
                    msg: err
                });
            } else {
                res.send({msg: req.resMsgs.lessonCreated, obj: content});
            }
        });
    } else if (type === 'quiz') {
        var quiz = new LessonModel.QuizLesson(req.body);
        quiz.save(function (err) {
            if (err) {
                return res.status(422).send({
                    msg: err
                });
            } else {
                res.json({msg: req.resMsgs.lessonCreated, obj: quiz});
            }
        });
    } else if (type === 'automaton') {
        var automaton = new LessonModel.AutomatonLesson(req.body);
        automaton.save(function (err) {
            if (err) {
                return res.status(422).send({
                    msg: err
                });
            } else {
                res.json({msg: req.resMsgs.lessonCreated, obj: automaton});
            }
        });
    } else {
        res.status(500).send({msg: req.resMsgs.noLessonTypeGiven});
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
                        .json({mgs: req.resMsgs.didntUpdateLesson, err: err});
                } else {
                    res.json({msg: req.resMsgs.updatedLesson, obj: lesson});
                }
            });
    }
    if (req.body.kind === 'quiz') {
        LessonModel.QuizLesson.findOneAndUpdate(
            {
                "_id": req.params.lessonId
            },
            req.body,
            {},
            function (err, lesson) {
                if (err) {
                    res.status(500)
                        .json({mgs: req.resMsgs.didntUpdateLesson, err: err});
                } else {
                    res.json({msg: req.resMsgs.updatedLesson, obj: lesson});
                }
            });
    }
    if (req.body.kind === 'automaton') {
        LessonModel.AutomatonLesson.findOneAndUpdate(
            {
                "_id": req.params.lessonId
            },
            req.body,
            {},
            function (err, lesson) {
                if (err) {
                    res.status(500)
                        .json({mgs: req.resMsgs.didntUpdateLesson, err: err});
                } else {
                    res.json({msg: req.resMsgs.updatedLesson, obj: lesson});
                }
            });
    }
};
exports.delete = function (req, res) {
    Lesson.remove({_id: req.params.lessonId}, function (err) {
        if (err) {
            res.status(500)
                .json({mgs: req.resMsgs.didntDeleteLesson, err: err});
        } else {
            res.json({msg: req.resMsgs.deletedLesson});
        }
    });
};
exports.verify = function (req, res) {
    if (req.body.kind === 'content') {
    }
    if (req.body.kind === 'quiz') {
        Lesson
            .findById(req.params.lessonId)
            .select('-__v')
            .exec(function (err, lesson) {
                if(err){
                    res.status(500)
                        .send({mgs: null, err: err});
                }else{
                var passedLesson = lesson.data.rightAnswerIndex === parseInt(req.body.data.selectedAnswer);
                res.send({msg:null,passedLesson:passedLesson,rightAnswerIndex:lesson.data.rightAnswerIndex});
                }
            });
    }
};