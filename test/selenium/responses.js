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
      let isVisible = await helpers.isElementVisible(driver, 'a.respond');
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
      let text = await helpers.findAndGetText(driver, 'section.response>h1');
      expect(text).to.match(/New\W+Response/);
    });

    it('should be addressed to the student', async function() {
      let text = await helpers.findAndGetText(driver, '#responding-to');
      expect(text).to.equal('Adelina S.');
    });
   
    // Unclear fhat 'You wrote' is referring to?
    // xit('should have response text', function() {
    //   'You wrote'.should.be.textInDOM;
    //   'this ends up an identity statement'.should.be.textInDOM;
    //   'Good example of using Alg to solve the Extra'.should.be.textInDOM;
    // });
    
    describe('should have buttons', function() {
      async function validateButtons() {
        const selectors = ['button.edit:enabled', 'button.save:disabled', 'button.send:enabled'];
        for (let selector of selectors) {
          let name = selector.slice(7,11);
          it(`${name} button should be visible`, async function() {
            expect(await helpers.isElementVisible(driver, selector)).to.eql(true);
          });
        }
      }
      validateButtons();
    });

    describe('should display a summary and a more details link', function() {
      async function validateLinks() {
        const links = ['a.workspace', 'a.submission', 'a#moreDetails'];
        for (let link of links) {
          let name = link.slice(2);
          it(`${name} link should be visible`, async function() {
            expect(await helpers.isElementVisible(driver, link)).to.eql(true);
          });
        }
      }
      validateLinks();
      it ('should display summary', async function() {
        expect(await helpers.isTextInDom(driver, 'This response was generated from')).to.eql(true);
        expect(await helpers.isTextInDom(driver, 'These selections and comments were available')).to.eql(false);
    });
      it('should display details after clicking more details', async function() {
        await driver.findElement(By.css('a#moreDetails')).click();
        expect(await helpers.isTextInDom(driver, 'These selections and comments were available')).to.eql(true);
        let commentLis = await driver.wait(until.elementsLocated(By.css('section.comments>ul>li')), 2000);
        let selectionLis = await driver.wait(until.elementsLocated(By.css('section.selections>ul>li')), 2000);
        expect(commentLis).to.have.lengthOf.at.least(1);
        expect(selectionLis).to.have.lengthOf.at.least(1);
        //'a.other.response'.should.be.inDOM; TODO Test for other responses (needs a submission with multiple responses)
      })
    });

    describe('Saving this response', function() {
      it('should be able to edit the text', async function() {
        try {
          await driver.findElement(By.css('button.edit')).click();
          await driver.findElement(By.css('textarea#responseTextarea')).sendKeys(`${user} edited`);
          await driver.sleep(1000);

        expect(await helpers.isElementVisible(driver, 'button.save:enabled')).to.eql(true);
        }catch(err) {
          console.log(err);
        }
      });

      it('should let us save and take us to a new URL', async function() {
        try {
          await driver.findElement(By.css('button.save:enabled')).click();
          await driver.wait(until.urlMatches(/#\/responses\/[0-9a-f]{24}$/),3000);
        }catch(err) {
          console.log(err);
        }
        expect(await helpers.findAndGetText(driver, 'section.response>h1')).to.match(/Saved\W+Response/);
      });
      
      //TODO: There is a bug when clicking responses after saving a response
      // describe('Viewing the list of saved responses', function() {
      //   it('the one we just saved should show up', async function() {
      //     try {
      //       await driver.findElement(By.css('a.menu.responses')).click();
      //       // await driver.wait(until.urlMatches(/#\/responses.?$/));
      //       //await driver.wait(until.elementLocated(By.css('table')),3000);
      //       // await driver.takeScreenshot();
      //       await driver.sleep(5000);
      //       expect(await driver.getCurrentUrl()).to.match(/#\/responses.?$/);
      //       //expect(await helpers.isTextInDom(driver, 'a few seconds ago')).to.eql(true);
      //       //expect(await helpers.isTextInDom(driver, `${user} editedHello`)).to.eql(true);
      //     }catch(err) {
      //       console.log(err);
      //     }
      //   });
      // });
    });
  });
});
