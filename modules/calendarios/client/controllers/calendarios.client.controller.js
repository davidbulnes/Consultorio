(function () {
  'use strict';

  // Calendarios controller
  angular
    .module('calendarios')
    .controller('CalendariosController', CalendariosController);

  CalendariosController.$inject = ['$scope', '$state', '$window','calendarioResolve'];

  function CalendariosController ($scope, $state, $window, eventos) {
    var vm = this;
    vm.events = eventos;
    console.log(vm.events)
    var vm = this;

    /*vm.authentication = Authentication;
    vm.calendario = calendario;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Calendario
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.calendario.$remove($state.go('calendarios.list'));
      }
    }

    // Save Calendario
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.calendarioForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.calendario._id) {
        vm.calendario.$update(successCallback, errorCallback);
      } else {
        vm.calendario.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('calendarios.view', {
          calendarioId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }*/
  }
}());
