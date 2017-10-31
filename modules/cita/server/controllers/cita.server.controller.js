'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Citum = mongoose.model('Citum'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Citum
 */
exports.create = function(req, res) {
  var citum = new Citum(req.body);
  citum.user = req.user;

  citum.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(citum);
    }
  });
};

/**
 * Show the current Citum
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var citum = req.citum ? req.citum.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  citum.isCurrentUserOwner = req.user && citum.user && citum.user._id.toString() === req.user._id.toString();

  res.jsonp(citum);
};

/**
 * Update a Citum
 */
exports.update = function(req, res) {
  var citum = req.citum;

  citum = _.extend(citum, req.body);

  citum.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(citum);
    }
  });
};

/**
 * Delete an Citum
 */
exports.delete = function(req, res) {
  var citum = req.citum;

  citum.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(citum);
    }
  });
};

/**
 * List of Cita
 */
exports.list = function(req, res) {
  Citum.find().sort('-created').populate('user', 'displayName').exec(function(err, cita) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cita);
    }
  });
};

/**
 * Citum middleware
 */
exports.citumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Citum is invalid'
    });
  }

  Citum.findById(id).populate('user', 'displayName').exec(function (err, citum) {
    if (err) {
      return next(err);
    } else if (!citum) {
      return res.status(404).send({
        message: 'No Citum with that identifier has been found'
      });
    }
    req.citum = citum;
    next();
  });
};
