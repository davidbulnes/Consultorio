(function () {
  'use strict';

  angular
    .module('historiaclinicas')
    .controller('HistoriaclinicasListController', HistoriaclinicasListController);

  HistoriaclinicasListController.$inject = ['HistoriaclinicasService'];

  function HistoriaclinicasListController(HistoriaclinicasService) {
    var vm = this;

    vm.historiaclinicas = HistoriaclinicasService.query();
  }
}());
