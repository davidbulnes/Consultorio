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

  angular
    .module('historiaclinicas')
    .factory('FotoshistoriaclinicaService', FotoshistoriaclinicaService);

    FotoshistoriaclinicaService.$inject = ['$resource'];

    function FotoshistoriaclinicaService($resource){
      return $resource('/api/fotohistoria/:fotohistoriaId',{
        fotoshistoriaId: '@_id'
      },{
        delete_photo: {
          method: 'DELETE',
          isArray: true
        }
      });
    }

    angular
    .module('historiaclinicas')
    .factory('FotobynumerohcService', FotobynumerohcService);

    FotobynumerohcService.$inject = ['$resource'];

    function FotobynumerohcService($resource){
      return $resource('/api/fotobynumerohc/:numeroHC',{
        numeroHC: '@nrohistoriaClinica'
      },{
        get: {
          method: 'GET',
          isArray: true
        }
      });
    }

}());
