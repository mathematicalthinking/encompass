/* jshint expr: true */
/* global casper */
/* global phantom */
/* global before */

var system = require('system');
var _      = require('underscore');
var host   = require('./host');
casper.options.viewportSize = {width: 1024, height: 768};
casper.options.waitTimeout = 90000;
casper.options.timeout = 90000;
casper.options.onWaitTimeout = function() {
  casper.echo('wait timed out, currently at:' + casper.getCurrentUrl());
};

var resourceErrors = [];

casper.on('resource.received', function(resource) {
  var status = resource.status;
  if(status >= 400 && !resource.url.match(/png$/)) {
    casper.log('Resource ' + resource.url + ' failed to load (' + status + ')', 'error');

    resourceErrors.push({
      url: resource.url,
      status: resource.status
    });
  }
});

describe('Users', function() {
  this.afterEach(function() {
    resourceErrors.forEach(function(e) {
      casper.echo(e.url + ' ' + e.status);
    });
    resourceErrors.length.should.equal(0);
  });

  //apparently we can't clear out the cookies
  // when running mocha-casperjs *.js
  //describe('Anonymously', function() {
  //  before(function() {
  //    phantom.clearCookies();
  //    casper.start(host+'/#/users');
  //    casper.thenOpen(host + '/#/users');
  //    casper.waitForSelector('a.user');
  //  });
  //
  //  function validateAnon(){
  //    it('should show various fields', function(){
  //      'Display Name'.should.be.textInDOM;
  //    });
  //  }

  //  describe('Visiting the users page', function() {
  //    it('there is only one user in the list', function() {
  //      "$('a.user').length".should.evaluate.to.equal(1);
  //      'a.user'.should.have.text('anon');
  //    });

  //    describe('clicking the user link', function() {
  //      before(function() {
  //        casper.click('a.user');
  //        casper.waitForSelector('article.user');
  //      });
  //      validateAnon();
  //    });
  //  });

  //  describe('Visiting a user page directly', function() {
  //    before(function() {
  //      casper.open(host + '/#/users/anon');
  //    });
  //    validateAnon();
  //  });

  //});
  
  describe('Logged in as a regular user', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
    });

    function validateUsersPage(){
      it('should show various fields', function(){
        'casper'.should.be.textInDOM;
        'Name'.should.be.textInDOM;
        'Last Seen'.should.be.textInDOM;
        'Seen Tour'.should.be.textInDOM;
        'Username'.should.be.textInDOM;
        'Display Name'.should.be.textInDOM;
        'button.editUser'.should.not.be.inDOM; //ENC-534
      });
    }
  
    describe('Visiting the users page', function() {
      before(function() {
        casper.thenOpen(host + '/#/users');
        casper.waitForSelector('a.user');
      });
    
      it('should have a list of users', function() {
        "$('a.user').length".should.evaluate.to.be.at.least(10);
      });

      describe('clicking the user link', function() {
        before(function() {
          casper.click('a[href$="casper"]');
          casper.waitForSelector('article.user');
        });
        validateUsersPage();
      });

      describe('Visiting a user page directly', function() {
        before(function() {
          casper.open(host + '/#/users/anon');
          casper.waitForSelector('article.user');
        });
        validateUsersPage();
      });
    });
  });
  
  describe('Logged in as an admin user', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casperadmin');
    });

    function validateUsersPage(){
      it('should show/hide various editable fields', function(){
        'casper'.should.be.textInDOM;
        casper.click('button.editUser');
        'input.userName'.should.be.inDOM;
        'button.clearTour'.should.be.inDOM;
        'input.isAdmin'.should.be.inDOM;
        'input.isAuthorized'.should.be.inDOM;
        casper.click('button.saveUser');
      });
    }

    function validateNewUserPage() {
      it('should display the page title and form', function() {
        'Create New User'.should.be.textInDOM;
        'form#newUser'.should.be.inDOM;
      });

      it('should show certain fields', function() {
        'input.displayName'.should.be.inDOM;
        'input.userName'.should.be.inDOM;
        'input.isAuthorized'.should.be.inDOM;
      });

      it('should let you create a new authorized user', function() {
        casper.sendKeys('form#newUser input.displayName', 'TEST');
        casper.sendKeys('form#newUser input.userName', 'caspertest');
        casper.click('button.newUser');
        'ul.listing>li.is-authorized:last-of-type'.should.contain.text('caspertest');
      });
    }
  
    describe('Visiting the users page', function() {
      before(function() {
        casper.thenOpen(host + '/#/users');
        casper.waitForSelector('a.user');
      });
    
      it('should have a create new user link', function() {
        'a[href$="/users/new"]'.should.be.inDOM;
      });

      it('should have a list of users', function() {
        "$('a.user').length".should.evaluate.to.be.at.least(10);
      });

      describe('clicking the user link', function() {
        before(function() {
          casper.click('a[href$="casper"]');
          casper.waitForSelector('article.user');
        });
        validateUsersPage();
      });

      describe('Visiting a user page directly', function() {
        before(function() {
          casper.open(host + '/#/users/anon');
          casper.waitForSelector('article.user');
        });
        validateUsersPage();
      }); 

      describe('clicking the new user link', function() {
        before(function() {
          casper.click('a[href$="/users/new"]');
          casper.waitForSelector('form#newUser');
        });
        validateNewUserPage();
      });
    });
  });
});
