'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;

var validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var UserEnrolledCourseSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    passedLessons: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: "Lessons"
        },
        passed: {
            type: Boolean,
            required: true
        }
    }]
});

/**
 * User Schema
 */
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "Role"
    }],
    preferredLanguage: {
        type: String
    },
    enrolledCourses: [UserEnrolledCourseSchema]
});

//TODO: check if user is allowed to give that role
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            } else {
                bcrypt.hash(user.password, salt, function (err, hash) {
                    console.log(err, hash);

                    if (err) {
                        return next(err);
                    }
                    user.password = hash;
                    next();
                });
            }
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
