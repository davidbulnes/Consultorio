'use strict';

/**
 * Module dependencies
 */
var calendariosPolicy = require('../policies/calendarios.server.policy'),
  calendarios = require('../controllers/calendarios.server.controller');

module.exports = function(app) {
  // Calendarios Routes
  app.route('/api/calendarios').all(calendariosPolicy.isAllowed)
    .get(calendarios.list)
    .post(calendarios.create);

  app.route('/api/calendarios/:calendarioId').all(calendariosPolicy.isAllowed)
    .get(calendarios.read)
    .put(calendarios.update)
    .delete(calendarios.delete);

  // Finish by binding the Calendario middleware
  app.param('calendarioId', calendarios.calendarioByID);
};
