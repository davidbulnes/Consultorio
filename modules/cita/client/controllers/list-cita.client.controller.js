(function () {
  'use strict';

  angular
    .module('cita')
    .controller('CitaListController', CitaListController);

  CitaListController.$inject = ['CitaService'];

  function CitaListController(CitaService) {
    var vm = this;

    vm.cita = CitaService.query();
  }
}());
