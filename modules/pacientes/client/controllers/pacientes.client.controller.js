(function () {
  'use strict';

  // Specialties controller
  angular
    .module('pacientes')
    .controller('PacientesController', PacientesController);

  PacientesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pacienteResolve'];

  function PacientesController ($scope, $state, $window, Authentication, pacientes) {
    var vm = this;
    console.log(pacientes);
    $window.scrollTo(0,0);
    vm.authentication = Authentication;
    vm.pacientes = pacientes;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.fullName = pacientes.name + ' ' + pacientes.lastName;

    // Remove existing Specialty
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pacientes.$remove($state.go('paciente.list'));
      }
    }

    // Save Specialty
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pacienteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pacientes._id) {
        vm.pacientes.$update(successCallback, errorCallback);
      } else {
        console.log(vm.pacientes);
        vm.pacientes.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('paciente.list', {
          pacienteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
