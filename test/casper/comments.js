/* jshint expr: true */
/* global casper */
/* global before */

var system = require('system');
var _      = require('underscore');
var host   = require('./host');

casper.options.viewportSize = {width: 1024, height: 768};
casper.options.waitTimeout = 90000;
casper.options.timeout = 90000;

casper.echo('\n\n\nhost: ' + host);

var resourceErrors = [];
var errorMessages  = [];

casper.on('resource.error', function(resource) {
  var status = resource.errorCode;
  if(!resource.url.match(/png$/)) {
    casper.log('Resource ' + resource.url + ' failed to load (' + status + ')', 'error');

    resourceErrors.push({
      url: resource.url,
      status: resource.status
    });
  }
});

//casper.on('remote.message', function(message) {
//    this.echo('remote message caught: ' + message);
//});

casper.on('page.error', function(msg) {
  errorMessages.push(msg);
});

describe('Comments', function() {
  before(function() {
    casper.start(host + '/devonly/fakelogin/casper');
  });

  this.afterEach(function() {
    resourceErrors.forEach(function(e) {
      casper.echo(e.url + ' ' + e.status);
    });
    resourceErrors.length.should.equal(0);
    errorMessages.forEach(function(e) {
      casper.echo('Error Message: ' + e);
    });
    errorMessages.length.should.equal(0);
  });

  describe('Visiting a Selection in Baffling Brother', function() {
    var comment = 'new comment from casper ' + new Date().getTime();
    before(function() {
      casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/submissions/543e9644729e9ef59ba812f7/selections/543ea4937112056b29000aa0');
      casper.waitForSelector('button.comment.save');
    });
  
    it('should let us comment', function() {
      casper.sendKeys('#commentTextarea', comment);
      casper.click('button.comment.save');
      casper.waitUntilVisible('#commentTextarea:empty');
    });
  
    it('should clear out the comment field', function() {
      "$('#commentTextarea').text().length".should.evaluate.to.equal(0);
    });

    it('should show the comment', function() {
      casper.waitForText(comment, function() {
        comment.should.be.textInDOM;
      });
    });
  
  });
});
