//TODO make sure these are actually testing what we want them to

// REQUIRE MODULES
const {Builder, By, until} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');

const host = helpers.host;

describe('Responses', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  let user = helpers.admin;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, user);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  describe('Visiting a submission with selections', function() {
    before(async function() {
      let url = `${host}/#/workspaces/53e36522b48b12793f000d3b/submissions/53e36522729e9ef59ba7f4de/selections/53e38ec9b48b12793f0010e4`;
      await helpers.navigateAndWait(driver, url, {selector: '.selectionLink'});
    });

    it('should have a respond link', async function() {
      expect(await helpers.isElementVisible(driver, 'button.new-response')).to.be.true;
    });
  });

  describe('Visiting a submission response url', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, 'button.new-response');
      await helpers.waitForSelector(driver, 'div.response-title');
    });

    it('should advertise being a new response', async function() {
      expect(await helpers.findAndGetText(driver, 'div.response-title')).to.eql('Craft Response');
      //expect(text).to.match(/New\W+Response/);
    });

    it('should be addressed to the student', async function() {
      expect(await helpers.findAndGetText(driver, 'span.response-value.recipient')).to.equal('Andrew S.');
      //expect(text).to.equal('Andrew S.');
    });

    // Unclear fhat 'You wrote' is referring to?
    xit('should have response text', function() {
      'You wrote'.should.be.textInDOM;
      'this ends up an identity statement'.should.be.textInDOM;
      'Good example of using Alg to solve the Extra'.should.be.textInDOM;
    });

    describe('should have buttons', function() {
      it('Save button should be visible', async function() {
        expect(await helpers.isElementVisible(driver, 'button.save-response')).to.eql(true);
      });
    });

    describe('should display a summary and a more details link', function() {
      function validateLinks() {
        const links = ['a.submission'];
        for (let link of links) {
          let name = link.slice(2);
          // eslint-disable-next-line no-loop-func
          it(`${name} link should be visible`, async function() {
             expect(await helpers.isElementVisible(driver, link)).to.eql(true);
          });
        }
      }
      validateLinks();
      it('should display summary', async function() {
        expect(await helpers.isTextInDom(driver, 'Selections')).to.eql(false);
        expect(await helpers.isTextInDom(driver, 'These selections and comments were available')).to.eql(false);
    });
    //not sure this still exists
      xit('should display details after clicking more details', async function() {
        await driver.findElement(By.css('a#moreDetails')).click();
        expect(await helpers.isTextInDom(driver, 'These selections and comments were available')).to.eql(true);
        let commentList = await driver.wait(until.elementsLocated(By.css('section.comments>ul')), 2000);
        let selectionLis = await driver.wait(until.elementsLocated(By.css('section.selections>ul>li')), 2000);
        expect(commentList).to.have.lengthOf(1);
        expect(selectionLis).to.have.lengthOf(4);
        //'a.other.response'.should.be.inDOM; TODO Test for other responses (needs a submission with multiple responses)
      });
    });

    describe('Saving this response', function() {
      it('should be able to edit the text', async function() {
        try {
          // await driver.findElement(By.css('button.edit')).click();
          await driver.findElement(By.css('section#response-new-editor'));

        expect(await helpers.isElementVisible(driver, 'button.save-response')).to.eql(true);
        }catch(err) {
          console.log(err);
          throw(err);
        }
      });

      it('should let us save and take us to a new URL', async function() {
        try {
          let greetingText = 'Hello Andrew,';
          // type some dummy text
          await helpers.findAndClickElement(driver, 'input[name="ownMarkUpOnly"]');

          await helpers.waitForElementToHaveText(driver, '.ql-editor', greetingText, {useIncludes: true});

          await driver.findElement(By.css('button.save-response')).click();
          await driver.wait(until.urlMatches(/#\/responses\/submission\/[0-9a-f]{24}/), 5000);

          await helpers.waitForSelector(driver, 'span.status-text');
          expect(await helpers.findAndGetText(driver, 'span.status-text')).to.eql('Approved');
          // expect(await helpers.isElementVisible(driver, 'div.response-info')).to.eql(true);
        }catch(err) {
          console.log(err);
        }

      });

      //TODO: There is a bug when clicking responses after saving a response
      describe('Viewing the list of saved responses', function() {
        it('the one we just saved should show up', async function() {
          try {
            await driver.findElement(By.css('a.menu.responses')).click();
            // await driver.wait(until.urlMatches(/#\/responses.?$/));
            // await driver.wait(until.elementLocated(By.css('table')),3000);
            // await driver.takeScreenshot();
            expect(await driver.getCurrentUrl()).to.match(/#\/responses.?$/);
            //expect(await helpers.isTextInDom(driver, 'a few seconds ago')).to.eql(true);
            //expect(await helpers.isTextInDom(driver, `${helpers.admin} editedHello`)).to.eql(true);
          }catch(err) {
            console.log(err);
          }
        });
      });
    });
  });
});
