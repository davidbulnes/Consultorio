'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Calendario = mongoose.model('Calendario'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  calendario;

/**
 * Calendario routes tests
 */
describe('Calendario CRUD tests', function () {

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

    // Save a user to the test db and create new Calendario
    user.save(function () {
      calendario = {
        name: 'Calendario name'
      };

      done();
    });
  });

  it('should be able to save a Calendario if logged in', function (done) {
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

        // Save a new Calendario
        agent.post('/api/calendarios')
          .send(calendario)
          .expect(200)
          .end(function (calendarioSaveErr, calendarioSaveRes) {
            // Handle Calendario save error
            if (calendarioSaveErr) {
              return done(calendarioSaveErr);
            }

            // Get a list of Calendarios
            agent.get('/api/calendarios')
              .end(function (calendariosGetErr, calendariosGetRes) {
                // Handle Calendarios save error
                if (calendariosGetErr) {
                  return done(calendariosGetErr);
                }

                // Get Calendarios list
                var calendarios = calendariosGetRes.body;

                // Set assertions
                (calendarios[0].user._id).should.equal(userId);
                (calendarios[0].name).should.match('Calendario name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Calendario if not logged in', function (done) {
    agent.post('/api/calendarios')
      .send(calendario)
      .expect(403)
      .end(function (calendarioSaveErr, calendarioSaveRes) {
        // Call the assertion callback
        done(calendarioSaveErr);
      });
  });

  it('should not be able to save an Calendario if no name is provided', function (done) {
    // Invalidate name field
    calendario.name = '';

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

        // Save a new Calendario
        agent.post('/api/calendarios')
          .send(calendario)
          .expect(400)
          .end(function (calendarioSaveErr, calendarioSaveRes) {
            // Set message assertion
            (calendarioSaveRes.body.message).should.match('Please fill Calendario name');

            // Handle Calendario save error
            done(calendarioSaveErr);
          });
      });
  });

  it('should be able to update an Calendario if signed in', function (done) {
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

        // Save a new Calendario
        agent.post('/api/calendarios')
          .send(calendario)
          .expect(200)
          .end(function (calendarioSaveErr, calendarioSaveRes) {
            // Handle Calendario save error
            if (calendarioSaveErr) {
              return done(calendarioSaveErr);
            }

            // Update Calendario name
            calendario.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Calendario
            agent.put('/api/calendarios/' + calendarioSaveRes.body._id)
              .send(calendario)
              .expect(200)
              .end(function (calendarioUpdateErr, calendarioUpdateRes) {
                // Handle Calendario update error
                if (calendarioUpdateErr) {
                  return done(calendarioUpdateErr);
                }

                // Set assertions
                (calendarioUpdateRes.body._id).should.equal(calendarioSaveRes.body._id);
                (calendarioUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Calendarios if not signed in', function (done) {
    // Create new Calendario model instance
    var calendarioObj = new Calendario(calendario);

    // Save the calendario
    calendarioObj.save(function () {
      // Request Calendarios
      request(app).get('/api/calendarios')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Calendario if not signed in', function (done) {
    // Create new Calendario model instance
    var calendarioObj = new Calendario(calendario);

    // Save the Calendario
    calendarioObj.save(function () {
      request(app).get('/api/calendarios/' + calendarioObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', calendario.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Calendario with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/calendarios/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Calendario is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Calendario which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Calendario
    request(app).get('/api/calendarios/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Calendario with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Calendario if signed in', function (done) {
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

        // Save a new Calendario
        agent.post('/api/calendarios')
          .send(calendario)
          .expect(200)
          .end(function (calendarioSaveErr, calendarioSaveRes) {
            // Handle Calendario save error
            if (calendarioSaveErr) {
              return done(calendarioSaveErr);
            }

            // Delete an existing Calendario
            agent.delete('/api/calendarios/' + calendarioSaveRes.body._id)
              .send(calendario)
              .expect(200)
              .end(function (calendarioDeleteErr, calendarioDeleteRes) {
                // Handle calendario error error
                if (calendarioDeleteErr) {
                  return done(calendarioDeleteErr);
                }

                // Set assertions
                (calendarioDeleteRes.body._id).should.equal(calendarioSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Calendario if not signed in', function (done) {
    // Set Calendario user
    calendario.user = user;

    // Create new Calendario model instance
    var calendarioObj = new Calendario(calendario);

    // Save the Calendario
    calendarioObj.save(function () {
      // Try deleting Calendario
      request(app).delete('/api/calendarios/' + calendarioObj._id)
        .expect(403)
        .end(function (calendarioDeleteErr, calendarioDeleteRes) {
          // Set message assertion
          (calendarioDeleteRes.body.message).should.match('User is not authorized');

          // Handle Calendario error error
          done(calendarioDeleteErr);
        });

    });
  });

  it('should be able to get a single Calendario that has an orphaned user reference', function (done) {
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

          // Save a new Calendario
          agent.post('/api/calendarios')
            .send(calendario)
            .expect(200)
            .end(function (calendarioSaveErr, calendarioSaveRes) {
              // Handle Calendario save error
              if (calendarioSaveErr) {
                return done(calendarioSaveErr);
              }

              // Set assertions on new Calendario
              (calendarioSaveRes.body.name).should.equal(calendario.name);
              should.exist(calendarioSaveRes.body.user);
              should.equal(calendarioSaveRes.body.user._id, orphanId);

              // force the Calendario to have an orphaned user reference
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

                    // Get the Calendario
                    agent.get('/api/calendarios/' + calendarioSaveRes.body._id)
                      .expect(200)
                      .end(function (calendarioInfoErr, calendarioInfoRes) {
                        // Handle Calendario error
                        if (calendarioInfoErr) {
                          return done(calendarioInfoErr);
                        }

                        // Set assertions
                        (calendarioInfoRes.body._id).should.equal(calendarioSaveRes.body._id);
                        (calendarioInfoRes.body.name).should.equal(calendario.name);
                        should.equal(calendarioInfoRes.body.user, undefined);

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
      Calendario.remove().exec(done);
    });
  });
});
