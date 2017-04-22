'use strict';


/**
 * Module dependencies
 */
var config = require('../config'),
    path = require('path'),
    _ = require('lodash'),
    merge = require('merge');

var middleware = {};
_.forEach(config.files.middleware, function (routePath) {
    middleware = merge(middleware, require(path.resolve(routePath)));
});

module.exports = middleware;
