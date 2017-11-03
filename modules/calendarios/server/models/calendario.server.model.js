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
  color: [{
    primary: String,
    secondary: String
  }],
   startsAt: {
    type: Date,
    default: Date.now
  },
   endsAt: {
    type: Date,
    default: Date.now
  },
  
  draggable: Boolean,
  resizable: Boolean,
  actions: [{}, {}],

  created: {
    type: Date,
    default: Date.now
  },
  paciente: {
    type: Schema.ObjectId,
    ref: 'Paciente'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Calendario', CalendarioSchema);
