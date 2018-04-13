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
  historiaClinica: {
      type: Schema.ObjectId,
      ref: 'Historiaclinica',
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('IndicacionesDervProxCita', indicacionesDervProxCitaSchema);
