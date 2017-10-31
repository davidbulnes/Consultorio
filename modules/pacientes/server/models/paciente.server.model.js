'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Paciente Schema
 */
var PacienteSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Paciente name',
    trim: true
  },
  lastName: {
    type: String,
    required: 'Please fill Paciente lastName',
    trim: true,
    default: ''
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true
    }
  },
  phone: {
    type: String,
    default: '000000000',
    required: 'Plean fill phone',
    trim: true
  },
  dni: {
    type: String,
    trim: true,
    default: '00000000',
    required: 'Please fill dni'
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

mongoose.model('Paciente', PacienteSchema);
