/* jshint expr: true */
/* global casper */
/* global before */

var system = require('system');
var _      = require('underscore');
var host   = require('./host');
casper.options.viewportSize = {width: 1024, height: 768};
casper.options.waitTimeout = 90000;
casper.options.timeout = 90000;

describe('General', function() {
  describe('host', function() {
    it('should be defined', function() {
      casper.echo('host is ' + host);
      host.should.be.ok;
    });
  });
  
  describe('Visiting the EnCoMPASS Homepage without logging in', function() {
    before(function() {
      casper.start(host);
    });
  
    it('should ask the user to log in', function() {
      casper.then(function() {
        'EnCoMPASS'.should.matchTitle;
        'a[href="login"]'.should.be.inDOM.and.be.visible;
        //casper.captureSelector('login.png', 'body');
      });
    });
  });
  
  function verifyHeader() {
    it('should have links to workspaces, responses, users, logout', function() { 
      'a[href="#/workspaces"]'.should.be.inDOM.and.be.visible;
      'a[href="#/responses"]'.should.be.inDOM.and.be.visible;
      'a[href="#/users"]'.should.be.inDOM.and.be.visible;
      'a[href="#/logout"]'.should.be.inDOM.and.be.visible;
    });
  
    it('should welcome the user by name', function() {
      'EnCoMPASS'.should.matchTitle;
      'small#al_welcome'.should.contain.text('Welcome, casper');
    });
  
  }
  
  describe('Visiting the EnCoMPASS Homepage', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
    });
  
    it('should land us at the root', function() {
      //var regex = new RegExp('/^' + host + '$/');
      //expect(regex).to.matchCurrentUrl
      casper.echo(casper.getCurrentUrl());
    });
  
    it('should welcome the user to Encompass', function() {
      '#welcome>h1'.should.contain.text('Welcome to the EnCoMPASS Project');
      //casper.captureSelector('homepage.png', 'body');
    });
  
    verifyHeader();
  
  });
});
