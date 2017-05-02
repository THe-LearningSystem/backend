'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

var LessonsSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});
var SectionsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    lessons:[LessonsSchema]

});
var CourseSchema = new Schema({
    name: {
        type: Schema.Types.Mixed,
        required:true
    },
    description: {
        type: Schema.Types.Mixed,
        required:true
    },
    urlName: {
        type: String,
        required: true,
        index: {
            unique: true,
            sparse: true
        }
    },
    // author:{
    //     type:string
    // },
    // moderators:[{
    //     type:string
    // }],
    // tools:,
    // notifications:,
    // questionAndAnswers:,
    sections: [SectionsSchema]

});
CourseSchema.plugin(uniqueValidator);

mongoose.model('Course', CourseSchema);
