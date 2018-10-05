
/**
  * # User REST Tests
  * @description Tests all requests to the REST api
  * @todo Add more test coverage
  */

describe("Cache", function() {
  var jasmine  = require('jasmine-node'),
      mongoose = require('mongoose'),
      mock     = require('./fixtures'),
      settings = require('./settings'),
      models   = require('../../server/datasource/schemas'),
      cache    = require('../../server/datasource/api/cache'),
      Q        = require('q'),
      utils    = require('../../server/middleware/requestHandler');

  var caching;
  var userManager = models.User;
  var user = JSON.parse( JSON.stringify(mock.users.user) );
  delete user._id;

  this.beforeEach(function() {
    caching = jasmine.createSpyObj('caching', ['success', 'failure']);
    var saveUser = Q.nbind(userManager.findByIdandUpdate, userManager);

    saveUser(mock.users.user._id, {$set: user}, {upsert: true});

    this.addMatchers({
      toHaveMissingArgumentsError : function() {
        if(this.actual && this.actual.hasOwnProperty('name')) {
          return (this.actual.name === 'Missing Arguments');
        }

        return false;
      },

      toHaveResponseError : function() {
        if(this.actual && this.actual.hasOwnProperty('name')) {
          return (this.actual.name === 'Response Error');
        }

        return false;
      },

      toHaveFileError : function() {
        if(this.actual && this.actual.hasOwnProperty('code')) {
          return (this.actual.code === 'ENOENT');
        }

        return false;
      }
    });
  });

  it('will return a promise', function() {
    var promise = cache({});
    expect(promise.then).toBeDefined();
  });

  it('will fail with missing arguments', function(done) {
    var promiseA = cache({}),
        promiseB = cache({source:'without other parameters'});

    if(promiseA.then) {
      promiseA.then(caching.success, caching.failure)
        .then( function() {
          expect(caching.failure).toHaveBeenCalled();
          expect(caching.success).not.toHaveBeenCalled();

          var expected = (caching.failure.mostRecentCall.args) ? caching.failure.mostRecentCall.args[0]: null;

          expect(expected).toHaveMissingArgumentsError();
          done();
        }).done();
    }

    if(promiseB.then) {
      promiseB.then(caching.success, caching.failure)
        .then( function() {
          expect(caching.failure).toHaveBeenCalled();
          expect(caching.success).not.toHaveBeenCalled();

          var expected = (caching.failure.mostRecentCall.args) ? caching.failure.mostRecentCall.args[0] : null;

          expect(expected).toHaveMissingArgumentsError();
          done();
        }).done();
    }
  });

  it('will fail on invalid response', function(done) {
    var promise = cache({user: mock.users.user.username, teacher: mock.users.user.username});

    if(promise.then) {
      promise.then(caching.success, caching.failure)
        .then( function() {
          expect(caching.failure).toHaveBeenCalled();
          expect(caching.success).not.toHaveBeenCalled();

          var expected = (caching.failure.mostRecentCall.args) ? caching.failure.mostRecentCall.args[0] : null;

          expect(expected).toHaveResponseError();
          done();
        }).done();
    }
  });

  it('will fail on invalid file', function(done) {
    var promise = cache({user: mock.users.user.username, source: 'fake/file/path'});

    if(promise.then) {
      promise.then(caching.success, caching.failure)
        .then( function() {
          expect(caching.failure).toHaveBeenCalled();
          expect(caching.success).not.toHaveBeenCalled();

          var expected = (caching.failure.mostRecentCall.args) ? caching.failure.mostRecentCall.args[0] : null;

          expect(expected).toHaveFileError();
          done();
        }).done();
    }
  });

  it('will succeed and report on a valid file', function(done) {
    var promise = cache({user: mock.users.user.username, source: 'test/data/pow/defaultPd.json'});

    if(promise.then) {
      promise.then(caching.success, caching.failure)
        .then( function() {
          expect(caching.failure).not.toHaveBeenCalled();
          expect(caching.success).toHaveBeenCalled();

          var report = (caching.success.mostRecentCall.args) ? caching.success.mostRecentCall.args[0] : {};

          expect(report.success).toBeTruthy();
          expect(report.importer).toEqual(mock.users.user.username);
          expect(report.imported).toEqual(112);
          expect(report.duplicates).toEqual(jasmine.any(Number));
          done();
        }).done();
    }
  });

  it('will succeed and report on a valid request', function(done) {
    var promise = cache({user: mock.users.user.username, puzzle: 973});


    if(promise.then) {
      promise.then(caching.success, caching.failure)
        .then( function() {
          expect(caching.failure).not.toHaveBeenCalled();
          expect(caching.success).toHaveBeenCalled();

          var report = (caching.success.mostRecentCall.args) ? caching.success.mostRecentCall.args[0] : {};

          expect(report.success).toBeTruthy();
          expect(report.importer).toEqual(mock.users.user.username);
          expect(report.imported).toEqual(jasmine.any(Number));
          expect(report.duplicates).toEqual(jasmine.any(Number));
          done();
        }).done();
    }
  });
});
