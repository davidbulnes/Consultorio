'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Historiaclinica = mongoose.model('Historiaclinica'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  historiaclinica;

/**
 * Historiaclinica routes tests
 */
describe('Historiaclinica CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Historiaclinica
    user.save(function () {
      historiaclinica = {
        name: 'Historiaclinica name'
      };

      done();
    });
  });

  it('should be able to save a Historiaclinica if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Historiaclinica
        agent.post('/api/historiaclinicas')
          .send(historiaclinica)
          .expect(200)
          .end(function (historiaclinicaSaveErr, historiaclinicaSaveRes) {
            // Handle Historiaclinica save error
            if (historiaclinicaSaveErr) {
              return done(historiaclinicaSaveErr);
            }

            // Get a list of Historiaclinicas
            agent.get('/api/historiaclinicas')
              .end(function (historiaclinicasGetErr, historiaclinicasGetRes) {
                // Handle Historiaclinicas save error
                if (historiaclinicasGetErr) {
                  return done(historiaclinicasGetErr);
                }

                // Get Historiaclinicas list
                var historiaclinicas = historiaclinicasGetRes.body;

                // Set assertions
                (historiaclinicas[0].user._id).should.equal(userId);
                (historiaclinicas[0].name).should.match('Historiaclinica name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Historiaclinica if not logged in', function (done) {
    agent.post('/api/historiaclinicas')
      .send(historiaclinica)
      .expect(403)
      .end(function (historiaclinicaSaveErr, historiaclinicaSaveRes) {
        // Call the assertion callback
        done(historiaclinicaSaveErr);
      });
  });

  it('should not be able to save an Historiaclinica if no name is provided', function (done) {
    // Invalidate name field
    historiaclinica.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Historiaclinica
        agent.post('/api/historiaclinicas')
          .send(historiaclinica)
          .expect(400)
          .end(function (historiaclinicaSaveErr, historiaclinicaSaveRes) {
            // Set message assertion
            (historiaclinicaSaveRes.body.message).should.match('Please fill Historiaclinica name');

            // Handle Historiaclinica save error
            done(historiaclinicaSaveErr);
          });
      });
  });

  it('should be able to update an Historiaclinica if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Historiaclinica
        agent.post('/api/historiaclinicas')
          .send(historiaclinica)
          .expect(200)
          .end(function (historiaclinicaSaveErr, historiaclinicaSaveRes) {
            // Handle Historiaclinica save error
            if (historiaclinicaSaveErr) {
              return done(historiaclinicaSaveErr);
            }

            // Update Historiaclinica name
            historiaclinica.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Historiaclinica
            agent.put('/api/historiaclinicas/' + historiaclinicaSaveRes.body._id)
              .send(historiaclinica)
              .expect(200)
              .end(function (historiaclinicaUpdateErr, historiaclinicaUpdateRes) {
                // Handle Historiaclinica update error
                if (historiaclinicaUpdateErr) {
                  return done(historiaclinicaUpdateErr);
                }

                // Set assertions
                (historiaclinicaUpdateRes.body._id).should.equal(historiaclinicaSaveRes.body._id);
                (historiaclinicaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Historiaclinicas if not signed in', function (done) {
    // Create new Historiaclinica model instance
    var historiaclinicaObj = new Historiaclinica(historiaclinica);

    // Save the historiaclinica
    historiaclinicaObj.save(function () {
      // Request Historiaclinicas
      request(app).get('/api/historiaclinicas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Historiaclinica if not signed in', function (done) {
    // Create new Historiaclinica model instance
    var historiaclinicaObj = new Historiaclinica(historiaclinica);

    // Save the Historiaclinica
    historiaclinicaObj.save(function () {
      request(app).get('/api/historiaclinicas/' + historiaclinicaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', historiaclinica.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Historiaclinica with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/historiaclinicas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Historiaclinica is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Historiaclinica which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Historiaclinica
    request(app).get('/api/historiaclinicas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Historiaclinica with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Historiaclinica if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Historiaclinica
        agent.post('/api/historiaclinicas')
          .send(historiaclinica)
          .expect(200)
          .end(function (historiaclinicaSaveErr, historiaclinicaSaveRes) {
            // Handle Historiaclinica save error
            if (historiaclinicaSaveErr) {
              return done(historiaclinicaSaveErr);
            }

            // Delete an existing Historiaclinica
            agent.delete('/api/historiaclinicas/' + historiaclinicaSaveRes.body._id)
              .send(historiaclinica)
              .expect(200)
              .end(function (historiaclinicaDeleteErr, historiaclinicaDeleteRes) {
                // Handle historiaclinica error error
                if (historiaclinicaDeleteErr) {
                  return done(historiaclinicaDeleteErr);
                }

                // Set assertions
                (historiaclinicaDeleteRes.body._id).should.equal(historiaclinicaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Historiaclinica if not signed in', function (done) {
    // Set Historiaclinica user
    historiaclinica.user = user;

    // Create new Historiaclinica model instance
    var historiaclinicaObj = new Historiaclinica(historiaclinica);

    // Save the Historiaclinica
    historiaclinicaObj.save(function () {
      // Try deleting Historiaclinica
      request(app).delete('/api/historiaclinicas/' + historiaclinicaObj._id)
        .expect(403)
        .end(function (historiaclinicaDeleteErr, historiaclinicaDeleteRes) {
          // Set message assertion
          (historiaclinicaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Historiaclinica error error
          done(historiaclinicaDeleteErr);
        });

    });
  });

  it('should be able to get a single Historiaclinica that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Historiaclinica
          agent.post('/api/historiaclinicas')
            .send(historiaclinica)
            .expect(200)
            .end(function (historiaclinicaSaveErr, historiaclinicaSaveRes) {
              // Handle Historiaclinica save error
              if (historiaclinicaSaveErr) {
                return done(historiaclinicaSaveErr);
              }

              // Set assertions on new Historiaclinica
              (historiaclinicaSaveRes.body.name).should.equal(historiaclinica.name);
              should.exist(historiaclinicaSaveRes.body.user);
              should.equal(historiaclinicaSaveRes.body.user._id, orphanId);

              // force the Historiaclinica to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Historiaclinica
                    agent.get('/api/historiaclinicas/' + historiaclinicaSaveRes.body._id)
                      .expect(200)
                      .end(function (historiaclinicaInfoErr, historiaclinicaInfoRes) {
                        // Handle Historiaclinica error
                        if (historiaclinicaInfoErr) {
                          return done(historiaclinicaInfoErr);
                        }

                        // Set assertions
                        (historiaclinicaInfoRes.body._id).should.equal(historiaclinicaSaveRes.body._id);
                        (historiaclinicaInfoRes.body.name).should.equal(historiaclinica.name);
                        should.equal(historiaclinicaInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Historiaclinica.remove().exec(done);
    });
  });
});
