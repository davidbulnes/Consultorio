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
    profileImageURL: {
        type: String,
        default: 'modules/historiaclinicas/client/img/default.png'
    },
    historiaClinica: {
        type: Schema.ObjectId,
        ref: 'Historiaclinica',
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('FotosHistoriaClinica', fotosHistoriaClinicaSchema);
