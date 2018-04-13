'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Historiaclinica = mongoose.model('Historiaclinica'),
  //TerapeuticaPodologica = mongoose.model('TerapeuticaPodologica'),
 // IndicacionesDervProxCita = mongoose.model('IndicacionesDervProxCita'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Historiaclinica
 */
exports.create = function(req, res) {
  var historiaclinica = new Historiaclinica(req.body);
  historiaclinica.user = req.user;
  historiaclinica.paciente = req.body.paciente;
  historiaclinica.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(historiaclinica);
    }
  });
};

/**
 * Show the current Historiaclinica
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var historiaclinica = req.historiaclinica ? req.historiaclinica.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  historiaclinica.isCurrentUserOwner = req.user && historiaclinica.user && historiaclinica.user._id.toString() === req.user._id.toString();

  res.jsonp(historiaclinica);
};

/**
 * Update a Historiaclinica
 */
exports.update = function(req, res) {
  var historiaclinica = req.historiaclinica;

  historiaclinica = _.extend(historiaclinica, req.body);

  historiaclinica.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(historiaclinica);
    }
  });
};

/**
 * Delete an Historiaclinica
 */
exports.delete = function(req, res) {
  var historiaclinica = req.historiaclinica;

  historiaclinica.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(historiaclinica);
    }
  });
};

/**
 * List of Historiaclinicas
 */
exports.list = function(req, res) {
  Historiaclinica.find().sort('-created').populate('user', 'displayName').exec(function(err, historiaclinicas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(historiaclinicas);
    }
  });
};

/**
 * Historiaclinica middleware
 */
exports.historiaclinicaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Historiaclinica is invalid'
    });
  }

  Historiaclinica.findById(id).populate('user paciente').exec(function (err, historiaclinica) {
    if (err) {
      return next(err);
    } else if (!historiaclinica) {
      return res.status(404).send({
        message: 'No Historiaclinica with that identifier has been found'
      });
    }
    req.historiaclinica = historiaclinica;
    next();
  });
};
