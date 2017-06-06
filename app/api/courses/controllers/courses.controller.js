'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Lesson = mongoose.model('Lesson');


/**
 * Create a course
 */
exports.create = function (req, res) {
    var course = new Course(req.body);
    course.author = req.user;
    course.save(function (err) {
        if (err) {
            return res.status(500).json({msg: err, err: err});
        } else {
            res.json({msg: "Created Course", obj: course});
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

var _prepareLessons = function (course) {
    var count = 1;
    _.forEach(course.sections, function (section) {
        _.forEach(section.lessons, function (lesson) {
            lesson["position"] = count;
            count++;
        });
    });

    return course;
};

var _getOneCourse = function (req, res, callback) {
    var id = req.params.courseId;
    var selectObj = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
        selectObj = {_id: id};
    } else {
        selectObj = {urlName: id};
    }
    Course
        .findOne(selectObj)
        .select('-__v')
        .populate(
            'questionsAndAnswers.user ' +
            'questionsAndAnswers.answers.user ' +
            'sections.lessons',
            '-__v -password ' +
            ' -preferredLanguage ' +
            '-data')
        .exec(function (err, course) {
            if (err) {
                res.status(500).send(err);
            } else if (!course) {
                res.status(404).send({msg: "course id not found " + id});
            } else {
                course = _prepareLessons(course);
                callback(course);
            }
        });
};

/**
 * Get one course with a given urlName
 */
exports.getOne = function (req, res) {
    _getOneCourse(req, res, function (course) {
        res.send(course);
    });
};

exports.update = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        req.body,
        {},
        function (err, course) {
            if (err) {
                res.send({msg: 'Couldnt update Course'});
            } else {
                res.send({msg: "Updated Course"});
            }
        }
    );
};


/**
 * Sections
 */
exports.createSection = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $push: {"sections": req.body}
        },
        {
            new: true
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Section updated", obj: course});
            }
        }
    )
};

exports.updateSection = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "sections._id": req.params.sectionId
        },
        {
            $set: {"sections.$": req.body}
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Section updated", obj: course});
            }
        }
    )

};
exports.deleteSection = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $pull: {
                "sections": {_id: req.params.sectionId}
            }
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Section updated", obj: course});
            }
        }
    );
};

/**
 *Tools
 */
exports.createTool = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $push: {"tools": req.body}
        },
        {
            new: true
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem tool", err: err});
            } else {
                res.send({msg: "Tool updated", obj: course});
            }
        }
    )
};
exports.updateTool = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "tools._id": req.params.toolId
        },
        {
            $set: {"tools.$": req.body}
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool updated", obj: course});
            }
        }
    )
};
exports.deleteTool = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $pull: {
                "tools": {_id: req.params.toolId}
            }
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool deleted", obj: course});
            }
        }
    );
};

/**
 *Notifications
 */
exports.createNotification = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $push: {"notifications": req.body}
        },
        {
            new: true
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem tool", err: err});
            } else {
                res.send({msg: "Notification created", obj: course});
            }
        }
    );
};
exports.updateNotification = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "notifications._id": req.params.notificationId
        },
        {
            $set: {"notifications.$": req.body}
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool updated", obj: course});
            }
        }
    )
};
exports.deleteNotification = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $pull: {
                "notifications": {_id: req.params.notificationId}
            }
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool deleted", obj: course});
            }
        }
    );
};

/**
 *QuestionsandAnsers
 */
exports.createQuestion = function (req, res) {
    var question = req.body;
    question.user = req.user._id;
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $push: {"questionsAndAnswers": req.body}
        },
        {
            new: true
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem tool", err: err});
            } else {
                res.send({msg: "Notification created", obj: course});
            }
        }
    );
};
exports.updateQuestion = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "questionsAndAnswers._id": req.params.questionAndAnsersId
        },
        {
            $set: {"questionsAndAnswers.$": req.body}
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool updated", obj: course});
            }
        }
    )
};
exports.deleteQuestion = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId
        },
        {
            $pull: {
                "questionsAndAnswers": {_id: req.params.questionAndAnsersId}
            }
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool deleted", obj: course});
            }
        }
    );
};

var _getOneQuestion = function (req, res, course, callback) {
    var id = mongoose.Types.ObjectId(req.params.questionAndAnswersId);
    if (_.find(course.questionsAndAnswers, {_id: id}) !== undefined) {
        var question = _.find(course.questionsAndAnswers, {_id: id});
        callback(question);
    } else {
        res.send({msg: "Coultnt find Question"});
    }
};


exports.createAnswer = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "questionsAndAnswers._id": req.params.questionAndAnswersId

        },
        {
            $push: {"questionsAndAnswers.$.answers": req.body}
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem tool", err: err});
            } else {
                res.send({msg: "Notification created", obj: course});
            }
        }
    );
};
exports.updateAnswer = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "questionsAndAnswers._id": req.params.questionAndAnswersId,
            "questionsAndAnswers._id.answers._id":req.params.answerId
        },
        {
            $set: {"questionsAndAnswers.$.answers.$": req.body}
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem tool", err: err});
            } else {
                res.send({msg: "Notification created", obj: course});
            }
        }
    );
};
exports.deleteAnswer = function (req, res) {
    Course.findOneAndUpdate(
        {
            "_id": req.params.courseId,
            "questionsAndAnswers._id": req.params.questionAndAnswersId
        },
        {
            $pull: {
                "questionsAndAnswers.$.answers.$": {_id: req.params.answerId}
            }
        },
        function (err, course) {
            if (err) {
                res.send({msg: "problem", err: err});
            } else {
                res.send({msg: "Tool deleted", obj: course});
            }
        }
    );
};