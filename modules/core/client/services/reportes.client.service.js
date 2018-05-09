(function () {
    'use strict';
  
    angular
      .module('core')
      .factory('CoreService', CoreService);
  
      CoreService.$inject = ['$resource'];
  
    function CoreService($resource) {
      return $resource('/api/reports/barras/:cie10id', {
        cie10id: '@_id'
      },{
        get: {
          method: 'GET',
          isArray: true
        }
      });
    }

  }());
  