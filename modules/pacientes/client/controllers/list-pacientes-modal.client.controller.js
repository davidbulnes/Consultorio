(function () {
  'use strict';

  angular
    .module('pacientes')
    .controller('PacientesListModalController', PacientesListModalController);

  PacientesListModalController.$inject = ['$scope', '$filter', 'PacientesService', '$uibModalInstance'];

  function PacientesListModalController($scope, $filter, PacientesService, $uibModalInstance) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.sortType = 'name';
    vm.sortReverse = false;
    vm.close = close;

    PacientesService.query(function (data) {
      vm.pacientes = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

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

    function close(data) {
      $uibModalInstance.close(data);
    }

    vm.selectRow = function (cell) {
      vm.selectRows = cell;
      vm.paciente = vm.selectRows;
      console.log(vm.paciente);
      vm.paciente.fullName = vm.selectRows.lastName + ' ' + vm.selectRows.name;
      vm.close(vm.paciente);
    };
 
  }
}());
