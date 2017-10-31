(function () {
  'use strict';

  angular
    .module('cita')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Cita',
      state: 'cita',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'cita', {
      title: 'List Cita',
      state: 'cita.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'cita', {
      title: 'Create Citum',
      state: 'cita.create',
      roles: ['user']
    });
  }
}());
