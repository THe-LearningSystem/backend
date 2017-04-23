'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    mongoose = require('mongoose'),
    mongooseI18n = require('mongoose-i18n-localize'),
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
        type: String,
        required: true,
        i18n: true,
        unique: true
    },
    test: {
        type: String,
        i18n: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    urlName: {
        type: String,
        required: true,
        index: {
            unique: true,
            sparse: true
        }
    },
    sections: [SectionsSchema]

});
CourseSchema.plugin(mongooseI18n, {
    locales: config.languageOptions.languages, defaultLocale: config.languageOptions.default
});
CourseSchema.plugin(uniqueValidator);

mongoose.model('Course', CourseSchema);
