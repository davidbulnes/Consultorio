'use strict';

/**
 * Module dependencies
 */
var pacientesPolicy = require('../policies/pacientes.server.policy'),
  pacientes = require('../controllers/pacientes.server.controller');

module.exports = function(app) {
  // Pacientes Routes
  app.route('/api/pacientes').all(pacientesPolicy.isAllowed)
    .get(pacientes.list)
    .post(pacientes.create);

  app.route('/api/pacientes/:pacienteId').all(pacientesPolicy.isAllowed)
    .get(pacientes.read)
    .put(pacientes.update)
    .delete(pacientes.delete);

  // Finish by binding the Paciente middleware
  app.param('pacienteId', pacientes.pacienteByID);
};
