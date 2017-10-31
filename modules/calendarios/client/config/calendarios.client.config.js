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
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'calendarios', {
      title: 'List Calendarios',
      state: 'calendarios.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'calendarios', {
      title: 'Create Calendario',
      state: 'calendarios.create',
      roles: ['user']
    });
  }
}());
