'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Calendario Schema
 */
var CalendarioSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Título es requerido',
    trim: true
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

mongoose.model('Calendario', CalendarioSchema);
