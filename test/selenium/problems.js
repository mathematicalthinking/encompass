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
  this.timeout('10s');
  let driver = null;
  const problemId = '5b4e25c638a46a41edf1709a';
  const problemLink = `a[href='#/problems/${problemId}`;

  // creation date of test problem is getting reset every time testDB is reset
  const problemDetails = {
    name: "Rick's Public",
    question: 'What is it?',
    isPublic: 'true',
    //creationDate: 'Mon Jul 02 2018 11:12:25 GMT-0400 (Eastern Daylight Time)'
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
      expect(await helpers.isElementVisible(driver, problemLink)).to.be.true;
    });
  });

  describe(`Visiting ${problemDetails.name}`, function() {
    before(async function() {
      await helpers.findAndClickElement(driver, problemLink);
    });
    //TODO: update these tests to be more robust once this page is updated
    it('should display the problem details', async function() {
      expect(await helpers.isTextInDom(driver, problemDetails.name)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.isPublic)).to.be.true;
      //expect(await helpers.isTextInDom(driver, problemDetails.creationDate)).to.be.true;
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
      await helpers.findAndClickElement(driver, css.topBar.problemsNew);
      await helpers.waitForSelector(driver, css.newProblem.form);
    });

    describe('Verify form inputs', async function() {
      await verifyForm();
    });

    describe('Submitting a problem without an image', function() {
      const inputs = css.newProblem.inputs;
      const problem = helpers.newProblem;

      const submitProblem = async function(details, isPublic, image) {
        for (let detail of Object.keys(details)) {
          try {
            await helpers.findInputAndType(driver, inputs[detail], details[detail]);
          }catch(err) {
            console.log(err);
          }
        }
        if (isPublic) {
          await helpers.findAndClickElement(driver, inputs.isPublicYes);
        } else {
          await helpers.findAndClickElement(driver, inputs.isPublicNo);
        }
        await helpers.findAndClickElement(driver, css.newProblem.submit);
      };

      it ('should display success message after submitting', async function() {
        await submitProblem(problem.details, true);
        await helpers.waitForSelector(driver, css.successMessage);
        expect(await helpers.isTextInDom(driver, `Successfully created problem`)).to.be.true;
      });

      it('should display link to newly created problem', async function() {
        await helpers.waitForSelector(driver, 'a.problem-new');
        expect(await helpers.findAndGetText(driver, 'a.problem-new')).to.eql(problem.details.name);
      });

      it('should display newly created problem details after clicking link', async function() {
        await helpers.findAndClickElement(driver, 'a.problem-new');
        expect(await helpers.isTextInDom(driver, problem.details.name)).to.be.true;
        expect(await helpers.isTextInDom(driver, problem.details.question)).to.be.true;
      });
    });
  });
});


