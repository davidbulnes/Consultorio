(function () {
  'use strict';

  angular
    .module('historiaclinicas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('historiaclinicas', {
        abstract: true,
        url: '/historiaclinicas',
        template: '<ui-view/>'
      })
      .state('historiaclinicas.list', {
        url: '',
        templateUrl: '/modules/historiaclinicas/client/views/list-historiaclinicas.client.view.html',
        controller: 'HistoriaclinicasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Historiaclinicas List'
        }
      })
      .state('historiaclinicas.create', {
        url: '/create',
        templateUrl: '/modules/historiaclinicas/client/views/form-historiaclinica.client.view.html',
        controller: 'HistoriaclinicasController',
        controllerAs: 'vm',
        resolve: {
          historiaclinicaResolve: newHistoriaclinica
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Historiaclinicas Create'
        }
      })
      .state('historiaclinicas.edit', {
        url: '/:historiaclinicaId/edit',
        templateUrl: '/modules/historiaclinicas/client/views/form-historiaclinica.client.view.html',
        controller: 'HistoriaclinicasController',
        controllerAs: 'vm',
        resolve: {
          historiaclinicaResolve: getHistoriaclinica
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Historiaclinica {{ historiaclinicaResolve.name }}'
        }
      })
      .state('historiaclinicas.view', {
        url: '/:historiaclinicaId',
        templateUrl: '/modules/historiaclinicas/client/views/view-historiaclinica.client.view.html',
        controller: 'HistoriaclinicasController',
        controllerAs: 'vm',
        resolve: {
          historiaclinicaResolve: getHistoriaclinica
        },
        data: {
          pageTitle: 'Historiaclinica {{ historiaclinicaResolve.name }}'
        }
      });
  }

  getHistoriaclinica.$inject = ['$stateParams', 'HistoriaclinicasService'];

  function getHistoriaclinica($stateParams, HistoriaclinicasService) {
    return HistoriaclinicasService.get({
      historiaclinicaId: $stateParams.historiaclinicaId
    }).$promise;
  }

  newHistoriaclinica.$inject = ['HistoriaclinicasService'];

  function newHistoriaclinica(HistoriaclinicasService) {
    return new HistoriaclinicasService();
  }
}());
