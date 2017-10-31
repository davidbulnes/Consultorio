(function (app) {
  'use strict';

  app.registerModule('pacientes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('pacientes.services');
  app.registerModule('pacientes.routes', ['ui.router', 'core.routes', 'pacientes.services']);
}(ApplicationConfiguration));