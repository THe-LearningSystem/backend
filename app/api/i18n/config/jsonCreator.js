'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');


exports.simplifiedJson = function (badJson) {
    var myJSON = {};
    if (badJson.length === undefined) {
        _.forEach(badJson.groups, function (group) {
            myJSON[group.name] = {};
            _.forEach(group.translation, function (translation) {
                myJSON[group.name][translation.name] = translation.values;
            });
        });
    } else {
        _.forEach(badJson, function (module) {
            myJSON[module.name] = {};
            _.forEach(module.groups, function (group) {
                myJSON[module.name][group.name] = {};
                _.forEach(group.translation, function (translation) {
                    myJSON[module.name][group.name][translation.name] = translation.values;
                });
            })
        });

    }
    return myJSON;
};