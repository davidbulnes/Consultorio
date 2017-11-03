(function () {
  'use strict';

  angular
    .module('calendarios')
    .controller('KitchenSinkCtrl', KitchenSinkCtrl);


  KitchenSinkCtrl.$inject = ['$uibModal', 'CalendariosService', 'moment', 'calendarConfig'];

  function KitchenSinkCtrl($uibModal, CalendariosService, moment, calendarConfig) {
    var vm = this;
    vm.calendarios = CalendariosService.query();
    vm.calendarView = 'month';
    vm.viewDate = new Date();;

    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function (args) {
        show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function (args) {
        show('Deleted', args.calendarEvent);
      }
    }];

    /*vm.events = [
      {
        title: 'An event',
        color: calendarConfig.colorTypes.warning,
        //color: {primary: "#e3bc08", secondary: "#fdf1ba"},
        startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
        endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
        color: calendarConfig.colorTypes.info,
        startsAt: moment().subtract(1, 'day').toDate(),
        endsAt: moment().add(5, 'days').toDate(),
        draggable: true,
        resizable: true,
        actions: actions
      }, {
        title: 'This is a really long event title that occurs on every year',
        color: calendarConfig.colorTypes.important,
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        draggable: true,
        resizable: true,
        actions: actions
      }
    ];*/

    vm.cellIsOpen = true;
    console.log(vm.events);

    /*vm.addEvent = function() {
      vm.events.push({
        title: 'New event',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: true,
        resizable: true
      });
      console.log(vm.events)
    };*/
    vm.addEvent = function () {
      return $uibModal.open({
        templateUrl: 'modules/calendarios/client/views/form-calendario.client.view.html',
        controller: 'CalendariosController',
        controllerAs: 'vm',
        size: 'lg',
        windowClass: 'my-modal',
        resolve: {
          citaResolve: newCalendario
        }
      })
    };

    newCalendario.$inject = ['CalendariosService'];

    function newCalendario(CalendariosService) {
      return new CalendariosService();
    }

    vm.eventClicked = function (event) {
      show('Clicked', event);
    };

    vm.eventEdited = function (event) {
      show('Edited', event);
    };

    vm.eventDeleted = function (event) {
      show('Deleted', event);
    };

    vm.eventTimesChanged = function (event) {
      show('Dropped or resized', event);
    };

    vm.toggle = function ($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    var show = function (action, event) {
      return $uibModal.open({
        templateUrl: 'modules/calendarios/client/views/modalContent.html',
        controller: function () {
          var vm = this;
          vm.action = action;
          vm.event = event;
        },
        controllerAs: 'vm'
      });
    }

    /*var paciente = function (type) {
      var openPacienteModal = $uibModal.open({
        templateUrl: 'modules/calendarios/client/views/list-pacientes-modal.client.view.html',
        controller: 'PacientesModalListController',
        controllerAs: 'vm',
        size: 'lg',
        windowClass: 'my-modal',
        resolve: {
          pacienteResolve: () => {
            return type;
          }
        }
      });
      openPacienteModal.result.then(function (selectedItem) {
        vm.selectPaciente = selectedItem;
        vm.fullName = selectedItem.name + ' ' + selectedItem.lastName
        console.log(vm.selectPaciente)
      });
    }

    vm.openPaciente = function (event) {
      paciente();
    };*/


    vm.timespanClicked = function (date, cell) {
      if (vm.calendarView === 'month') {
        if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      } else if (vm.calendarView === 'year') {
        if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
          //vm.citas = cell.events
        }
      }
    }
  }
}());
