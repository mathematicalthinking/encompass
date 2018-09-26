// REQUIRE MODULES
const { Builder, By, Key, until } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const config = require('../../server/config');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Problems', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  const problemId = '5b4e25c638a46a41edf1709a';
  const problemLink = `a[href='#/problems/${problemId}`;

  // creation date of test problem is getting reset every time testDB is reset
  const problemDetails = {
    name: "Rick's Public",
    question: 'What is it?',
    privacySetting: 'Everyone',
  };

  before(async function () {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host);
    }catch(err) {
      console.log(err);
    }
  });
  after(() => {
    driver.quit();
  });
  describe('Visiting problems page', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, css.topBar.problems);
    });
    it('should display a user\'s problems', async function() {
      await helpers.waitForSelector(driver, 'ul.your-problems');
      let problems = await helpers.getWebElements(driver, 'ul.your-problems > li');
      expect(problems).to.have.lengthOf(2);
      // expect(await helpers.isElementVisible(driver, problemLink)).to.be.true;
    });
  });

  xdescribe(`Visiting ${problemDetails.name}`, function() {
    before(async function() {
      await helpers.findAndClickElement(driver, problemLink);
    });
    //TODO: update these tests to be more robust once this page is updated
    it('should display the problem details', async function() {
      expect(await helpers.isTextInDom(driver, problemDetails.name)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.privacySetting)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.creationDate)).to.be.true;
    });
  });
  // TODO: figure out best way to test uploading an image in e2e manner
  describe('Problem creation', function() {
    const verifyForm = async function() {
      const inputs = css.newProblem.inputs;
      for (let input of Object.keys(inputs)) {
        it(`${input} field should be visible`, async function() {
          expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
        });
      }
    }
    before(async function() {
      await helpers.findAndClickElement(driver, "#problem-new-link");
      await helpers.waitForSelector(driver, css.newProblem.form);
    });

    describe('Verify form inputs', async function() {
      await verifyForm();
    });

    describe('Submitting a problem without an image', function() {
      const inputs = css.newProblem.inputs;

      const submitProblem = async function(details, privacySetting, image) {
        for (let detail of Object.keys(details)) {
          try {
            await helpers.findInputAndType(driver, inputs[detail], details[detail]);
          } catch(err) {
            console.log(err);
          }
        }
        if (privacySetting) {
          await helpers.findAndClickElement(driver, inputs.everyone);
        } else {
          await helpers.findAndClickElement(driver, inputs.justMe);
        }
        await helpers.findAndClickElement(driver, '#legal-notice');
        await helpers.findAndClickElement(driver, css.newProblem.submit);
        await helpers.findAndClickElement(driver, '.confirm');
      };

      it('should redirect to problem info after creation', async function () {
        const problem = helpers.newProblem;
        await submitProblem(problem.details, true);
        await helpers.waitForSelector(driver, '#editProblem');
        expect(await helpers.getCurrentUrl(driver)).to.match(/problems\/\w/);
        expect(await helpers.isTextInDom(driver, problem.details.name)).to.be.true;
        expect(await helpers.isTextInDom(driver, problem.details.question)).to.be.true;

      });
    });
  });
});



