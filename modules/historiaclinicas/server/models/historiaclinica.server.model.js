'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Historiaclinica Schema
 */
var HistoriaclinicaSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  numeroHC: {
    type: String,
    default: '',
    required: 'Ingrese el número de Historia Clínica'
  },
  motivo: {
    type: String,
    default: '',
    trim: true
  },
  antecedentes: {
    type: String,
    default: '',
    trim: true
  },
  tiempoEnf: {
    type: String,
    default: '',
    trim: true
  },
  estatura: {
    type: Number,
    default: 0
  },
  peso: {
    type: Number,
    default: 0
  },
  PulsoPePD: {
    type: Number,
    default: 0,
  },
  PulsoPePI: {
    type: Number,
    default: 0
  },
  PtpPD: {
    type: Number,
    default: 0
  },
  PtpPI: {
    type: Number,
    default: 0
  },
  ColorPiel: {
    type: String,
    default: ''
  },
  temperatura: {
    type: String,
    default: ''
  },
  AVP: {
    type: String,
    default: ''
  },
  TatbPD: {
    type: Number,
    default: 0
  },
  TatbPI: {
    type: Number,
    default: 0
  },
  SencibDol: { //COMBO
    type: Number,
    default: 0
  },
  SencibTactil: { //COMBO
    type: Number,
    default: 0
  },
  ReflejCutPla: {
    type: String,
    default: ''
  },
  ExplOsteo: {
    type: String,
    default: ''
  },
  LesionesDermaPD: {
    type: String,
    default: ''
  },
  LedionesDermaPI: {
    type: String,
    default: ''
  },
  ExamAux: {
    type: String,
    default: ''
  },
  TerapeuticaPodo: {
    type:String,
    default: ''
  },
  IndicacionesDeriv: {
    type: String,
    default: ''
  },
  fechaCreated: {
    type: Date,
    default: Date.now
  },
  yearCreated: {
    type: String,
    default: ''
  },
  diagDefinitivo: {
    type: String,
    default: ''
  },
  cie10definitivo: {
    type: Schema.ObjectId,
    ref: 'Cie10presuntivo'
  },
  diagPresuantivo: {
    type: String,
    default: ''
  },
  cie10presuntivo: {
    type: Schema.ObjectId,
    ref: 'Cie10presuntivo'
  },
  diagPresuantivoad: {
    type: String,
    default: ''
  },
  paciente: {
    type: Schema.ObjectId,
    ref: 'Paciente'
  },
  fotos: {},
  terapeuticapodologica: {},
  indicaciones: {},
  pacienteFullName: {
    type: String,
    default: ''
  },
  estadoPaciente: {
   type: String,
   default: 'En espera'
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

mongoose.model('Historiaclinica', HistoriaclinicaSchema);
