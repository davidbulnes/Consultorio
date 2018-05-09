(function () {
  'use strict';

  // Fotoshistoria controller
  angular
    .module('fotoshistoria')
    .controller('FotoshistoriaController', FotoshistoriaController);

  FotoshistoriaController.$inject = ['$scope', '$state', '$window', 'Authentication', 'fotoshistoriumResolve'];

  function FotoshistoriaController ($scope, $state, $window, Authentication, fotoshistorium) {
    var vm = this;

    vm.authentication = Authentication;
    vm.fotoshistorium = fotoshistorium;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Fotoshistorium
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.fotoshistorium.$remove($state.go('fotoshistoria.list'));
      }
    }

    // Save Fotoshistorium
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fotoshistoriumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.fotoshistorium._id) {
        vm.fotoshistorium.$update(successCallback, errorCallback);
      } else {
        vm.fotoshistorium.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('fotoshistoria.view', {
          fotoshistoriumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
