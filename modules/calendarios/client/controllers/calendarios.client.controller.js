(function () {
  'use strict';

  // Calendarios controller
  angular
    .module('calendarios')
    .controller('CalendariosController', CalendariosController);

  CalendariosController.$inject = ['$scope', 'moment', 'calendarConfig', 'citaResolve'];

  function CalendariosController ($scope, moment, calendarConfig, cita) {
    var vm = this;
    vm.cita = cita;
    setCita();
    console.log(cita)
    console.log(vm.cita)

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };
    
     function setCita(){
      vm.cita.startsAt = moment().startOf('day').toDate();
      vm.cita.endsAt = moment().endOf('day').toDate();
      vm.cita.color = {primary : "#e3bc08", secondary : "#fdf1ba"};
      vm.cita.draggable = true;
      vm.cita.resizable = true;
    };


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
