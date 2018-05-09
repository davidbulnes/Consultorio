'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Fotoshistorium = mongoose.model('FotosHistoriaClinica'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Fotoshistorium
 */
exports.create = function(req, res) {
  var fotoshistorium = new Fotoshistorium(req.body);
  fotoshistorium.user = req.user;

  fotoshistorium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fotoshistorium);
    }
  });
};

/**
 * Show the current Fotoshistorium
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var fotoshistorium = req.fotoshistorium ? req.fotoshistorium.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  fotoshistorium.isCurrentUserOwner = req.user && fotoshistorium.user && fotoshistorium.user._id.toString() === req.user._id.toString();

  res.jsonp(fotoshistorium);
};

/**
 * Update a Fotoshistorium
 */
exports.update = function(req, res) {
  var fotoshistorium = req.fotoshistorium;

  fotoshistorium = _.extend(fotoshistorium, req.body);

  fotoshistorium.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fotoshistorium);
    }
  });
};

/**
 * Delete an Fotoshistorium
 */
exports.delete = function(req, res) {
  var fotoshistorium = req.fotoshistorium;

  fotoshistorium.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fotoshistorium);
    }
  });
};

/**
 * List of Fotoshistoria
 */
exports.list = function(req, res) {
  Fotoshistorium.find().sort('-created').populate('user', 'displayName').exec(function(err, fotoshistoria) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fotoshistoria);
    }
  });
};

/**
 * Fotoshistorium middleware
 */
exports.fotoshistoriumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Fotoshistorium is invalid'
    });
  }

  Fotoshistorium.findById(id).populate('user', 'displayName').exec(function (err, fotoshistorium) {
    if (err) {
      return next(err);
    } else if (!fotoshistorium) {
      return res.status(404).send({
        message: 'No Fotoshistorium with that identifier has been found'
      });
    }
    req.fotoshistorium = fotoshistorium;
    next();
  });
};
