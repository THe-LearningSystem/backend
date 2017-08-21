'use strict';

/**
 * Module dependencies
 */
var auth = require('../controllers/users.authentication.controller');
var users = require('../controllers/users.controller');

module.exports = function (app, middleware) {
    app.route('/api/auth/signup')
        .post(auth.signup);
    app.route('/api/auth/signin')
        .post(auth.signin);

    app.route('/api/users/username/:username')
        .get(users.isUsernameUnique);
    app.route('/api/users/email/:email')
        .get(users.isEmailUnique);
    app.route('/api/users/')
        .get(middleware.acl(), users.getUsers);
    app.route('/api/users/:userId')
        .get(users.get)
        .put(users.update);

    app.route('/api/users/:userId/courses/:courseId')
        .get(users.getEnrolledCourses)
        .post(users.enrollToCourse);

    app.route('/api/users/:userId/courses/:courseId/lessons/:lessonId')
        .post(users.addPassedLesson);
        //not used anymore we dont remove passed lessons at the moment
        //.delete(users.removePassedLesson);
};