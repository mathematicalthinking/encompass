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
      await driver.get(`${host}#/workspaces/53df8c4c3491b46d73000211/submissions/53df8c4c3491b46d73000201/selections/5af5a5bb67ca2205deac50c6`);
      await driver.wait(until.elementLocated(By.css('span.selectionLink')), 3000);
    });
  
    it('should have a respond link', async function() {
      let isVisible;
      try {
        isVisible = await helpers.isVisibleInDOM(driver, 'a.respond');
      }catch(err) {
        console.log(err);
      }
      expect(isVisible).to.eql(true);
    });
  });

  describe('Visiting a submission response url', function() {
    before(async function() {
      try {
        await driver.findElement(By.css('a.respond')).sendKeys('webdriver', Key.RETURN);
        await driver.wait(until.elementLocated(By.css('#moreDetails')),3000);
        await driver.sleep(3000);
      }catch(err) {
        console.log(err);
      }
    });


    it('should advertise being a new response', async function() {
      await helpers.matchElementText(driver, 'section.response>h1', /New\W+Response/);
      //expect(text).to.match(/New\W+Response/);
    });

    it('should be addressed to the student', async function() {
      await helpers.doesElementContainText(driver, '#responding-to', 'Adelina S.');
      //'#responding-to'.should.have.text('Jhanvee P.');
    });

    xit('should have response text', function() {
      'You wrote'.should.be.textInDOM;
      'this ends up an identity statement'.should.be.textInDOM;
      'Good example of using Alg to solve the Extra'.should.be.textInDOM;
    });

    xit('should have buttons', function() {
      'button.edit:enabled'.should.be.inDOM;
      'button.save:disabled'.should.be.inDOM;
      'button.send:enabled'.should.be.inDOM;
    });

    xit('should display a summary and a more details link', function() {
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
