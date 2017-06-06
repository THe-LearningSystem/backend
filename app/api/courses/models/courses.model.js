'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;


var SectionsSchema = new Schema({
    name: {
        type: Schema.Types.Mixed,
        required: true
    },
    description: {
        type: Schema.Types.Mixed,
        required: true
    },
    lessons: [{
        type: Schema.Types.ObjectId,
        ref: "Lesson"
    }],
    urlName: {
        type: String,
        required: true,
        unique: true
    },
    isPublished:{
        type:Boolean,
        required:true
    }
});

var ToolSchema = new Schema({
    name: {
        type: Schema.Types.Mixed,
        required: true
    },
    description: {
        type: Schema.Types.Mixed,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    extern: {
        type: Boolean
    }
});
var NotificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

var AnswerSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
});

var QuestionsAndAnswersSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answers: [AnswerSchema]
});

var ModeratorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

var CourseSchema = new Schema({
    name: {
        type: Schema.Types.Mixed,
        required: true
    },
    description: {
        type: Schema.Types.Mixed,
        required: true
    },
    urlName: {
        type: String,
        required: true,
        index: {
            unique: true,
            sparse: true
        }
    },
    primaryLanguage:{
        type:String
        // required:true
    },
    secondaryLanguages:[{type:String}],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    moderators: [ModeratorSchema],
    sections: [SectionsSchema],
    tools: [ToolSchema],
    notifications: [NotificationSchema],
    questionsAndAnswers: [QuestionsAndAnswersSchema]

});
CourseSchema.plugin(uniqueValidator);

mongoose.model('Course', CourseSchema);
