'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    Course = mongoose.model('Course');


module.exports.isModerator = function () {
    return function (req, res, next) {
        var id = req.params.courseId;
        var selectObj = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            selectObj = {_id: id};
        } else {
            selectObj = {urlName: id};
        }
        Course
            .findOne(selectObj)
            .exec(function (err, course) {
                if (err) {
                    res.status(500).send(err);
                } else if (!course) {
                    res.status(404).send({msg: "course id not found " + id});
                } else {
                  if(req.user._id.equals(course.author)){
                      next();
                  }else{
                      res.status(403).send({msg: "No Access" + id});
                  }
                }
            });
    }
};