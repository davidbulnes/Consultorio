(function () {
  'use strict';

  angular
    .module('calendarios')
    .controller('PacientesModalListController', PacientesModalListController);

  PacientesModalListController.$inject = ['$scope', '$filter', 'PacientesService', 'pacienteResolve', '$uibModalInstance'];

  function PacientesModalListController($scope, $filter, PacientesService, type, $uibModalInstance) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.type = type;

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

    vm.closeModal = function(paciente) {
      $uibModalInstance.close(paciente);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
