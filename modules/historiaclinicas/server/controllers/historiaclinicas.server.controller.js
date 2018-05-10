'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  Historiaclinica = mongoose.model('Historiaclinica'),
  FotosHistoriaClinica = mongoose.model('FotosHistoriaClinica'),
  TerapeuticaPodologica = mongoose.model('TerapeuticaPodologica'),
  IndicacionesDervProxCita = mongoose.model('IndicacionesDervProxCita'),
  Cie10presuntivo = mongoose.model('Cie10presuntivo'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Historiaclinica
 */
var nroHistoria = null;
var useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
var s3;

if (useS3Storage) {
  aws.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey
  });

  s3 = new aws.S3();
}

exports.create = function(req, res) {
  var historiaclinica = new Historiaclinica(req.body);
  historiaclinica.user = req.user;
  historiaclinica.paciente = req.body.paciente;
  nroHistoria = historiaclinica.numeroHC;
  historiaclinica.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(historiaclinica);
    }
  })
};


/**
 * Show the current Historiaclinica
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var historiaclinica = req.historiaclinica ? req.historiaclinica.toJSON() : {};
 // var terapeuticapodologica = req.terapeuticapodologica ? req.terapeuticapodologica.toJSON() : {};

  //historiaclinica.terapeuticapodologica = terapeuticapodologica;
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
  var countTerapia;
  var countIndicaciones;
  var objTera = [];
  var objInd = [];
  TerapeuticaPodologica.find({idhistoriaclinica : req.historiaclinica._id}).exec(function (err, data) {
    if (err) {
      return next(err);
    } else if (!data) {
      return res.status(404).send({
        message: 'No Terapia with that identifier has been found'
      });
    }
    objTera = data;
    countTerapia = data.length;
  });
  IndicacionesDervProxCita.find({idhistoriaclinica : req.historiaclinica._id}).exec(function (err, data) {
    if (err) {
      return next(err);
    } else if (!data) {
      return res.status(404).send({
        message: 'No Indicaciones with that identifier has been found'
      });
    }
    objInd = data;
    countIndicaciones = data.length;
  });
  historiaclinica.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('Actualizazo Historia')
      res.jsonp(historiaclinica);
    }
  }).then(loopTeraPodo).then(saveTeraPodo).then(loopIndicaciones).then(saveIndicaciones);

  function loopTeraPodo(){
    if(req.body.terapeuticapodologica.length != 1){
    for (var i = 0; i < countTerapia; i++) {
      updateTeraPodo(i);
        }
      }
    }; 
  function loopIndicaciones(){
    if(req.body.indicaciones.length != 1){
      for (var i = 0; i < countIndicaciones; i++) {
        updateIndicaciones(i);
          }
        }
  }
  function updateTeraPodo(count){
    var terapeuticapodologica = objTera[count];
    terapeuticapodologica = _.extend(terapeuticapodologica, req.body.terapeuticapodologica[count]);
    terapeuticapodologica.save(function(err){
       if(err) {
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
            } else {
              console.log('Actualizo Terapia')
            }
     });
  };
  function updateIndicaciones(count){
    var indicaciones = objInd[count];
    indicaciones = _.extend(indicaciones, req.body.indicaciones[count]);
    indicaciones.save(function(err){
       if(err) {
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
            } else {
              console.log('Actualizo Indicaciones')
            }
     });
  };

  function saveTeraPodo(){
    var newterapeuticaPodologica  = new TerapeuticaPodologica(req.body.terapeuticapodologica[countTerapia]);
    newterapeuticaPodologica.save(function(err){
      if(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
          } else {
            console.log('Guardó Terapia')
            //res.jsonp(historiaclinica);
          }
    });
  }

  function saveIndicaciones(){
    var newIndicaciones  = new IndicacionesDervProxCita(req.body.indicaciones[countIndicaciones]);
    newIndicaciones.save(function(err){
      if(err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
          } else {
            console.log('Guardó Indicaciones')
            //res.jsonp(historiaclinica);
          }
    });
  }

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
  Historiaclinica.find().sort('-created').populate('user paciente').exec(function(err, historiaclinicas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(historiaclinicas);
    }
  });
};

exports.listCie10Presuntivo = function(req, res) {
  Cie10presuntivo.find().sort('+_id').exec(function(err, cie10presuntivo) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cie10presuntivo);
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

  Historiaclinica.findById(id).populate('user paciente cie10presuntivo cie10definitivo').exec(function (err, historiaclinica) {
    FotosHistoriaClinica.find({ nrohistoriaClinica : historiaclinica.numeroHC}).exec(function(err, fotosHistoria){
      TerapeuticaPodologica.find({idhistoriaclinica : id}).exec(function (err, terapeuticapodologica) {
        IndicacionesDervProxCita.find({idhistoriaclinica : id}).exec(function (err, indicaciones) {
    if (err) {
      return next(err);
    } else if (!historiaclinica) {
      return res.status(404).send({
        message: 'No Historiaclinica with that identifier has been found'
      });
    }
    //console.log(terapeuticapodologica)
    req.historiaclinica = historiaclinica
    req.historiaclinica.fotos = fotosHistoria;
    req.historiaclinica.terapeuticapodologica = terapeuticapodologica;
    req.historiaclinica.indicaciones = indicaciones;
    next();
  })})})});
};

/*exports.historiaclinicaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Historiaclinica is invalid'
    });
  }

  Historiaclinica.aggregate([{
    $lookup : {
      from : 'paciente',
      localField: '._id',
      foreignField: 'paciente',
      as: 'pacientes'
    }},
    {$unwind : '$pacientes'},
    {
      $lookup : {
        from : 'user',
        localField: '._id',
        foreignField: 'user',
        as: 'users'
    }},
    {$unwind : '$user'}
  ]).exec(function (err, historiaclinica2) {
    if (err) {
      return next(err);
    } else if (!historiaclinica2) {
      return res.status(404).send({
        message: 'No Historiaclinica with that identifier has been found'
      });
    }
    console.log(terapeuticapodologica)
    req.historiaclinica = historiaclinica
    req.historiaclinica.fotos = fotosHistoria;
    req.historiaclinica.terapeuticapodologica = terapeuticapodologica;
    next();
  });
};*/

