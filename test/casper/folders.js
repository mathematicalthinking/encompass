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

describe('Folders', function() {
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

  describe('Visiting a Folder in Baffling Brother', function() {
    before(function() {
      casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/folders/543ea9837112056b29000ac5');
      casper.waitForSelector('table#folder_contents');
    });

    it('should display the folder name', function() {
      'div#menubar>h1'.should.contain.text('Quotable!');
    });

    it('should announce that it has a bunch of submissions and selections', function() {
      'div#statusbar'.should.contain.text('13 submission(s)');
      'div#statusbar'.should.contain.text('14 selection(s)');
    });

    it('should display view controls', function() {
      'div#controls'.should.be.inDOM;
      "$('input[name=\"browser\"]').length".should.evaluate.to.equal(2);
      'label#showSubFolders>input'.should.be.inDOM;

      'div#subcontrols'.should.be.inDOM;
      'label#showEvidence>input'.should.be.inDOM;
      'label#showSubmComments>input'.should.be.inDOM;
      'label#showSubmFolders>input'.should.be.inDOM;
    });
  
    it('should have default view options selected', function() {
      'label#browseByStudent>input'.should.have.attribute('checked').and.contain('checked');
      'label#showSubFolders>input'.should.have.attribute('checked').and.contain('checked');
      'label#showEvidence>input'.should.have.attribute('checked').and.contain('checked');
      'label#showSubmFolders>input'.should.have.attribute('checked').and.contain('checked');
    });

    it('should display a table of submission/selection data', function() {
      'table#folder_contents'.should.be.inDOM;
      "$('table#folder_contents>tbody>tr').length".should.evaluate.to.be.at.least('13');
      'table#folder_contents>tbody'.should.contain.text('Quotable!');
      //'table#folder_contents>tbody'.should.contain.text('Gabriella');
      'table#folder_contents>tbody'.should.contain.text("If it was a negative it wouldn't work.");
    });
  });
});
