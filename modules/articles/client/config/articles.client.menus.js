(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['admin', 'eli']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list',
      roles: ['admin', 'eli']
    });

    menuService.addSubMenuItem('topbar', 'articles',{
      title: 'Manage Articles',
      state: 'admin.articles.list',
      roles: ['admin', 'eli']
    });
  }
}());
