'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

var TranslationSchema = new Schema({
    //the GroupName
    name: {
        type: String,
        required: true
    },
    values: {
        type: Schema.Types.Mixed
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
    translations: [TranslationSchema]

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
TranslationModuleSchema.plugin(uniqueValidator);

mongoose.model('Translation', TranslationModuleSchema);
