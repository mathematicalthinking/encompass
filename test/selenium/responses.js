// REQUIRE MODULES
const { Builder, By, until } = require('selenium-webdriver');
const { it, describe, before, after, xit } = require('mocha');
const { expect } = require('chai');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');

const host = helpers.host;

describe('Responses', function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  let user = helpers.admin;
  before(async function () {
    driver = new Builder().forBrowser('chrome').build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, user);
    } catch (err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  describe('Visiting a submission with selections', function () {
    before(async function () {
      let url = `${host}/workspaces/53e36522b48b12793f000d3b/submissions/53e36522729e9ef59ba7f4de/selections/53e38ec9b48b12793f0010e4`;
      await helpers.navigateAndWait(driver, url, {
        selector: '.selectionLink',
      });
    });

    it('should have a respond link', async function () {
      expect(await helpers.isElementVisible(driver, 'button.new-response')).to
        .be.true;
    });
  });

  describe('Visiting a submission response url', function () {
    before(async function () {
      await helpers.findAndClickElement(driver, 'button.new-response');
      await helpers.waitForSelector(driver, 'div.response-title');
    });

    it('should advertise being a new response', async function () {
      expect(await helpers.findAndGetText(driver, 'div.response-title')).to.eql(
        'Craft Response'
      );
      //expect(text).to.match(/New\W+Response/);
    });

    it('should be addressed to the student', async function () {
      expect(
        await helpers.findAndGetText(driver, 'span.response-value.recipient')
      ).to.equal('Andrew S.');
      //expect(text).to.equal('Andrew S.');
    });

    describe('should have buttons', function () {
      it('Save button should be visible', async function () {
        expect(
          await helpers.isElementVisible(driver, 'button.save-response')
        ).to.eql(true);
      });
    });

    describe('should display a summary and a more details link', function () {
      function validateLinks() {
        const links = ['a.submission'];
        for (let link of links) {
          let name = link.slice(2);
          // eslint-disable-next-line no-loop-func
          it(`${name} link should be visible`, async function () {
            expect(await helpers.isElementVisible(driver, link)).to.eql(true);
          });
        }
      }
      validateLinks();
      it('should not show any selections or comments for user', async function () {
        expect(
          await helpers.findAndGetText(driver, '.response-prefill')
        ).to.eql(
          "It looks like you haven't made any selections or comments for this submission. You can go back to the submission and create some selections and comments."
        );
      });
      it('should update to show 4 other user selections', async function () {
        await helpers.findAndClickElement(driver, '.filter-label');
        await helpers.findAndClickElement(driver, '.my-work');
        await helpers.findAndClickElement(driver, '.response-title');
        await helpers.findAndClickElement(driver, '.response-header');
        expect(
          await helpers.getWebElements(driver, '.selections-list-item')
        ).to.have.lengthOf(4);
      });
      it('should populate response field', async function () {
        const responseText = await helpers.findAndGetText(driver, '.ql-editor');
        expect(responseText.includes('Hello Andrew,')).to.be.true;
        expect(responseText.includes('You wrote:')).to.be.true;
      });
    });

    describe('Saving this response', function () {
      it('should be able to edit the text', async function () {
        await driver.findElement(By.css('section#response-new-editor'));

        expect(
          await helpers.isElementVisible(driver, 'button.save-response')
        ).to.eql(true);
      });

      it('should let us save and take us to a new URL', async function () {
        try {
          let greetingText = 'Hello Andrew,';

          await helpers.waitForElementToHaveText(
            driver,
            '.ql-editor',
            greetingText,
            { useIncludes: true }
          );

          await driver.findElement(By.css('button.save-response')).click();
          await driver.wait(
            until.urlMatches(/\/responses\/submission\/[0-9a-f]{24}/),
            5000
          );

          await helpers.waitForSelector(driver, 'span.status-text');
          expect(
            await helpers.findAndGetText(driver, 'span.status-text')
          ).to.eql('Approved');
        } catch (err) {
          console.log(err);
        }
      });

      describe('Viewing the list of saved responses', function () {
        it('the one we just saved should show up', async function () {
          await helpers.navigateAndWait(driver, `${host}/responses`, {
            selector: 'div',
          });
          expect(await helpers.isTextInDom(driver, 'a few seconds ago')).to.be
            .true;
        });
      });
    });
  });
});
