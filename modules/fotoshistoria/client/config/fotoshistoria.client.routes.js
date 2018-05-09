(function () {
  'use strict';

  angular
    .module('fotoshistoria')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('fotoshistoria', {
        abstract: true,
        url: '/fotoshistoria',
        template: '<ui-view/>'
      })
      .state('fotoshistoria.list', {
        url: '',
        templateUrl: 'modules/fotoshistoria/client/views/list-fotoshistoria.client.view.html',
        controller: 'FotoshistoriaListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Fotoshistoria List'
        }
      })
      .state('fotoshistoria.create', {
        url: '/create',
        templateUrl: 'modules/fotoshistoria/client/views/form-fotoshistorium.client.view.html',
        controller: 'FotoshistoriaController',
        controllerAs: 'vm',
        resolve: {
          fotoshistoriumResolve: newFotoshistorium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Fotoshistoria Create'
        }
      })
      .state('fotoshistoria.edit', {
        url: '/:fotoshistoriumId/edit',
        templateUrl: 'modules/fotoshistoria/client/views/form-fotoshistorium.client.view.html',
        controller: 'FotoshistoriaController',
        controllerAs: 'vm',
        resolve: {
          fotoshistoriumResolve: getFotoshistorium
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Fotoshistorium {{ fotoshistoriumResolve.name }}'
        }
      })
      .state('fotoshistoria.view', {
        url: '/:fotoshistoriumId',
        templateUrl: 'modules/fotoshistoria/client/views/view-fotoshistorium.client.view.html',
        controller: 'FotoshistoriaController',
        controllerAs: 'vm',
        resolve: {
          fotoshistoriumResolve: getFotoshistorium
        },
        data: {
          pageTitle: 'Fotoshistorium {{ fotoshistoriumResolve.name }}'
        }
      });
  }

  getFotoshistorium.$inject = ['$stateParams', 'FotoshistoriaService'];

  function getFotoshistorium($stateParams, FotoshistoriaService) {
    return FotoshistoriaService.get({
      fotoshistoriumId: $stateParams.fotoshistoriumId
    }).$promise;
  }

  newFotoshistorium.$inject = ['FotoshistoriaService'];

  function newFotoshistorium(FotoshistoriaService) {
    return new FotoshistoriaService();
  }
}());
