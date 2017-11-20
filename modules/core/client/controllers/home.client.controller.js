(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  function HomeController() {
    var vm = this;
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
  }
}());
