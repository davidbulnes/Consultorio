(function () {
  'use strict';

  angular
    .module('cita')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cita', {
        abstract: true,
        url: '/cita',
        template: '<ui-view/>'
      })
      .state('cita.list', {
        url: '',
        templateUrl: 'modules/cita/client/views/list-cita.client.view.html',
        controller: 'CitaListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cita List'
        }
      })
      .state('cita.create', {
        url: '/create',
        templateUrl: 'modules/cita/client/views/form-citum.client.view.html',
        controller: 'CitaController',
        controllerAs: 'vm',
        resolve: {
          citumResolve: newCitum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Cita Create'
        }
      })
      .state('cita.edit', {
        url: '/:citumId/edit',
        templateUrl: 'modules/cita/client/views/form-citum.client.view.html',
        controller: 'CitaController',
        controllerAs: 'vm',
        resolve: {
          citumResolve: getCitum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Citum {{ citumResolve.name }}'
        }
      })
      .state('cita.view', {
        url: '/:citumId',
        templateUrl: 'modules/cita/client/views/view-citum.client.view.html',
        controller: 'CitaController',
        controllerAs: 'vm',
        resolve: {
          citumResolve: getCitum
        },
        data: {
          pageTitle: 'Citum {{ citumResolve.name }}'
        }
      });
  }

  getCitum.$inject = ['$stateParams', 'CitaService'];

  function getCitum($stateParams, CitaService) {
    return CitaService.get({
      citumId: $stateParams.citumId
    }).$promise;
  }

  newCitum.$inject = ['CitaService'];

  function newCitum(CitaService) {
    return new CitaService();
  }
}());
