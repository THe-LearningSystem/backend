'use strict';

/**
 * Module dependencies
 */
var config = require('../../../config'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    TranslationModule = mongoose.model('Translation'),
    myJson = require('../config/jsonCreator'),
    util = require('util');


/**
 * Create a course
 */
exports.create = function (req, res) {
    var translationModule = new TranslationModule(req.body);
    console.log("create", req.body);
    translationModule.save(function (err) {
        if (err) {
            return res.status(500).send({msg: "Couldnt create a Translationmodule"});
        } else {
            res.json(translationModule);
        }
    });
};

exports.updateModule = function (req, res) {
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, translationModule) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                translationModule.name = req.body.name;
                translationModule.description = req.body.description;
                translationModule.save(function (err, doc) {
                    if (err) {
                        res.status(500).send({msg: 'Didnt update Translation'});
                    } else {
                        res.send({msg: 'Updated Translation'});
                    }
                })

            }
        });
};

exports.deleteModule = function (req, res) {
    TranslationModule.remove({_id: req.params.translationModuleId}, function (err) {
        if (err) {
            res.status(500).send({msg: 'Didnt update Translation Module'});
        } else {
            res.send({msg: 'Deleted Translation Module'});
        }
    });
};

/**
 * Get all courses
 */
exports.getAll = function (req, res) {

    //check here if there are params
    TranslationModule
        .find()
        .select('-__v')
        .exec(function (err, translationModules) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                //TODO: get the client requested language
                var requestedClientLanguage = 'en';
                // var localizeOnly = TranslationModule.schema.methods.toJSONLocalizedOnly(translationModules, requestedClientLanguage);
                if (req.query.simplified) {
                    var json = myJson.simplifiedJson(translationModules);
                    res.json(json);
                } else {
                    res.json(translationModules);
                }
            }
        });
};

exports.get = function (req, res) {
    //check here if there are params
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, module) {
            if (err) {
                res.status(500)
                    .json(err);
            } else {
                //TODO: get the client requested language
                // var requestedClientLanguage = 'en';
                // var localizeOnly = TranslationModule.schema.methods.toJSONLocalizedOnly(translationModules, requestedClientLanguage);
                // var json = myJson.simplifiedJson(localizeOnly);
                res.json(module);
            }
        });
};

exports.getConfig = function (req, res) {
    if (!config.languageOptions) {
        res.status(500)
            .json(err);
    } else {
        res.json(config.languageOptions);
    }
};

exports.getGroups = function (req, res) {
    TranslationModule
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
    TranslationModule
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

exports.updateGroup = function (req, res) {
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, translationModule) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                var translationGroup = translationModule.groups.id(req.params.translationGroupId);
                if (!translationGroup) {
                    res.status(500).send({msg: 'Couldnt find group'});
                } else {
                    translationGroup.name = req.body.name;
                    translationGroup.description = req.body.description;
                    translationModule.save(function (err, doc) {
                        if (err) {
                            res.status(500).send({msg: 'Didnt update Translation'});
                        } else {
                            res.send({msg: 'Updated Translation'});
                        }
                    })
                }

            }
        });
};

exports.deleteGroup = function (req, res) {
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, translationModule) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                var group = translationModule.groups.id(req.params.translationGroupId);
                if (!group) {
                    res.status(500).send({msg: "Couldnt find group with that id"});
                } else {
                    translationModule.groups.remove(group);
                    translationModule.save(function (err, updatedSchema) {
                        if (err) {
                            res.status(500).json({msg: 'Didnt update Translation'});
                        } else {
                            console.log(updatedSchema);
                            res.json({msg: 'Updated Translation'});
                        }
                    })
                }
            }
        });
};


/**
 *Translations
 */


exports.createTranslation = function (req, res) {
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, translationModule) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                var group = translationModule.groups.id(req.params.translationGroupId);
                if (_.find(group.translations, {name: req.body.name}) === undefined) {
                    group.translations.push(req.body);
                    translationModule.save(function (err) {
                        if (err) {
                            res.status(500).send({msg: 'Didnt create Translation', err: err});
                        } else {
                            res.send({msg: 'Created Translation'});
                        }
                    })
                } else {
                    res.status(500).send({message: "name '" + req.body.name + "' is not unique"});
                }
            }
        });
};
exports.updateTranslation = function (req, res) {
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, translationModule) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                console.log(req.params.translationGroupId)
                var updateTranslation = translationModule.groups.id(req.params.translationGroupId).translations.id(req.body._id);
                if (!updateTranslation) {
                    res.status(500).send({msg: 'Couldnt find translation'});
                } else {
                    updateTranslation.name = req.body.name;
                    updateTranslation.values = {};
                    _.forEach(req.body.values, function (translationValue, key) {
                        if (translationValue !== "") {
                            updateTranslation.values[key] = translationValue;
                        }
                    });
                    translationModule.save(function (err, doc) {
                        if (err) {
                            res.status(500).send({msg: 'Didnt update Translation'});
                        } else {
                            res.send({msg: 'Updated Translation'});
                        }
                    })
                }

            }
        });
};


exports.deleteTranslation = function (req, res) {
    TranslationModule
        .findById(req.params.translationModuleId)
        .exec(function (err, translationModule) {
            if (err) {
                res.status(500).send({msg: err});
            } else {
                var group = translationModule.groups.id(req.params.translationGroupId);
                var translationId = group.translations.id(req.params.translationId);
                if (_.find(group.translations, {_id: translationId}) !== undefined) {
                    var translation = _.find(group.translations, {_id: translationId});
                    group.translations.remove(translation);
                    translationModule.save(function (err, updatedSchema) {
                        if (err) {
                            res.status(500).json({msg: 'Didnt update Translation'});
                        } else {
                            console.log(updatedSchema);
                            res.json({msg: 'Updated Translation'});
                        }
                    })
                } else {
                    res.status(500).send({msg: "Couldnt find transition with that id"});
                }
            }
        });
};
