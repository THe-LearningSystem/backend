'use strict';

/**
 * Module dependencies
 */
var RightCtrl = require('../controllers/rights.controller');


module.exports = function (app, middleware) {
    app.route('/api/acl/rights')
        .get(RightCtrl.getAll)
        .post(RightCtrl.create);

    app.route('/api/acl/rights/:rightId')
        .put(RightCtrl.update)
        .delete(RightCtrl.delete)
};