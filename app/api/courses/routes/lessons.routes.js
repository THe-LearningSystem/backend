'use strict';

/**
 * Module dependencies
 */
var LessonsCtrl = require('../controllers/lessons.controller');

module.exports = function (app, middleware) {
    app.route('/api/lessons')
        .get( LessonsCtrl.getAll)
        .post(LessonsCtrl.create);

    app.route('/api/lessons/:lessonId')
        .get( LessonsCtrl.get)
        .put(LessonsCtrl.update)
        .delete(LessonsCtrl.delete);

    app.route('/api/lessons/:lessonId/verify')
        .post( LessonsCtrl.verify);
};