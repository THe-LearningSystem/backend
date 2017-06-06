'use strict';

/**
 * Module dependencies
 */
var RoleCtrl = require('../controllers/roles.controller');


module.exports = function (app, middleware) {
    app.route('/api/acl/roles')
        .get(RoleCtrl.getAll)
        .post(RoleCtrl.create);

    app.route('/api/acl/roles/:roleId')
        .get(RoleCtrl.getOne)
        .put(RoleCtrl.update)
        .delete(RoleCtrl.delete);

};