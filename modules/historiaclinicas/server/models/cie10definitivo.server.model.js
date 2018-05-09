'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * 
 */
var cie10definitivoSchema = new Schema({
  descripcion: {
    type: String,
    trim: true
  }
});

mongoose.model('Cie10definitivo', cie10definitivoSchema);
