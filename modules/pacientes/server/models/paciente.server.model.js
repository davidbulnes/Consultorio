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
  direccion: {
    type: String,
    default: '',
    trim: true
  },
  phone: {
    type: String,
    default: '000000000',
    trim: true
  },
  dni: {
    type: String,
    trim: true,
    default: '00000000',
  },
  edad: {
    type: Number,
    trim: true,
    default: 0
  },
  ocupacion: {
    type: String,
    trim: true,
    default: ''
  },
  procedencia: {
    type: String,
    trim: true,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  sexo: {
    type: Boolean,
    default: null
  },
  estado: {
    type: String,
    default: 'No Asignado'
  },
  description: {
    type: String,
    default: '',
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Paciente', PacienteSchema);
