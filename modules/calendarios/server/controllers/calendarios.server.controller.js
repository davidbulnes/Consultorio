'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Calendario = mongoose.model('Calendario'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Calendario
 */
exports.create = function(req, res) {
  var calendario = new Calendario(req.body);
  calendario.user = req.user;

  calendario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendario);
    }
  });
};

/**
 * Show the current Calendario
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var calendario = req.calendario ? req.calendario.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  calendario.isCurrentUserOwner = req.user && calendario.user && calendario.user._id.toString() === req.user._id.toString();

  res.jsonp(calendario);
};

/**
 * Update a Calendario
 */
exports.update = function(req, res) {
  var calendario = req.calendario;

  calendario = _.extend(calendario, req.body);

  calendario.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendario);
    }
  });
};

/**
 * Delete an Calendario
 */
exports.delete = function(req, res) {
  var calendario = req.calendario;

  calendario.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendario);
    }
  });
};

/**
 * List of Calendarios
 */
exports.list = function(req, res) {
  Calendario.find().sort('-created').populate('user paciente', 'displayName name lastName dni').exec(function(err, calendarios) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendarios);
    }
  });
};

/**
 * Calendario middleware
 */
exports.calendarioByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Calendario is invalid'
    });
  }

  Calendario.findById(id).populate('user', 'displayName').exec(function (err, calendario) {
    if (err) {
      return next(err);
    } else if (!calendario) {
      return res.status(404).send({
        message: 'No Calendario with that identifier has been found'
      });
    }
    req.calendario = calendario;
    next();
  });
};
