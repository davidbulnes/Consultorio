'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Historiaclinica Schema
 */
var fotosHistoriaClinicaSchema = new Schema({
    fileImageURL: {
        type: String,
        default: 'modules/historiaclinicas/client/img/default.png'
    },
    nrohistoriaClinica: {
        type: String,
        default: '',
    },
    created: {
        type: Date,
        default: Date.now
    },
    position: {
        x: { type: Number,
             default: -137.5},
        y: { type: Number,
             default: -68}},
    scaling: {
        type: Number,
        default: 2},
    maxScaling: {
        type: Number,
        default: 5},
    scaleStep: {
        type: Number,
        default: 0.11},
    mwScaleStep: {
        type: Number,
        default: 0.09},
    moveStep: {
        type: Number,
        default: 99},
    fitOnload: {
        type: Boolean,
        default: true},
    progress: {
        type: Number,
        default: 0}
    });

mongoose.model('FotosHistoriaClinica', fotosHistoriaClinicaSchema);
