'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    myJson = require('../api/i18n/config/jsonCreator'),
    mongoose = require('mongoose'),
    TranslationModule = mongoose.model('Translation');


module.exports.translations = function () {
    return function (req, res, next) {
        TranslationModule
            .find({name: 'backend'})
            .select('-__v')
            .exec(function (err, translationModules) {
                if (err) {
                    console.log("error,coulnt load backend translations");
                    next();
                } else {
                    var json = myJson.simplifiedJson(translationModules);
                    req.resMsgs = json.backend.responseMsg;
                    req.backendTranslations = json;
                    next();
                }
            })
    };
};