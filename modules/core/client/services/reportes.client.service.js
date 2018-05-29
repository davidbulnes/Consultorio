(function () {
    'use strict';
  
    angular
      .module('core')
      .factory('CoreService', CoreService);
  
      CoreService.$inject = ['$resource'];
  
    function CoreService($resource) {
      return $resource('/api/reports/barras/:cie10id/:yearcie10', {
        cie10id: '@_id',
        yearcie10 : '@yearcie10'
      },{
        get: {
          method: 'GET',
          isArray: true
        }
      });
    }

    angular
    .module('core')
    .factory('CoreLineService', CoreLineService);

    CoreLineService.$inject = ['$resource'];

    function CoreLineService($resource) {
      return $resource('/api/reports/line',{}
    );
  }

  angular
  .module('core')
  .factory('CoreMeetService', CoreMeetService);

  CoreMeetService.$inject = ['$resource'];

  function CoreMeetService($resource) {
    return $resource('/api/reports/meetday',{}
  );
}


  }());
  