const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const _ = require('underscore');
const helpers = require('./helpers');

const host = 'http://localhost:8080';
const user = 'casper';

describe('Responses', function() {
  this.timeout('10s');
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    try {
      await driver.get(`${host}/devonly/fakelogin/${user}`);
    }catch(err) {
      console.log(err);
    }
  });
  
  after(() => {
    driver.quit();
  });

  describe('Visiting a submission with selections', function() {
    before(async function() {
      await driver.get(`${host}#/workspaces/53e36522b48b12793f000d3b/submissions/53e36522729e9ef59ba7f4de/selections/53e38e83b48b12793f0010de`);
      await driver.wait(until.elementLocated(By.css('span.selectionLink')), 3000);
    });
  
    it('should have a respond link', async function() {
      let isVisible;
      try {
        isVisible = await helpers.isVisibleInDOM(driver, 'a.respond');
      }catch(err) {

      }
      expect(isVisible).to.eql(true);
    });
  });

  xdescribe('Visiting a submission response url', function() {
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

    xdescribe('Saving this response', function() {
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

      xdescribe('Viewing the list of saved responses', function() {
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
