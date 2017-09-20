'use strict';

/**
 * Module dependencies
 */
var CoursesCtrl = require('../controllers/courses.controller');

module.exports = function (app, middleware) {

    //Courses
    app.route('/api/courses')
        .get(middleware.acl('courses.view'), CoursesCtrl.getAll)
        .post(middleware.acl('courses.create'), CoursesCtrl.create);
    app.route('/api/courses/:courseId')
        .get(CoursesCtrl.getOne)
        .put(middleware.isModerator(), CoursesCtrl.update);

    app.route('/api/courses/:courseId/moderators')
        .get(CoursesCtrl.getModerators);

    //Sections
    app.route('/api/courses/:courseId/sections')
        .post(middleware.isModerator(), CoursesCtrl.createSection);
    app.route('/api/courses/:courseId/sections/:sectionId')
        .put(middleware.isModerator(), CoursesCtrl.updateSection)
        .delete(middleware.isModerator(), CoursesCtrl.deleteSection);
    //Tools
    app.route('/api/courses/:courseId/tools/')
        .post(middleware.isModerator(), CoursesCtrl.createTool);
    app.route('/api/courses/:courseId/tools/:toolId')
        .put(middleware.isModerator(), CoursesCtrl.updateTool)
        .delete(middleware.isModerator(), CoursesCtrl.deleteTool);

    //Notifications
    app.route('/api/courses/:courseId/notifications/')
        .post(middleware.isModerator(), CoursesCtrl.createNotification);
    app.route('/api/courses/:courseId/notifications/:notificationId')
        .put(middleware.isModerator(), CoursesCtrl.updateNotification)
        .delete(middleware.isModerator(), CoursesCtrl.deleteNotification);

    //questionAndAnswers
    app.route('/api/courses/:courseId/questions-and-answers/')
        .post(middleware.acl('courses.createQuestion'), CoursesCtrl.createQuestion);
    app.route('/api/courses/:courseId/questions-and-answers/:questionAndAnswersId')
        .put(CoursesCtrl.updateQuestion)
        .delete(CoursesCtrl.deleteQuestion);
    app.route('/api/courses/:courseId/questions-and-answers/:questionAndAnswersId/answers')
        .post(middleware.acl('courses.createQuestion'), CoursesCtrl.createAnswer);
    app.route('/api/courses/:courseId/questions-and-answers/:questionAndAnswersId/answers/:answerId')
        .put(CoursesCtrl.updateAnswer)
        .delete(CoursesCtrl.deleteAnswer);
};