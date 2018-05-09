(function () {
  'use strict';

  angular
    .module('fotoshistoria')
    .controller('FotoshistoriaListController', FotoshistoriaListController);

  FotoshistoriaListController.$inject = ['FotoshistoriaService'];

  function FotoshistoriaListController(FotoshistoriaService) {
    var vm = this;

    vm.fotoshistoria = FotoshistoriaService.query();
  }
}());