/*exports.terapeuticaPodoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Historiaclinica is invalid'
    });
  }

  TerapeuticaPodologica.find({historiaClinica : id}).exec(function (err, terapeuticapodologica) {
    if (err) {
      return next(err);
    } else if (!terapeuticapodologica) {
      return res.status(404).send({
        message: 'No Terapia with that identifier has been found'
      });
    }
    console.log(terapeuticapodologica)
    req.terapeuticaPodologica = terapeuticapodologica
    next();
  });
};*/


/**
 * Save pictures
 */


exports.savePicture = function (req, res) {
  var fotosHistoriaClinica = new FotosHistoriaClinica();
  var existingImageUrl;
  var multerConfig;
  if(useS3Storage){
    multerConfig = {
      storage: multerS3({
        s3: s3,
        bucket: config.aws.s3.bucket,
        acl: 'public-read'
      })
    };
  } else {
    multerConfig = config.uploadsHC.profile.image;
  }
  fotosHistoriaClinica.nrohistoriaClinica = nroHistoria;
  console.log(fotosHistoriaClinica.nrohistoriaClinica);
   // Filtering to upload only images
   multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

   var upload = multer(multerConfig).single('newHCPicture');

   // existingImageUrl = fotosHistoriaClinica.fileImageURL;
    uploadImage()
     .then(updatePhoto)
      .then(function () {
        //res.json(user);
        console.log('Guardó')
      })
      .catch(function (err) {
        res.status(422).send(err);
      });

  function uploadImage() {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }
  function updatePhoto() {
    return new Promise(function (resolve, reject) {
      fotosHistoriaClinica.fileImageURL = config.uploads.storage === 's3' && config.aws.s3 ?
      req.file.location : '/' + req.file.path;
      fotosHistoriaClinica.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
