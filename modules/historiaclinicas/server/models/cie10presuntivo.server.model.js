'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * 
 */
var Cie10presuntivoSchema = new Schema({
  descripcion: {
    type: String,
    trim: true
  }
});

Cie10presuntivoSchema.statics.seed = seed;

mongoose.model('Cie10presuntivo', Cie10presuntivoSchema);

function seed(doc, options) {
    var Cie10presuntivo = mongoose.model('Cie10presuntivo');
  
    return new Promise(function (resolve, reject) {
  
      skipDocument()
        .then(add)
        .then(function (response) {
          return resolve(response);
        })
        .catch(function (err) {
          return reject(err);
        });
  
  
      function skipDocument() {
        return new Promise(function (resolve, reject) {
            Cie10presuntivo
            .findOne({
              descripcion: doc.descripcion
            })
            .exec(function (err, existing) {
              if (err) {
                return reject(err);
              }
  
              if (!existing) {
                return resolve(false);
              }
  
              if (existing && !options.overwrite) {
                return resolve(true);
              }
  
              // Remove Cie10presuntivo (overwrite)
  
              existing.remove(function (err) {
                if (err) {
                  return reject(err);
                }
  
                return resolve(false);
              });
            });
        });
      }
  
      function add(skip) {
        return new Promise(function (resolve, reject) {
          if (skip) {
            return resolve({
              message: chalk.yellow('Database Seeding: Cie10presuntivo\t' + doc.descripcion + ' skipped')
            });
          }
  
          var cie10presuntivo = new Cie10presuntivo(doc);
  
          cie10presuntivo.save(function (err) {
            if (err) {
              return reject(err);
            }
  
            return resolve({
              message: 'Database Seeding: Cie10presuntivo\t' + cie10presuntivo.descripcion + ' added'
            });
          });
        });
      }
    });
  }