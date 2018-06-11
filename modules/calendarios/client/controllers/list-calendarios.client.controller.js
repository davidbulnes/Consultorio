(function () {
  'use strict';

  angular
    .module('calendarios')
    .controller('KitchenSinkCtrl', KitchenSinkCtrl);


  KitchenSinkCtrl.$inject = ['$uibModal', '$window', 'CalendariosService', 'moment', 'calendarConfig', 'Notification'];

  function KitchenSinkCtrl($uibModal, $window, CalendariosService, moment, calendarConfig, Notification) {
    var vm = this;
    listCalendar();
    vm.calendarView = 'month';
    vm.remove = remove;
    vm.viewDate = new Date();

    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function (args) {
        edit(args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function (args) {
        remove(args.calendarEvent);
      }
    }];

    function listCalendar() {
      vm.calendarios = CalendariosService.query({}, function (data) {
        angular.forEach(data, function (value, key) {
          data[key].startsAt = moment(value.startsAt).toDate();
          data[key].endsAt = moment(value.endsAt).toDate();
          data[key].actions = actions;
        });
      });
    }

   

    function formatDate() {
      angular.forEach(vm.calendarios, function (value, key) {
        vm.calendarios.startsAt = moment(value.startsAt).toDate();
      });
    }

    vm.cellIsOpen = true;
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
      var openModalCita = $uibModal.open({
        templateUrl: 'modules/calendarios/client/views/form-calendario.client.view.html',
        controller: 'CalendariosController',
        controllerAs: 'vm',
        size: 'lg',
        windowClass: 'my-modal',
        resolve: {
          citaResolve: newCalendario
        }
      });
      openModalCita.result.then(function () {
        listCalendar();
      });
    };

    newCalendario.$inject = ['CalendariosService'];

    function newCalendario(CalendariosService) {
      return new CalendariosService();
    }

    getCalendario.$inject = ['CalendariosService'];

    function getCalendario(CalendariosService) {
      return CalendariosService.get({
        calendarioId: vm.cita_id
      }).$promise;
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
      event.paciente.fullname = event.paciente.name + ' ' + event.paciente.lastName
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

    var edit = function (event) {
      var editModal = $uibModal.open({
        templateUrl: 'modules/calendarios/client/views/form-calendario.client.view.html',
        controller: 'CalendariosController',
        controllerAs: 'vm',
        size: 'lg',
        windowClass: 'my-modal',
        resolve: {
          citaResolve: event
        }
      });
      editModal.result.then(function () {
        listCalendar();
      });
    }

    function remove(item) {
      if ($window.confirm('Estas seguro de borrar esta cita?')) {
        item.$remove(function () {
          listCalendar();
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Cita Borrada' });
        });
      }
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
        }
      }
    }
  }
}());
