(function () {
  'use strict';

  angular
    .module('pacientes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('paciente', {
        abstract: true,
        url: '/paciente',
        templateUrl: '<ui-view/>'
      })
      .state('paciente.list', {
        url: '',
        templateUrl: '/modules/pacientes/client/views/list-pacientes.client.view.html',
        controller: 'PacientesListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'eli', 'gio', 'user']
        }
      })
      .state('paciente.create', {
        url: '/create',
        templateUrl: '/modules/pacientes/client/views/form-paciente.client.view.html',
        controller: 'PacientesController',
        controllerAs: 'vm',
        resolve: {
          pacienteResolve: newPaciente
        },
        data: {
          roles: ['admin', 'eli', 'gio', 'user'],
          pageTitle: 'Paciente Create'
        }
      })
      .state('paciente.edit', {
        url: '/:pacienteId/edit',
        templateUrl: '/modules/pacientes/client/views/form-paciente.client.view.html',
        controller: 'PacientesController',
        controllerAs: 'vm',
        resolve: {
          pacienteResolve: getPaciente
        },
        data: {
          roles: ['admin', 'eli', 'gio', 'user'],
          pageTitle: 'Edit Paciente {{ pacienteResolve.name }}'
        }
      })
      .state('paciente.view', {
        url: '/:pacienteId',
        templateUrl: '/modules/pacientes/client/views/view-paciente.client.view.html',
        controller: 'PacientesController',
        controllerAs: 'vm',
        resolve: {
          pacienteResolve: getPaciente
        },
        data: {
          roles: ['admin', 'eli', 'gio', 'user'],
          pageTitle: 'Paciente {{ pacienteResolve.name }}'
        }
      });
  }

  getPaciente.$inject = ['$stateParams', 'PacientesService'];

  function getPaciente($stateParams, PacientesService) {
    return PacientesService.get({
      pacienteId: $stateParams.pacienteId
    }).$promise;
  }

  newPaciente.$inject = ['PacientesService'];

  function newPaciente(PacientesService) {
    return new PacientesService();
  }
}());
