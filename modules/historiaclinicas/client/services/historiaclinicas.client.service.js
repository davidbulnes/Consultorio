// Historiaclinicas service used to communicate Historiaclinicas REST endpoints
(function () {
  'use strict';

  angular
    .module('historiaclinicas')
    .factory('HistoriaclinicasService', HistoriaclinicasService);

  HistoriaclinicasService.$inject = ['$resource'];

  function HistoriaclinicasService($resource) {
    return $resource('/api/historiaclinicas/:historiaclinicaId', {
      historiaclinicaId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
