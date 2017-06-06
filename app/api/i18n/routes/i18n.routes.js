'use strict';

/**
 * Module dependencies
 */
var i18nCtrl = require('../controllers/i18n.controller');


module.exports = function (app, middleware) {

    app.route('/api/i18n')
        .get(i18nCtrl.getAll)
        .post(i18nCtrl.create);

    app.route('/api/i18n/config')
        .get(i18nCtrl.getConfig);

    app.route('/api/i18n/:translationModuleId/')
        .get(i18nCtrl.get)
        .put(i18nCtrl.updateModule)
        .delete(i18nCtrl.deleteModule);

    app.route('/api/i18n/:translationModuleId/groups')
        .get(i18nCtrl.getGroups)
        .post(i18nCtrl.createGroup);

    app.route('/api/i18n/:translationModuleId/groups/:translationGroupId')
        .post(i18nCtrl.createTranslation)
        .put(i18nCtrl.updateGroup)
        .delete(i18nCtrl.deleteGroup);

    app.route('/api/i18n/:translationModuleId/groups/:translationGroupId/translations/:translationId')
        .put(i18nCtrl.updateTranslation)
        .delete(i18nCtrl.deleteTranslation);
};