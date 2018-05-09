// Fotoshistoria service used to communicate Fotoshistoria REST endpoints
(function () {
  'use strict';

  angular
    .module('fotoshistoria')
    .factory('FotoshistoriaService', FotoshistoriaService);

  FotoshistoriaService.$inject = ['$resource'];

  function FotoshistoriaService($resource) {
    return $resource('api/fotoshistoria/:fotoshistoriumId', {
      fotoshistoriumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
