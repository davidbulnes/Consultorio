'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  schedule = require('node-schedule'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Historiaclinica = mongoose.model('Historiaclinica'),
  Cie10presuntivo = mongoose.model('Cie10presuntivo'),
  Calendario = mongoose.model('Calendario'),
  nodemailer = require('nodemailer'),
  moment = require('moment')


/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });

  var smtpTransport = nodemailer.createTransport(config.mailer.options);

  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(0, 6)];
  rule.hour = 22;
  rule.minute = 34;

  schedule.scheduleJob(rule, function () {
    console.log('Recordatorio');
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.reportBarras = function(req, res) {
  var currentTime = new Date();
  var yearnow = currentTime.getFullYear().toString();
  var totalcie = [];
  var objciemasculino = [{_id: 1 , suma: 0},{_id: 2 , suma: 0},{_id: 3 , suma: 0},{_id: 4 , suma: 0},
    {_id: 5 , suma: 0},{_id: 6 , suma: 0},{_id: 7 , suma: 0},{_id: 8 , suma: 0},
    {_id: 9 , suma: 0},{_id: 10 , suma: 0},{_id: 11 , suma: 0},{_id: 12 , suma: 0}];
  var objciefemenino = [{_id: 1 , suma: 0},{_id: 2 , suma: 0},{_id: 3 , suma: 0},{_id: 4 , suma: 0},
      {_id: 5 , suma: 0},{_id: 6 , suma: 0},{_id: 7 , suma: 0},{_id: 8 , suma: 0},
      {_id: 9 , suma: 0},{_id: 10 , suma: 0},{_id: 11 , suma: 0},{_id: 12 , suma: 0}];
  Historiaclinica.aggregate({
    "$lookup" : {
      "from" : "pacientes",
      "localField" : "paciente",
      "foreignField" : "_id",
      "as" : "paciente"
    }},{
    "$unwind" : "$paciente"},{
      "$match" : { "$and" : [{
        "paciente.sexo" : false}, {"yearCreated" : yearnow}]
    }},{
      "$group" : {"_id" : {"$month" : "$fechaCreated"},"suma" : {"$sum" : 1}}},
      {"$sort" : {"_id" : 1}}
  ).exec(function(err, ciemasculino) {
    Historiaclinica.aggregate({
      "$lookup" : {
        "from" : "pacientes",
        "localField" : "paciente",
        "foreignField" : "_id",
        "as" : "paciente"
      }},{
      "$unwind" : "$paciente"},{
      "$match" : { "$and" : [{
        "paciente.sexo" : true}, {"yearCreated" : yearnow}]
      }},{
        "$group" : {"_id" : {"$month" : "$fechaCreated"},"suma" : {"$sum" : 1}}},
        {"$sort" : {"_id" : 1}}
    ).exec(function(err, ciefemenino) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (let i = 0; i < objciemasculino.length; i++) { 
        var foundm = ciemasculino.filter(function(obj){return obj._id == i});
        if(foundm[0]){
        if(objciemasculino[i]._id - 1 === foundm[0]._id){ 
          objciemasculino[i-1].suma = foundm[0].suma
      }}
    };
      for (let i = 0; i < objciefemenino.length; i++) { 
        var foundf = ciefemenino.filter(function(obj){return obj._id == i});
        if(foundf[0]){
        if(objciefemenino[i]._id - 1 === foundf[0]._id){ 
          objciefemenino[i-1].suma = foundf[0].suma
    }}
  }
      totalcie[0] = objciemasculino;
      totalcie[1] = objciefemenino;
      res.jsonp(totalcie);
    }
  })});
};
/*exports.getcie10byid = function(req, res, next, id){
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'cie10 is invalid'
    });
  }
  Cie10presuntivo.findById(id).exec(function(err, cie10) {
    if (err) {
      return next(err);
    } else if (!cie10) {
      return res.status(404).send({
        message: 'No Historiaclinica with that identifier has been found'
      });
    }
    req.cie10;
    console.log(req);
    next();
  });
}*/

