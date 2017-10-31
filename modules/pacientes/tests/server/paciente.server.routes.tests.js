'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Paciente = mongoose.model('Paciente'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  paciente;

/**
 * Paciente routes tests
 */
describe('Paciente CRUD tests', function () {

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

    // Save a user to the test db and create new Paciente
    user.save(function () {
      paciente = {
        name: 'Paciente name'
      };

      done();
    });
  });

  it('should be able to save a Paciente if logged in', function (done) {
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

        // Save a new Paciente
        agent.post('/api/pacientes')
          .send(paciente)
          .expect(200)
          .end(function (pacienteSaveErr, pacienteSaveRes) {
            // Handle Paciente save error
            if (pacienteSaveErr) {
              return done(pacienteSaveErr);
            }

            // Get a list of Pacientes
            agent.get('/api/pacientes')
              .end(function (pacientesGetErr, pacientesGetRes) {
                // Handle Pacientes save error
                if (pacientesGetErr) {
                  return done(pacientesGetErr);
                }

                // Get Pacientes list
                var pacientes = pacientesGetRes.body;

                // Set assertions
                (pacientes[0].user._id).should.equal(userId);
                (pacientes[0].name).should.match('Paciente name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Paciente if not logged in', function (done) {
    agent.post('/api/pacientes')
      .send(paciente)
      .expect(403)
      .end(function (pacienteSaveErr, pacienteSaveRes) {
        // Call the assertion callback
        done(pacienteSaveErr);
      });
  });

  it('should not be able to save an Paciente if no name is provided', function (done) {
    // Invalidate name field
    paciente.name = '';

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

        // Save a new Paciente
        agent.post('/api/pacientes')
          .send(paciente)
          .expect(400)
          .end(function (pacienteSaveErr, pacienteSaveRes) {
            // Set message assertion
            (pacienteSaveRes.body.message).should.match('Please fill Paciente name');

            // Handle Paciente save error
            done(pacienteSaveErr);
          });
      });
  });

  it('should be able to update an Paciente if signed in', function (done) {
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

        // Save a new Paciente
        agent.post('/api/pacientes')
          .send(paciente)
          .expect(200)
          .end(function (pacienteSaveErr, pacienteSaveRes) {
            // Handle Paciente save error
            if (pacienteSaveErr) {
              return done(pacienteSaveErr);
            }

            // Update Paciente name
            paciente.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Paciente
            agent.put('/api/pacientes/' + pacienteSaveRes.body._id)
              .send(paciente)
              .expect(200)
              .end(function (pacienteUpdateErr, pacienteUpdateRes) {
                // Handle Paciente update error
                if (pacienteUpdateErr) {
                  return done(pacienteUpdateErr);
                }

                // Set assertions
                (pacienteUpdateRes.body._id).should.equal(pacienteSaveRes.body._id);
                (pacienteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pacientes if not signed in', function (done) {
    // Create new Paciente model instance
    var pacienteObj = new Paciente(paciente);

    // Save the paciente
    pacienteObj.save(function () {
      // Request Pacientes
      request(app).get('/api/pacientes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Paciente if not signed in', function (done) {
    // Create new Paciente model instance
    var pacienteObj = new Paciente(paciente);

    // Save the Paciente
    pacienteObj.save(function () {
      request(app).get('/api/pacientes/' + pacienteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', paciente.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Paciente with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pacientes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Paciente is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Paciente which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Paciente
    request(app).get('/api/pacientes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Paciente with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Paciente if signed in', function (done) {
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

        // Save a new Paciente
        agent.post('/api/pacientes')
          .send(paciente)
          .expect(200)
          .end(function (pacienteSaveErr, pacienteSaveRes) {
            // Handle Paciente save error
            if (pacienteSaveErr) {
              return done(pacienteSaveErr);
            }

            // Delete an existing Paciente
            agent.delete('/api/pacientes/' + pacienteSaveRes.body._id)
              .send(paciente)
              .expect(200)
              .end(function (pacienteDeleteErr, pacienteDeleteRes) {
                // Handle paciente error error
                if (pacienteDeleteErr) {
                  return done(pacienteDeleteErr);
                }

                // Set assertions
                (pacienteDeleteRes.body._id).should.equal(pacienteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Paciente if not signed in', function (done) {
    // Set Paciente user
    paciente.user = user;

    // Create new Paciente model instance
    var pacienteObj = new Paciente(paciente);

    // Save the Paciente
    pacienteObj.save(function () {
      // Try deleting Paciente
      request(app).delete('/api/pacientes/' + pacienteObj._id)
        .expect(403)
        .end(function (pacienteDeleteErr, pacienteDeleteRes) {
          // Set message assertion
          (pacienteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Paciente error error
          done(pacienteDeleteErr);
        });

    });
  });

  it('should be able to get a single Paciente that has an orphaned user reference', function (done) {
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

          // Save a new Paciente
          agent.post('/api/pacientes')
            .send(paciente)
            .expect(200)
            .end(function (pacienteSaveErr, pacienteSaveRes) {
              // Handle Paciente save error
              if (pacienteSaveErr) {
                return done(pacienteSaveErr);
              }

              // Set assertions on new Paciente
              (pacienteSaveRes.body.name).should.equal(paciente.name);
              should.exist(pacienteSaveRes.body.user);
              should.equal(pacienteSaveRes.body.user._id, orphanId);

              // force the Paciente to have an orphaned user reference
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

                    // Get the Paciente
                    agent.get('/api/pacientes/' + pacienteSaveRes.body._id)
                      .expect(200)
                      .end(function (pacienteInfoErr, pacienteInfoRes) {
                        // Handle Paciente error
                        if (pacienteInfoErr) {
                          return done(pacienteInfoErr);
                        }

                        // Set assertions
                        (pacienteInfoRes.body._id).should.equal(pacienteSaveRes.body._id);
                        (pacienteInfoRes.body.name).should.equal(paciente.name);
                        should.equal(pacienteInfoRes.body.user, undefined);

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
      Paciente.remove().exec(done);
    });
  });
});
