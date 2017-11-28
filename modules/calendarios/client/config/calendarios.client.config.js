(function () {
  'use strict';

  angular
    .module('calendarios')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Calendarios',
      state: 'calendarios',
      type: 'dropdown',
      roles: ['admin', 'eli', 'gio']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'calendarios', {
      title: 'Calendario',
      state: 'calendarios.list',
      roles: ['admin', 'eli', 'gio']
    });

  }
}());
