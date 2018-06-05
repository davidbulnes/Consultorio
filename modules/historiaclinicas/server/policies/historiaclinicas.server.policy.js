'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Historiaclinicas Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/historiaclinicas',
      permissions: '*'
    }, {
      resources: '/api/historiaclinicas/:historiaclinicaId',
      permissions: '*'
    },{
      resources: '/api/picture',
      permissions: '*'
    },{
      resources: '/api/terapia',
      permissions: '*'
    },{
      resources: '/api/cie10presuntivo',
      permissions: '*'
    },{
      resources: '/api/fotohistoria/:fotohistoriaId',
      permissions: '*'
    },{
      resources: '/api/fotobynumerohc/:numeroHC',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/historiaclinicas',
      permissions: '*'
    }, {
      resources: '/api/historiaclinicas/:historiaclinicaId',
      permissions: '*'
    },{
      resources: '/api/picture',
      permissions: '*'
    },{
      resources: '/api/terapia',
      permissions: '*'
    },{
      resources: '/api/cie10presuntivo',
      permissions: '*'
    },{
      resources: '/api/fotohistoria/:fotohistoriaId',
      permissions: '*'
    },{
      resources: '/api/fotobynumerohc/:numeroHC',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/historiaclinicas',
      permissions: ['get']
    }, {
      resources: '/api/historiaclinicas/:historiaclinicaId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Historiaclinicas Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Historiaclinica is being processed and the current user created it then allow any manipulation
  if (req.historiaclinica && req.user && req.historiaclinica.user && req.historiaclinica.user.id === req.user.id) {
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
