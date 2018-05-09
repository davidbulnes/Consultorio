(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$filter', 'CoreService', 'Cie10presuntivoService'];

  function HomeController($scope, $filter, CoreService, Cie10presuntivoService) {
    var vm = this;
    vm.barrasdata = [[],[]];
    Cie10presuntivoService.query(function(data){
      vm.cie10 = data;
      //vm.cie10.splice(0,0,{_id : "0" , descripcion: "--Todos--"});
    });
    CoreService.query(function(data){
      vm.barrasm = data[0];
      vm.barrasf = data[1];
      angular.forEach(vm.barrasm, function(value, key){
        vm.barrasdata[0].push(value.suma);
      });
      angular.forEach(vm.barrasf, function(value, key){
        vm.barrasdata[1].push(value.suma);
      });
    });


    vm.getcie10 = function(){
      vm.barrasdata = [[],[]];
      vm.barrasm = [];
      vm.barrasf = [];
      vm.cie10id = vm.ci10diagdefinitivo._id;
      vm.databycie10 = CoreService.get({cie10id: vm.cie10id}).$promise;
      vm.databycie10.then(function(data){
        vm.barrasm = data[0];
        vm.barrasf = data[1];
        angular.forEach(vm.barrasm, function(value, key){
          vm.barrasdata[0].push(value.suma);
        });
        angular.forEach(vm.barrasf, function(value, key){
          vm.barrasdata[1].push(value.suma);
        });
      });
    }

    chart1();
    chart2();
    chart3();

    function chart1() {
      vm.percent1 = 65;
      vm.options1 = {
        animate: {
          duration: 1000,
          enabled: true
        },
        barColor: '#0174DF',
        trackColor: true,
        scaleColor: true,
        lineWidth: 25,
        lineCap: 'circle',
        size: 200
      }
    }
    function chart2() {
      vm.percent2 = 25;
      vm.options2 = {
        animate: {
          duration: 1000,
          enabled: true
        },
        barColor: '#01DF3A',
        trackColor: true,
        scaleColor: true,
        lineWidth: 25,
        lineCap: 'circle',
        size: 200
      }
    }
     function chart3() {
      vm.percent3 = 90;
      vm.options3 = {
        animate: {
          duration: 1000,
          enabled: true
        },
        barColor: '#FF8000',
        trackColor: true,
        scaleColor: true,
        lineWidth: 25,
        lineCap: 'circle',
        size: 200
      }
    }

    vm.etiquetas = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre',
                    'Octubre', 'Noviembre', 'Diciembre'];
    vm.series = ['Hombres', 'Mujeres'];
    vm.options = { legend: { display: true } }
    vm.datos = [
      [65, 59, 80, 81, 65, 59, 80, 81],
      [28, 48, 40, 19, 28, 48, 40, 19]
    ];
    vm.colors = [ '#00ADF9', '#803690', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
  }
}());
