'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Fotoshistoria Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/fotoshistoria',
      permissions: '*'
    }, {
      resources: '/api/fotoshistoria/:fotoshistoriumId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/fotoshistoria',
      permissions: ['get', 'post']
    }, {
      resources: '/api/fotoshistoria/:fotoshistoriumId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/fotoshistoria',
      permissions: ['get']
    }, {
      resources: '/api/fotoshistoria/:fotoshistoriumId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Fotoshistoria Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Fotoshistorium is being processed and the current user created it then allow any manipulation
  if (req.fotoshistorium && req.user && req.fotoshistorium.user && req.fotoshistorium.user.id === req.user.id) {
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
