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
    default: 'Nueva Cita',
    required: 'Título es requerido',
    trim: true
  },
  color: {
    primary : {type: String},
    secondary: {type: String}
  },
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
  description: {
    type: String,
    default: '',
    trim: true
  },

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