exports.listbarrasbyId = function(req, res){
  var id = mongoose.Types.ObjectId(req.params.cie10id);
  var year = req.params.yearcie10.toString();
  //var cie10 = req.params.cie10id;
  var totalcie = [];
  var objciemasculino = [{_id: 1 , suma: 0},{_id: 2 , suma: 0},{_id: 3 , suma: 0},{_id: 4 , suma: 0},
    {_id: 5 , suma: 0},{_id: 6 , suma: 0},{_id: 7 , suma: 0},{_id: 8 , suma: 0},
    {_id: 9 , suma: 0},{_id: 10 , suma: 0},{_id: 11 , suma: 0},{_id: 12 , suma: 0}];
  var objciefemenino = [{_id: 1 , suma: 0},{_id: 2 , suma: 0},{_id: 3 , suma: 0},{_id: 4 , suma: 0},
      {_id: 5 , suma: 0},{_id: 6 , suma: 0},{_id: 7 , suma: 0},{_id: 8 , suma: 0},
      {_id: 9 , suma: 0},{_id: 10 , suma: 0},{_id: 11 , suma: 0},{_id: 12 , suma: 0}];
  Historiaclinica.aggregate({
    "$lookup" : {
      "from" : "pacientes",
      "localField" : "paciente",
      "foreignField" : "_id",
      "as" : "paciente"
    }},{
    "$unwind" : "$paciente"},{
    "$match" : {"$and" : [{
      "paciente.sexo" : false}, { "yearCreated" : year}, { "$or" : [{
        "cie10presuntivo" : id}, {"cie10definitivo" : id}
    ]}]}},{
      "$group" : {"_id" : {"$month" : "$fechaCreated"},"suma" : {"$sum" : 1}}},
      {"$sort" : {"_id" : 1}}
  ).exec(function(err, ciemasculino) {
    Historiaclinica.aggregate({
      "$lookup" : {
        "from" : "pacientes",
        "localField" : "paciente",
        "foreignField" : "_id",
        "as" : "paciente"
      }},{
      "$unwind" : "$paciente"},{
        "$match" : {"$and" : [{
          "paciente.sexo" : true}, {"yearCreated" : year}, { "$or" : [{
          "cie10presuntivo" : id}, {"cie10definitivo" : id} 
        ]}]}},{
        "$group" : {"_id" : {"$month" : "$fechaCreated"},"suma" : {"$sum" : 1}}},
        {"$sort" : {"_id" : 1}}
    ).exec(function(err, ciefemenino) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (let i = 0; i < objciemasculino.length; i++) { 
        var foundm = ciemasculino.filter(function(obj){return obj._id == i});
        if(foundm[0]){
        if(objciemasculino[i]._id - 1 === foundm[0]._id){ 
          objciemasculino[i-1].suma = foundm[0].suma
      }}
    };
      for (let i = 0; i < objciefemenino.length; i++) { 
        var foundf = ciefemenino.filter(function(obj){return obj._id == i});
        if(foundf[0]){
        if(objciefemenino[i]._id - 1 === foundf[0]._id){ 
          objciefemenino[i-1].suma = foundf[0].suma
    }}
  }
      totalcie[0] = objciemasculino;
      totalcie[1] = objciefemenino;
      res.jsonp(totalcie);
    }
  })});
}

exports.listPastel = function(req, res){
  var currentTime = new Date();
  var yearnow = currentTime.getFullYear().toString();
  var total = [];
  var objpacientes = [{_id:0, desc:'En espera', suma: 0},{_id:1, desc:'Curado', suma: 0},{_id:2, desc:'No Curado', suma: 0}]
  Historiaclinica.aggregate({
    "$match" : { "yearCreated" : yearnow}},{
    "$group" : {"_id" : "$estadoPaciente" , "suma" : {"$sum" : 1}}
  }).exec(function(err, datareport) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      for (let i = 0; i < datareport.length; i++) {
        if(datareport[i]._id === "En espera"){
          objpacientes[0].suma = datareport[i].suma;
        }else if(datareport[i]._id === "Curado"){
          objpacientes[1].suma = datareport[i].suma;
        }else if(datareport[i]._id === "No Curado"){
          objpacientes[2].suma = datareport[i].suma;
        }
      }
      res.jsonp(objpacientes);
    }
  });
}

exports.getMeedDay = function(req, res){
  var currentTime = moment(new Date()).startOf('day');
  var startDate = currentTime.toDate();
  var endDate = currentTime.add(23, 'hours').toDate();
  Calendario.find({startsAt : {'$gt' : startDate, '$lt': endDate}}).populate('paciente').exec(function(err, meets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meets);
    }
  });
}