'use strict';

/**
 * Module dependencies
 */
var fotoshistoriaPolicy = require('../policies/fotoshistoria.server.policy'),
  fotoshistoria = require('../controllers/fotoshistoria.server.controller');

module.exports = function(app) {
  // Fotoshistoria Routes
  app.route('/api/fotoshistoria').all(fotoshistoriaPolicy.isAllowed)
    .get(fotoshistoria.list)
    .post(fotoshistoria.create);

  app.route('/api/fotoshistoria/:fotoshistoriumId').all(fotoshistoriaPolicy.isAllowed)
    .get(fotoshistoria.read)
    .put(fotoshistoria.update)
    .delete(fotoshistoria.delete);

  // Finish by binding the Fotoshistorium middleware
  app.param('fotoshistoriumId', fotoshistoria.fotoshistoriumByID);
};
