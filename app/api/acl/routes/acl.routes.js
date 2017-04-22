'use strict';

/**
 * Module dependencies
 */
var ACLCtrl = require('../controllers/acl.controller');


module.exports = function (app, middleware) {
    app.route('/api/acl/roles')
        .get(ACLCtrl.getAllRoles)
        .put(ACLCtrl.createRole);

    app.route('/api/acl/rights')
        .get( ACLCtrl.getAllRights)
        .put(ACLCtrl.createRight);

    app.route('/api/acl/roles/:roleId')
        .get(ACLCtrl.getSpareRole);
};