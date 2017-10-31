(function () {
  'use strict';

  angular
    .module('calendarios')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('calendarios', {
        abstract: true,
        url: '/calendarios',
        template: '<ui-view/>'
      })
      .state('calendarios.list', {
        url: '',
        templateUrl: 'modules/calendarios/client/views/list-calendarios.client.view.html',
        controller: 'KitchenSinkCtrl',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Calendarios List'
        }
      })
      .state('calendarios.create', {
        url: '/create',
        templateUrl: 'modules/calendarios/client/views/form-calendario.client.view.html',
        controller: 'CalendariosController',
        controllerAs: 'vm',
        resolve: {
          calendarioResolve: newCalendario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Calendarios Create'
        }
      })
      .state('calendarios.edit', {
        url: '/:calendarioId/edit',
        templateUrl: 'modules/calendarios/client/views/form-calendario.client.view.html',
        controller: 'CalendariosController',
        controllerAs: 'vm',
        resolve: {
          calendarioResolve: getCalendario
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Calendario {{ calendarioResolve.name }}'
        }
      })
      .state('calendarios.view', {
        url: '/:calendarioId',
        templateUrl: 'modules/calendarios/client/views/view-calendario.client.view.html',
        controller: 'CalendariosController',
        controllerAs: 'vm',
        resolve: {
          calendarioResolve: getCalendario
        },
        data: {
          pageTitle: 'Calendario {{ calendarioResolve.name }}'
        }
      });
  }

  getCalendario.$inject = ['$stateParams', 'CalendariosService'];

  function getCalendario($stateParams, CalendariosService) {
    return CalendariosService.get({
      calendarioId: $stateParams.calendarioId
    }).$promise;
  }

  newCalendario.$inject = ['CalendariosService'];

  function newCalendario(CalendariosService) {
    return new CalendariosService();
  }
}());
