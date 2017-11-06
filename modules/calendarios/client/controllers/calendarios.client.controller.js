(function () {
  'use strict';

  // Calendarios controller
  angular
    .module('calendarios')
    .controller('CalendariosController', CalendariosController);

  CalendariosController.$inject = ['$scope', '$filter', 'moment', 'calendarConfig', 'PacientesService', 'citaResolve', '$uibModalInstance'];

  function CalendariosController($scope, $filter, moment, calendarConfig, PacientesService, cita, $uibModalInstance) {
    var vm = this;
    vm.cita = cita;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.form = {};
    vm.save = save;
    vm.showTable = false;
    setCita();

    PacientesService.query(function (data) {
      vm.pacientes = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 3;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    vm.toggle = function ($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    function setCita() {
      vm.cita.startsAt = moment().startOf('day').toDate();
      vm.cita.endsAt = moment().endOf('day').toDate();
      vm.cita.color = { primary: "#e3bc08", secondary: "#fdf1ba" };
      vm.cita.draggable = true;
      vm.cita.resizable = true;
    };

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.pacientes, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    vm.openTable = function () {
      vm.showTable = true;
    };

    vm.selectRow = function (cell) {
      vm.selectRows = cell;
      vm.cita.paciente = vm.selectRows;
      console.log(vm.cita);
      vm.fullName = vm.selectRows.name + ' ' + vm.selectRows.lastName;
      vm.showTable = false;
    };

    function save(isValid) {
      /*if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.calendarioForm');
        return false;
      }
      else {
        console.log('no guaarda');
      }*/

      // TODO: move create/update logic to service
      if (vm.cita._id) {
        vm.cita.$update(successCallback, errorCallback);
      } else {
        vm.cita.$save(successCallback, errorCallback);
        console.log('guardo');
      }

      function successCallback(res) {
        $uibModalInstance.close(res);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

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
