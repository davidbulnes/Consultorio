'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Paciente = mongoose.model('Paciente'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Paciente
 */
exports.create = function(req, res) {
  var paciente = new Paciente(req.body);
  paciente.user = req.user;

  paciente.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paciente);
    }
  });
};

/**
 * Show the current Paciente
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var paciente = req.paciente ? req.paciente.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  paciente.isCurrentUserOwner = req.user && paciente.user && paciente.user._id.toString() === req.user._id.toString();

  res.jsonp(paciente);
};

/**
 * Update a Paciente
 */
exports.update = function(req, res) {
  var paciente = req.paciente;

  paciente = _.extend(paciente, req.body);

  paciente.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paciente);
    }
  });
};

/**
 * Delete an Paciente
 */
exports.delete = function(req, res) {
  var paciente = req.paciente;

  paciente.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(paciente);
    }
  });
};

/**
 * List of Pacientes
 */
exports.list = function(req, res) {
  Paciente.find().sort('-created').populate('user', 'displayName').exec(function(err, pacientes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pacientes);
    }
  });
};

/**
 * Paciente middleware
 */
exports.pacienteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Paciente is invalid'
    });
  }

  Paciente.findById(id).populate('user', 'displayName').exec(function (err, paciente) {
    if (err) {
      return next(err);
    } else if (!paciente) {
      return res.status(404).send({
        message: 'No Paciente with that identifier has been found'
      });
    }
    req.paciente = paciente;
    next();
  });
};
