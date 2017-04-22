'use strict';

/**
 * Module dependencies
 */
var auth = require('../controllers/users.authentication.controller');
var users = require('../controllers/users.unique.controller');

module.exports = function (app, middleware) {
    app.route('/api/auth/signup')
        .post(auth.signup);
    app.route('/api/auth/signin')
        .post(auth.signin);

    app.route('/api/users/username/:username')
        .get(users.isUsernameUnique);
    app.route('/api/users/email/:email')
        .get(users.isEmailUnique);

};