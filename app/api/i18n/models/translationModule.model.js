'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    mongoose = require('mongoose'),
    mongooseI18n = require('mongoose-i18n-localize'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

var TranslationSchema = new Schema({
    //the GroupName
    name: {
        type: String,
        required: true
    },
    values: {
        type: String,
        required: true,
        i18n: true
    }

});


var TranslationGroupSchema = new Schema({
    //the GroupName
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    translation:[TranslationSchema]

});


var TranslationModuleSchema = new Schema({
    //the translation Modul name
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    groups: [TranslationGroupSchema]

});


TranslationSchema.plugin(mongooseI18n, {
    locales: config.languageOptions.languages, defaultLocale: config.languageOptions.default
});
TranslationGroupSchema.plugin(uniqueValidator);
TranslationModuleSchema.plugin(uniqueValidator);

mongoose.model('Translation', TranslationModuleSchema);
