'use strict';

/**
 * Module dependencies
 */
var citaPolicy = require('../policies/cita.server.policy'),
  cita = require('../controllers/cita.server.controller');

module.exports = function(app) {
  // Cita Routes
  app.route('/api/cita').all(citaPolicy.isAllowed)
    .get(cita.list)
    .post(cita.create);

  app.route('/api/cita/:citumId').all(citaPolicy.isAllowed)
    .get(cita.read)
    .put(cita.update)
    .delete(cita.delete);

  // Finish by binding the Citum middleware
  app.param('citumId', cita.citumByID);
};
