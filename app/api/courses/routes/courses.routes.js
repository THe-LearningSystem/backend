'use strict';

/**
 * Module dependencies
 */
var CoursesCtrl = require('../controllers/courses.controller');

module.exports = function (app, middleware) {
    app.route('/api/courses')
        .get(middleware.acl('courses.view'), CoursesCtrl.getAll)
        .put(CoursesCtrl.create);

    app.route('/api/courses/:courseId')
        .get(CoursesCtrl.getOne)
};