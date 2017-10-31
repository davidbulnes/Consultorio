// Specialties service used to communicate Specialties REST endpoints
(function () {
  'use strict';

  angular
    .module('pacientes.services')
    .factory('PacientesService', PacientesService);

  PacientesService.$inject = ['$resource'];

  function PacientesService($resource) {
    return $resource('/api/pacientes/:pacienteId', {
      pacienteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
