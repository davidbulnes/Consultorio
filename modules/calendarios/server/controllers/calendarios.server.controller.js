'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Calendario = mongoose.model('Calendario'),
  Paciente = mongoose.model('Paciente'),
  nodemailer = require('nodemailer'),
  moment = require('moment'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);
/**
 * Create a Calendario
 */
exports.create = function (req, res) {
  var calendario = new Calendario(req.body);
  calendario.user = req.user;
  var paciente = new Paciente(req.body.paciente);
  calendario.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(calendario);
      if(calendario.sendMail){
       sendMail(calendario, paciente, res);
      }
    }
  });
};

/**
 * Show the current Calendario
 */
exports.read = function (req, res) {
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
exports.update = function (req, res) {
  var calendario = req.calendario;

  calendario = _.extend(calendario, req.body);

  calendario.save(function (err) {
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
exports.delete = function (req, res) {
  var calendario = req.calendario;

  calendario.remove(function (err) {
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
exports.list = function (req, res) {
  Calendario.find().sort('-created').populate('user paciente', 'displayName name lastName dni phone email').exec(function (err, calendarios) {
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
exports.calendarioByID = function (req, res, next, id) {

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

var sendMail = function (calendario, paciente, res) {
  async.waterfall([
    function (done) {
      res.render(path.resolve('modules/users/server/templates/send-mail-date-confirm'), {
        name: paciente.name,
        appName: config.app.title,
        date: moment(calendario.startsAt).lang('es').format('dddd LL'),
        dateHour : moment(calendario.startsAt).lang('es').format('h:mm a'),
      }, function (err, emailHTML) {
        done(err, emailHTML);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, done) {
      var mailOptions = {
        to: paciente.email,
        from: config.mailer.from,
        subject: 'Cita Programada',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ]);
};