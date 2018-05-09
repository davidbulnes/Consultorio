'use strict';

/**
 * Module dependencies
 */
var historiaclinicasPolicy = require('../policies/historiaclinicas.server.policy'),
  historiaclinicas = require('../controllers/historiaclinicas.server.controller');

module.exports = function(app) {
  // Historiaclinicas Routes
  app.route('/api/historiaclinicas/picture').all(historiaclinicasPolicy.isAllowed)
    .post(historiaclinicas.savePicture);
  app.route('/api/historiaclinicas').all(historiaclinicasPolicy.isAllowed)
    .get(historiaclinicas.list)
    .post(historiaclinicas.create);

  app.route('/api/historiaclinicas/:historiaclinicaId').all(historiaclinicasPolicy.isAllowed)
    .get(historiaclinicas.read)
    .put(historiaclinicas.update)
    .delete(historiaclinicas.delete);
  
  app.route('/api/cie10presuntivo').all(historiaclinicasPolicy.isAllowed)
    .get(historiaclinicas.listCie10Presuntivo);

  // Finish by binding the Historiaclinica middleware


  app.param('historiaclinicaId', historiaclinicas.historiaclinicaByID);
  //app.param('historiaclinicaId', historiaclinicas.terapeuticaPodoByID);
  
};
