(function () {
  'use strict';

  angular
    .module('historiaclinicas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Historia Clínica',
      state: 'historiaclinicas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'historiaclinicas', {
      title: 'Listar Historias Clínicas',
      state: 'historiaclinicas.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'historiaclinicas', {
      title: 'Crear Historias Clínicas',
      state: 'historiaclinicas.create',
      roles: ['user']
    });
  }
}());
