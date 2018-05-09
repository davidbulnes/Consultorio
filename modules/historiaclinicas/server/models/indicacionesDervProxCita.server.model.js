'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Historiaclinica Schema
 */
var indicacionesDervProxCitaSchema = new Schema({
  descripcion: {
    type: String,
    default: '',
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  idhistoriaclinica: {
    type: String,
},
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('IndicacionesDervProxCita', indicacionesDervProxCitaSchema);
