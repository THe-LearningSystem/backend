'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


exports.LessonsSchema = new Schema({
    name: {
        type: Schema.Types.Mixed,
        required: true
    },
    position: {
        type: Number
    },
    isPublished:{
        type:Boolean,
        required:true
    }
}, {discriminatorKey: 'kind'});
var Lesson = mongoose.model('Lesson', this.LessonsSchema);

exports.ContentLesson = Lesson.discriminator('content', new Schema({
    data: {
        content: {
            type: Schema.Types.Mixed,
            required: true
        }
    }
}));
exports.QuizLesson = Lesson.discriminator('quiz', new Schema({
    data: {
        question: {
            type: Schema.Types.Mixed,
            required: true
        },
        answers: [{
            type: Schema.Types.Mixed,
            required: true
        }],
        rightAnswerIndex: {
            type: Number
        }
    }
}));