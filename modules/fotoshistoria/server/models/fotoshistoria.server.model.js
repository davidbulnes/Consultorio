'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Historiaclinica Schema
 */
var fotosHistoriaSchema = new Schema({
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
    }
});

mongoose.model('FotosHistoria', fotosHistoriaSchema);
