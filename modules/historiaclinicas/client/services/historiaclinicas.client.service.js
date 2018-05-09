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

  angular
    .module('historiaclinicas')
    .factory('Cie10presuntivoService', Cie10presuntivoService);

    Cie10presuntivoService.$inject = ['$resource'];

  function Cie10presuntivoService($resource) {
    return $resource('/api/cie10presuntivo', {});
  }

}());
