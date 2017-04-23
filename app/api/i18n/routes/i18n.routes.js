'use strict';

/**
 * Module dependencies
 */
var i18nCtrl = require('../controllers/i18n.controller');


module.exports = function (app, middleware) {

    app.route('/api/translations')
        .get(i18nCtrl.getAll)
        .put(i18nCtrl.create);
    app.route('/api/translations/:translationModuleId/')
        .get(i18nCtrl.getOneSimplified);

    app.route('/api/translations/:translationModuleId/groups')
        .get(i18nCtrl.getGroups)
        .put(i18nCtrl.createGroup);

    app.route('/api/translations/:translationModuleId/groups/:translationGroupId')
        .put(i18nCtrl.createTranslation);
};