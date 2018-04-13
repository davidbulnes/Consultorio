(function () {
  'use strict';

  // Historiaclinicas controller
  angular
    .module('historiaclinicas')
    .controller('HistoriaclinicasController', HistoriaclinicasController);

  HistoriaclinicasController.$inject = ['$scope', '$state', '$uibModal', '$window', 'Authentication', 'historiaclinicaResolve', 'moment'];

  function HistoriaclinicasController ($scope, $state, $uibModal, $window, Authentication, historiaclinica, moment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.historiaclinica = historiaclinica;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    console.log(historiaclinica);
    if (!vm.historiaclinica._id){
      vm.historiaclinica.fechaCreated = new Date();
    } else {
      vm.fullName = vm.historiaclinica.paciente.name + ''+ vm.historiaclinica.paciente.lastName;
      vm.historiaclinica.fechaCreated = moment(vm.historiaclinica.fechaCreated).toDate();
    }

    // Remove existing Historiaclinica
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.historiaclinica.$remove($state.go('historiaclinicas.list'));
      }
    }

    // Save Historiaclinica
    function save() {
     // if (!isValid) {
     //   $scope.$broadcast('show-errors-check-validity', 'vm.form.historiaclinicaForm');
     //   return false;
     // }
      // TODO: move create/update logic to service
      if (vm.historiaclinica._id) {
        vm.historiaclinica.$update(successCallback, errorCallback);
      } else {
        console.log('paso el else')
        console.log(vm.historiaclinica)
        vm.historiaclinica.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log('Guardo bien')
      }

      function errorCallback(res) {
        console.log(res);
        vm.error = res.data.message;
      }
    }

    vm.toggle = function ($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    vm.openModalPaciente = function (type) {
      var openModal = $uibModal.open({
        templateUrl: '/modules/calendarios/client/views/list-pacientes-modal.client.view.html',
        controller: 'PacientesListModalController',
        controllerAs: 'vm',
        size: 'lg',
        windowClass: 'my-modal'
      });
      openModal.result.then(function (paciente) {
        vm.historiaclinica.paciente = paciente;
        vm.fullName = vm.historiaclinica.paciente.name + ' ' + vm.historiaclinica.paciente.lastName;
      });
    };


  }
}());
