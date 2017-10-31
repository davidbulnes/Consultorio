(function () {
  'use strict';

  angular
    .module('pacientes')
    .controller('PacientesListController', PacientesListController);

  PacientesListController.$inject = ['$scope', '$filter', 'PacientesService', 'pacienteResolve'];

  function PacientesListController($scope, $filter, PacientesService, type) {
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

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
