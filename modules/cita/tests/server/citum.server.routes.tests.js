'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Citum = mongoose.model('Citum'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  citum;

/**
 * Citum routes tests
 */
describe('Citum CRUD tests', function () {

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

    // Save a user to the test db and create new Citum
    user.save(function () {
      citum = {
        name: 'Citum name'
      };

      done();
    });
  });

  it('should be able to save a Citum if logged in', function (done) {
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

        // Save a new Citum
        agent.post('/api/cita')
          .send(citum)
          .expect(200)
          .end(function (citumSaveErr, citumSaveRes) {
            // Handle Citum save error
            if (citumSaveErr) {
              return done(citumSaveErr);
            }

            // Get a list of Cita
            agent.get('/api/cita')
              .end(function (citaGetErr, citaGetRes) {
                // Handle Cita save error
                if (citaGetErr) {
                  return done(citaGetErr);
                }

                // Get Cita list
                var cita = citaGetRes.body;

                // Set assertions
                (cita[0].user._id).should.equal(userId);
                (cita[0].name).should.match('Citum name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Citum if not logged in', function (done) {
    agent.post('/api/cita')
      .send(citum)
      .expect(403)
      .end(function (citumSaveErr, citumSaveRes) {
        // Call the assertion callback
        done(citumSaveErr);
      });
  });

  it('should not be able to save an Citum if no name is provided', function (done) {
    // Invalidate name field
    citum.name = '';

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

        // Save a new Citum
        agent.post('/api/cita')
          .send(citum)
          .expect(400)
          .end(function (citumSaveErr, citumSaveRes) {
            // Set message assertion
            (citumSaveRes.body.message).should.match('Please fill Citum name');

            // Handle Citum save error
            done(citumSaveErr);
          });
      });
  });

  it('should be able to update an Citum if signed in', function (done) {
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

        // Save a new Citum
        agent.post('/api/cita')
          .send(citum)
          .expect(200)
          .end(function (citumSaveErr, citumSaveRes) {
            // Handle Citum save error
            if (citumSaveErr) {
              return done(citumSaveErr);
            }

            // Update Citum name
            citum.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Citum
            agent.put('/api/cita/' + citumSaveRes.body._id)
              .send(citum)
              .expect(200)
              .end(function (citumUpdateErr, citumUpdateRes) {
                // Handle Citum update error
                if (citumUpdateErr) {
                  return done(citumUpdateErr);
                }

                // Set assertions
                (citumUpdateRes.body._id).should.equal(citumSaveRes.body._id);
                (citumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cita if not signed in', function (done) {
    // Create new Citum model instance
    var citumObj = new Citum(citum);

    // Save the citum
    citumObj.save(function () {
      // Request Cita
      request(app).get('/api/cita')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Citum if not signed in', function (done) {
    // Create new Citum model instance
    var citumObj = new Citum(citum);

    // Save the Citum
    citumObj.save(function () {
      request(app).get('/api/cita/' + citumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', citum.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Citum with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cita/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Citum is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Citum which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Citum
    request(app).get('/api/cita/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Citum with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Citum if signed in', function (done) {
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

        // Save a new Citum
        agent.post('/api/cita')
          .send(citum)
          .expect(200)
          .end(function (citumSaveErr, citumSaveRes) {
            // Handle Citum save error
            if (citumSaveErr) {
              return done(citumSaveErr);
            }

            // Delete an existing Citum
            agent.delete('/api/cita/' + citumSaveRes.body._id)
              .send(citum)
              .expect(200)
              .end(function (citumDeleteErr, citumDeleteRes) {
                // Handle citum error error
                if (citumDeleteErr) {
                  return done(citumDeleteErr);
                }

                // Set assertions
                (citumDeleteRes.body._id).should.equal(citumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Citum if not signed in', function (done) {
    // Set Citum user
    citum.user = user;

    // Create new Citum model instance
    var citumObj = new Citum(citum);

    // Save the Citum
    citumObj.save(function () {
      // Try deleting Citum
      request(app).delete('/api/cita/' + citumObj._id)
        .expect(403)
        .end(function (citumDeleteErr, citumDeleteRes) {
          // Set message assertion
          (citumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Citum error error
          done(citumDeleteErr);
        });

    });
  });

  it('should be able to get a single Citum that has an orphaned user reference', function (done) {
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

          // Save a new Citum
          agent.post('/api/cita')
            .send(citum)
            .expect(200)
            .end(function (citumSaveErr, citumSaveRes) {
              // Handle Citum save error
              if (citumSaveErr) {
                return done(citumSaveErr);
              }

              // Set assertions on new Citum
              (citumSaveRes.body.name).should.equal(citum.name);
              should.exist(citumSaveRes.body.user);
              should.equal(citumSaveRes.body.user._id, orphanId);

              // force the Citum to have an orphaned user reference
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

                    // Get the Citum
                    agent.get('/api/cita/' + citumSaveRes.body._id)
                      .expect(200)
                      .end(function (citumInfoErr, citumInfoRes) {
                        // Handle Citum error
                        if (citumInfoErr) {
                          return done(citumInfoErr);
                        }

                        // Set assertions
                        (citumInfoRes.body._id).should.equal(citumSaveRes.body._id);
                        (citumInfoRes.body.name).should.equal(citum.name);
                        should.equal(citumInfoRes.body.user, undefined);

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
      Citum.remove().exec(done);
    });
  });
});
