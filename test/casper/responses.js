/* jshint expr: true */
/* global casper */
/* global before */

var system = require('system');
var _      = require('underscore');
var host   = require('./host');
casper.options.viewportSize = {width: 1024, height: 768};
casper.options.timeout = 90000;
casper.options.waitTimeout = 90000;
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

describe('Responses', function() {
  before(function() {
    casper.start(host + '/devonly/fakelogin/casper');
  });

  this.afterEach(function() {
    resourceErrors.forEach(function(e) {
      casper.echo(e.url + ' ' + e.status);
    });
    resourceErrors.length.should.equal(0);
  });

  describe('Visiting a submission with selections', function() {
    before(function() {
      casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/submissions/543e9644729e9ef59ba812f3/selections/5440401851b327412d00002f');
      casper.waitForSelector('span.selectionLink');
    });
  
    it('should have a respond link', function() {
      'a.respond'.should.be.inDOM;
    });
  });

  describe('Visiting a submission response url', function() {
    before(function() {
      casper.thenOpen(host + '/#/responses/new/submission/543e9644729e9ef59ba812f3');
      casper.waitForSelector('#moreDetails');
    });


    it('should advertise being a new response', function() {
      'section.response>h1'.should.have.text(/New\W+Response/);
    });

    it('should be addressed to the student', function() {
      '#responding-to'.should.have.text('Jhanvee P.');
    });

    it('should have response text', function() {
      'You wrote'.should.be.textInDOM;
      'this ends up an identity statement'.should.be.textInDOM;
      'Good example of using Alg to solve the Extra'.should.be.textInDOM;
    });

    it('should have buttons', function() {
      'button.edit:enabled'.should.be.inDOM;
      'button.save:disabled'.should.be.inDOM;
      'button.send:enabled'.should.be.inDOM;
    });

    it('should display a summary and a more details link', function() {
      'This response was generated from'.should.be.textInDOM;
      //'a.other.response'.should.be.inDOM; TODO Test for other responses (needs a submission with multiple responses)
      'a.workspace'.should.be.inDOM;
      'a.submission'.should.be.inDOM;
      'a#moreDetails'.should.be.inDOM;
      'These selections and comments were available'.should.not.be.textInDOM;

      casper.click('a#moreDetails', function() {
        'These selections and comments were available'.should.be.textInDOM;
        "$('section.comments>ul>li').length".should.evaluate.to.equal(1);
      });
    });

    describe('Saving this response', function() {
      it('should be able to edit the text', function() {
        casper.click('button.edit');
        casper.sendKeys('textarea#responseTextarea', 'casper edited');
        'button.save:enabled'.should.be.inDOM;
      });

      it('should let us save and take us to a new URL', function() {
        casper.click('button.save:enabled');
        casper.waitForUrl(/#\/responses\/[0-9a-f]{24}$/, function() {
          'section.response>h1'.should.have.text(/Saved\W+Response/);
        });
      });

      describe('Viewing the list of saved responses', function() {
        it('the one we just saved should show up', function() {
          casper.click('a.menu.responses');
          casper.waitForUrl(/#\/responses.?$/, function() {
            'a few seconds ago'.should.be.textInDOM;
            'casper editedHello'.should.be.textInDOM;
          });
        });
      });
    });
  });
});
