// Calendarios service used to communicate Calendarios REST endpoints
(function () {
  'use strict';

  angular
    .module('calendarios')
    .factory('CalendariosService', CalendariosService);

  CalendariosService.$inject = ['$resource'];

  function CalendariosService($resource) {
    return $resource('/api/calendarios/:calendarioId', {
      calendarioId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
