'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Historiaclinica Schema
 */
var diagnosticoDefinitivoSchema = new Schema({
  descripcion: {
    type: String,
    default: '',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('DiagnosticoDefinivo', diagnosticoDefinitivoSchema);
