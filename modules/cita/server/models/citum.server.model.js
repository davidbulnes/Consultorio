'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Citum Schema
 */
var CitumSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Citum name',
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

mongoose.model('Citum', CitumSchema);
