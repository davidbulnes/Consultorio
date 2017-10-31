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
      roles: ['admin']
    });

     menuService.addSubMenuItem('topbar', 'paciente', {
      title: 'Listar Pacientes',
      state: 'paciente.list'
    });
  }
}());
