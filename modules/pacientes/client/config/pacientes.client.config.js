(function () {
  'use strict';

  angular
    .module('pacientes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addMenuItem('topbar',{
      title: 'Pacientes',
      state: 'paciente',
      type: 'dropdown',
      roles: ['admin', 'eli', 'gio']
    });

     menuService.addSubMenuItem('topbar', 'paciente', {
      title: 'Listar Pacientes',
      state: 'paciente.list',
      roles: ['admin', 'eli', 'gio']
    });
    menuService.addSubMenuItem('topbar', 'paciente', {
      title: 'Registrar Paciente',
      state: 'paciente.create',
      roles: ['admin', 'eli', 'gio']
    });
  }
}());
