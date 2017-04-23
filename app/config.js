'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    path = require('path'),
    glob = require('glob');

/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    var output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            var files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (var i in excludes) {
                            if (excludes.hasOwnProperty(i)) {
                                file = file.replace(excludes[i], '');
                            }
                        }
                    } else {
                        file = file.replace(excludes, '');
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};

function initConfig() {
    return {
        jwt: {
            secret: 'nodeauthsecret',
            expiration: '24h'
        },
        server: {
            port: 3000,
            rootPath: __dirname
        },
        db: {
            uri: 'mongodb://localhost/the-lesys-dev',
            options: {
                user: '',
                pass: ''
            }
        },
        languageOptions: {
            languages: ['de', 'en'],
            default: 'de'
        },
        files: {
            middleware: getGlobbedPaths(path.join(__dirname, 'middleware/*.middleware.js')),
            config: getGlobbedPaths(path.join(__dirname, 'api/*/config/*.js')),
            models: getGlobbedPaths(path.join(__dirname, 'api/*/models/*.model.js')),
            routes: getGlobbedPaths(path.join(__dirname, 'api/*/routes/*.routes.js'))
        },
        // Expose configuration utilities
        utils: {
            getGlobbedPaths: getGlobbedPaths
        }
    };
}

module.exports = initConfig();