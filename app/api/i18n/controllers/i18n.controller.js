'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
    mongoose = require('mongoose'),
    TranslationSchema = mongoose.model('Translation'),
    myJson = require('../config/jsonCreator');


/**
 * Create a course
 */
exports.create = function (req, res) {
    var translationModule = new TranslationSchema(req.body);
    console.log("create", req.body);
    translationModule.save(function (err) {
        if (err) {
            return res.status(422).send({
                message: err
            });
        } else {
            res.json(translationModule);
        }
    });
};


/**
 * Get all courses
 */
exports.getAll = function (req, res) {

    //check here if there are params
    TranslationSchema
        .find()
        .select('-__v')
        .exec(function (err, translationModules) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                //TODO: get the client requested language
                var requestedClientLanguage = 'en';
                var localizeOnly = TranslationSchema.schema.methods.toJSONLocalizedOnly(translationModules, requestedClientLanguage);
                if(req.query.simplified){
                    var json = myJson.simplifiedJson(localizeOnly);
                    res.json(json);
                }else{
                    res.json(localizeOnly);
                }
            }
        });
};

exports.getOneSimplified = function (req, res) {
    //check here if there are params
    TranslationSchema
        .findById(req.params.translationModuleId)
        .select('-__v -_id -groups._id -groups.translation._id')
        .exec(function (err, translationModules) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                //TODO: get the client requested language
                var requestedClientLanguage = 'en';
                var localizeOnly = TranslationSchema.schema.methods.toJSONLocalizedOnly(translationModules, requestedClientLanguage);
                var json = myJson.simplifiedJson(localizeOnly);
                res.json(json);
            }
        });
};

exports.getGroups = function (req, res) {
    TranslationSchema
        .findById(req.params.translationModuleId)
        .select('groups')
        .exec(function (err, translationModule) {
            if (err) {
                res.send(err);
            } else {
                res.send(translationModule);
            }
        });
};
var _addGroup = function (req, res, translationModule) {
    if (_.find(translationModule.groups, {name: req.body.name}) === undefined) {
        translationModule.groups.push(req.body);
        translationModule.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json(translationModule);
            }
        })
    } else {
        res.send({message: "name '" + req.body.name + "' is not unique"});
    }
};

exports.createGroup = function (req, res) {
    TranslationSchema
        .findById(req.params.translationModuleId)
        .select('-__v')
        .exec(function (err, translationModule) {
            if (err) {
                res.send(err);
            } else {
                _addGroup(req, res, translationModule);
            }
        });
};

/**
 *Translations
 */


exports.createTranslation = function (req, res) {
    TranslationSchema
        .findById(req.params.translationModuleId)
        .select('-__v')
        .exec(function (err, translationModule) {
            if (err) {
                res.send(err);
            } else {
                var group = translationModule.groups.id(req.params.translationGroupId);
                if (_.find(group.translation, {name: req.body.name}) === undefined) {
                    group.translation.push(req.body);
                    translationModule.save(function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json(translationModule);
                        }
                    })
                } else {
                    res.send({message: "name '" + req.body.name + "' is not unique"});
                }
            }
        });
};