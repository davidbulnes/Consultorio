(function () {
  'use strict';

  // Cita controller
  angular
    .module('cita')
    .controller('CitaController', CitaController);

  CitaController.$inject = ['$scope', '$state', '$window', 'Authentication', 'citumResolve'];

  function CitaController ($scope, $state, $window, Authentication, citum) {
    var vm = this;

    vm.authentication = Authentication;
    vm.citum = citum;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Citum
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.citum.$remove($state.go('cita.list'));
      }
    }

    // Save Citum
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.citumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.citum._id) {
        vm.citum.$update(successCallback, errorCallback);
      } else {
        vm.citum.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cita.view', {
          citumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
