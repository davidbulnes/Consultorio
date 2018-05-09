'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Fotoshistorium = mongoose.model('Fotoshistorium'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  fotoshistorium;

/**
 * Fotoshistorium routes tests
 */
describe('Fotoshistorium CRUD tests', function () {

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

    // Save a user to the test db and create new Fotoshistorium
    user.save(function () {
      fotoshistorium = {
        name: 'Fotoshistorium name'
      };

      done();
    });
  });

  it('should be able to save a Fotoshistorium if logged in', function (done) {
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

        // Save a new Fotoshistorium
        agent.post('/api/fotoshistoria')
          .send(fotoshistorium)
          .expect(200)
          .end(function (fotoshistoriumSaveErr, fotoshistoriumSaveRes) {
            // Handle Fotoshistorium save error
            if (fotoshistoriumSaveErr) {
              return done(fotoshistoriumSaveErr);
            }

            // Get a list of Fotoshistoria
            agent.get('/api/fotoshistoria')
              .end(function (fotoshistoriaGetErr, fotoshistoriaGetRes) {
                // Handle Fotoshistoria save error
                if (fotoshistoriaGetErr) {
                  return done(fotoshistoriaGetErr);
                }

                // Get Fotoshistoria list
                var fotoshistoria = fotoshistoriaGetRes.body;

                // Set assertions
                (fotoshistoria[0].user._id).should.equal(userId);
                (fotoshistoria[0].name).should.match('Fotoshistorium name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Fotoshistorium if not logged in', function (done) {
    agent.post('/api/fotoshistoria')
      .send(fotoshistorium)
      .expect(403)
      .end(function (fotoshistoriumSaveErr, fotoshistoriumSaveRes) {
        // Call the assertion callback
        done(fotoshistoriumSaveErr);
      });
  });

  it('should not be able to save an Fotoshistorium if no name is provided', function (done) {
    // Invalidate name field
    fotoshistorium.name = '';

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

        // Save a new Fotoshistorium
        agent.post('/api/fotoshistoria')
          .send(fotoshistorium)
          .expect(400)
          .end(function (fotoshistoriumSaveErr, fotoshistoriumSaveRes) {
            // Set message assertion
            (fotoshistoriumSaveRes.body.message).should.match('Please fill Fotoshistorium name');

            // Handle Fotoshistorium save error
            done(fotoshistoriumSaveErr);
          });
      });
  });

  it('should be able to update an Fotoshistorium if signed in', function (done) {
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

        // Save a new Fotoshistorium
        agent.post('/api/fotoshistoria')
          .send(fotoshistorium)
          .expect(200)
          .end(function (fotoshistoriumSaveErr, fotoshistoriumSaveRes) {
            // Handle Fotoshistorium save error
            if (fotoshistoriumSaveErr) {
              return done(fotoshistoriumSaveErr);
            }

            // Update Fotoshistorium name
            fotoshistorium.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Fotoshistorium
            agent.put('/api/fotoshistoria/' + fotoshistoriumSaveRes.body._id)
              .send(fotoshistorium)
              .expect(200)
              .end(function (fotoshistoriumUpdateErr, fotoshistoriumUpdateRes) {
                // Handle Fotoshistorium update error
                if (fotoshistoriumUpdateErr) {
                  return done(fotoshistoriumUpdateErr);
                }

                // Set assertions
                (fotoshistoriumUpdateRes.body._id).should.equal(fotoshistoriumSaveRes.body._id);
                (fotoshistoriumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Fotoshistoria if not signed in', function (done) {
    // Create new Fotoshistorium model instance
    var fotoshistoriumObj = new Fotoshistorium(fotoshistorium);

    // Save the fotoshistorium
    fotoshistoriumObj.save(function () {
      // Request Fotoshistoria
      request(app).get('/api/fotoshistoria')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Fotoshistorium if not signed in', function (done) {
    // Create new Fotoshistorium model instance
    var fotoshistoriumObj = new Fotoshistorium(fotoshistorium);

    // Save the Fotoshistorium
    fotoshistoriumObj.save(function () {
      request(app).get('/api/fotoshistoria/' + fotoshistoriumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', fotoshistorium.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Fotoshistorium with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/fotoshistoria/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Fotoshistorium is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Fotoshistorium which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Fotoshistorium
    request(app).get('/api/fotoshistoria/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Fotoshistorium with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Fotoshistorium if signed in', function (done) {
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

        // Save a new Fotoshistorium
        agent.post('/api/fotoshistoria')
          .send(fotoshistorium)
          .expect(200)
          .end(function (fotoshistoriumSaveErr, fotoshistoriumSaveRes) {
            // Handle Fotoshistorium save error
            if (fotoshistoriumSaveErr) {
              return done(fotoshistoriumSaveErr);
            }

            // Delete an existing Fotoshistorium
            agent.delete('/api/fotoshistoria/' + fotoshistoriumSaveRes.body._id)
              .send(fotoshistorium)
              .expect(200)
              .end(function (fotoshistoriumDeleteErr, fotoshistoriumDeleteRes) {
                // Handle fotoshistorium error error
                if (fotoshistoriumDeleteErr) {
                  return done(fotoshistoriumDeleteErr);
                }

                // Set assertions
                (fotoshistoriumDeleteRes.body._id).should.equal(fotoshistoriumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Fotoshistorium if not signed in', function (done) {
    // Set Fotoshistorium user
    fotoshistorium.user = user;

    // Create new Fotoshistorium model instance
    var fotoshistoriumObj = new Fotoshistorium(fotoshistorium);

    // Save the Fotoshistorium
    fotoshistoriumObj.save(function () {
      // Try deleting Fotoshistorium
      request(app).delete('/api/fotoshistoria/' + fotoshistoriumObj._id)
        .expect(403)
        .end(function (fotoshistoriumDeleteErr, fotoshistoriumDeleteRes) {
          // Set message assertion
          (fotoshistoriumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Fotoshistorium error error
          done(fotoshistoriumDeleteErr);
        });

    });
  });

  it('should be able to get a single Fotoshistorium that has an orphaned user reference', function (done) {
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

          // Save a new Fotoshistorium
          agent.post('/api/fotoshistoria')
            .send(fotoshistorium)
            .expect(200)
            .end(function (fotoshistoriumSaveErr, fotoshistoriumSaveRes) {
              // Handle Fotoshistorium save error
              if (fotoshistoriumSaveErr) {
                return done(fotoshistoriumSaveErr);
              }

              // Set assertions on new Fotoshistorium
              (fotoshistoriumSaveRes.body.name).should.equal(fotoshistorium.name);
              should.exist(fotoshistoriumSaveRes.body.user);
              should.equal(fotoshistoriumSaveRes.body.user._id, orphanId);

              // force the Fotoshistorium to have an orphaned user reference
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

                    // Get the Fotoshistorium
                    agent.get('/api/fotoshistoria/' + fotoshistoriumSaveRes.body._id)
                      .expect(200)
                      .end(function (fotoshistoriumInfoErr, fotoshistoriumInfoRes) {
                        // Handle Fotoshistorium error
                        if (fotoshistoriumInfoErr) {
                          return done(fotoshistoriumInfoErr);
                        }

                        // Set assertions
                        (fotoshistoriumInfoRes.body._id).should.equal(fotoshistoriumSaveRes.body._id);
                        (fotoshistoriumInfoRes.body.name).should.equal(fotoshistorium.name);
                        should.equal(fotoshistoriumInfoRes.body.user, undefined);

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
      Fotoshistorium.remove().exec(done);
    });
  });
});
