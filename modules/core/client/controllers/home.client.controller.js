(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$filter', 'CoreService', 'CoreLineService', 'CoreMeetService','Cie10presuntivoService', '$timeout', '$mdSidenav', '$mdDialog', '$location'];

  function HomeController($scope, $filter, CoreService, CoreLineService, CoreMeetService, Cie10presuntivoService, $timeout, $mdSidenav, $mdDialog, $location) {
    var vm = this;
    vm.barrasdata = [[],[]];
    vm.cie10byyear = [];
    vm.dataLine = [];
    vm.meetDay = {};
    vm.enableHomePag = true;
    vm.toggleLeft = buildToggler('left');
    
    Cie10presuntivoService.query(function(data){
      vm.cie10 = data;
      //vm.cie10.splice(0,0,{_id : "0" , descripcion: "--Todos--"});
    });
    CoreService.query(function(data){
      vm.loading = true;
      vm.barrasm = data[0];
      vm.barrasf = data[1];
      angular.forEach(vm.barrasm, function(value, key){
        vm.barrasdata[0].push(value.suma);
      });
      angular.forEach(vm.barrasf, function(value, key){
        vm.barrasdata[1].push(value.suma);
      });
      vm.loading = false;
    });
    setVisibility();
    getDates();
    getLineData();
    getMeetDay();

    function getDates(){
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      for (let i = -10; i < 11; i++) {
        var c = new Date(year+i, month ,day);
        vm.cie10byyear.push({fecha: c , ano: c.getFullYear() }); 
      }
      vm.yearcie10 = new Date().getFullYear();
    }

    function getLineData(){
      vm.dataLine = [];
      CoreLineService.query(function(data){
        angular.forEach(data, function(value,key){
          vm.dataLine.push(value.suma);
        });
      });
    }

    function setVisibility(){
      var url = $location.path().split(/[\s/]+/).pop();
      if(url == 'reports1' || url == 'reports2' || url == 'reports3'){
        vm.enableHomePag = false;
      }
    }

    function getMeetDay(){
      CoreMeetService.query(function(data){
        angular.forEach(data, function (value, key) {
          data[key].startsAt = moment.utc(value.startsAt).local().toDate();
        });
        vm.meetDay = data;
      })
    }

    vm.getcie10 = function(){
      if(!vm.yearcie10){
        vm.yearcie10 = new Date().getFullYear();
      }
      vm.loading = true;
      vm.barrasdata = [[],[]];
      vm.barrasm = [];
      vm.barrasf = [];
      vm.cie10id = vm.ci10diagdefinitivo._id;
      vm.databycie10 = CoreService.get({cie10id: vm.cie10id, yearcie10: vm.yearcie10}).$promise;
      vm.databycie10.then(function(data){
        vm.barrasm = data[0];
        vm.barrasf = data[1];
        angular.forEach(vm.barrasm, function(value, key){
          vm.barrasdata[0].push(value.suma);
        });
        angular.forEach(vm.barrasf, function(value, key){
          vm.barrasdata[1].push(value.suma);
        });
        vm.loading = false;
      });
    }

    vm.isOpenLeft = function(){
      return $mdSidenav('left').isOpen();
    };
    
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
      };
    };

    vm.doPrimaryAction = function(item) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Cita')
          .textContent('Motivo:' + ' ' + item.description)
          .ariaLabel('Primary click demo')
          .ok('Cerrar')
          .targetEvent(event)
      );
    };

    vm.closeNav = function () {
      $mdSidenav('left').close()
    };

    vm.closeNavMod = function () {
      vm.enableHomePag = false;
      $mdSidenav('left').close()
    };

    vm.etiquetas = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre',
                    'Octubre', 'Noviembre', 'Diciembre'];
    vm.series = ['Hombres', 'Mujeres'];
    vm.etiquetasLine = ['En Espera', 'Curado', 'No Curado'];
    vm.options1 = { legend: { display: true } }
    vm.options2 = { 
      legend: { display: true },
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: true,
            position: 'right'
          }
        ]
      }
     }
    vm.datos = [
      [65, 59, 80, 81, 65, 59, 80, 81],
      [28, 48, 40, 19, 28, 48, 40, 19]
    ];
    vm.colors = [ '#00ADF9', '#803690', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
    vm.colorPastel = ['#DFDFDF','#00C843','#C80C00']
  }
}());
