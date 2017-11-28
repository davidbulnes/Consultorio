'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Calendarios Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', 'eli', 'gio'],
    allows: [{
      resources: '/api/calendarios',
      permissions: '*'
    }, {
      resources: '/api/calendarios/:calendarioId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/calendarios',
      permissions: ['get', 'post']
    }, {
      resources: '/api/calendarios/:calendarioId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/calendarios',
      permissions: ['get']
    }, {
      resources: '/api/calendarios/:calendarioId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Calendarios Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Calendario is being processed and the current user created it then allow any manipulation
  if (req.calendario && req.user && req.calendario.user && req.calendario.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
