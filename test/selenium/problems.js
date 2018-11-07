// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;
const moment = require('moment');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;


//FILTER OPTIONS
//Test to check all primary filters by account type
  //Click on each one and check that results are correct
//Test to check category filters
//Test to check more filters - admin only

//SORT BAR
//Test to check sort bar is there - options are accurate
//Test to check alphabetical sorting
//Test to check date sorting
//Test to check privacy filtering
//Test to check status filtering

//RESULTS
//Test that list view displays everything properly
//Test that card view displays everything properly
//Test that values update when changes are made
//Test button values are acurate
//Test more menu shows correct values
//Test button actions perform correctly
//Test more actions perform correctly
//Test pagination works

//SEARCH BAR
//Test that there are 2 drop down items
//Search works with enter and clicking button
//Clear button shows when query is applied or text in field
//Clearing search bar resets results properly
//Searching only applies to results of primary filters
//Searching should work for title, text, author, additional Info, status, flagReason, status, sharingAuth/copyright in that order








xdescribe('Problems', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  const problemId = '5b4e25c638a46a41edf1709a';
  const problemLink = `a[href='#/problems/${problemId}`;

  // creation date of test problem is getting reset every time testDB is reset
  const problemDetails = {
    name: "Rick's Public",
    question: 'What is it?',
    privacySetting: 'Everyone',
    copyrightNotice: "Apple Corps.",
    sharingAuth: "stolen goods",
    author: "Paul McCartney",
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

  describe(`Visiting ${problemDetails.name}`, function() {
    before(async function() {
      await helpers.findAndClickElement(driver, problemLink);
    });
    //TODO: update these tests to be more robust once this page is updated
    it('should display the problem details', async function() {
      expect(await helpers.isTextInDom(driver, problemDetails.name)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.privacySetting)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.copyrightNotice)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.sharingAuth)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.author)).to.be.true;
      let today = moment().format("MMM Do YYYY");
      expect(await helpers.isTextInDom(driver, today)).to.be.true;
    });
  });
  // TODO: figure out best way to test uploading an image in e2e manner
  describe('Problem creation', function() {
    const verifyForm = function() {
      const inputs = css.newProblem.inputs;
      for (let input of Object.keys(inputs)) {
        // eslint-disable-next-line no-loop-func
        it(`${input} field should be visible`, async function() {
          expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
        });
      }
    };
    before(async function() {
      await helpers.findAndClickElement(driver, "#problem-new-link");
      await helpers.waitForSelector(driver, css.newProblem.form);
    });

    describe('Verify form inputs', async function() {
      await verifyForm();
    });

    describe('Submitting a problem without an image', function() {
      const inputs = css.newProblem.inputs;

      const submitProblem = async function(details, privacySetting) {
        for (let detail of Object.keys(details)) {
          try {
            // eslint-disable-next-line no-await-in-loop
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
        await helpers.findAndClickElement(driver, 'input#legal-notice');
        await helpers.findAndClickElement(driver, css.newProblem.submit);
        await helpers.findAndClickElement(driver, '.swal2-confirm');
      };

      it('should redirect to problem info after creation', async function () {
        const problem = helpers.newProblem;
        await submitProblem(problem.details, true);
        await helpers.waitForSelector(driver, '#editProblem');
        expect(await helpers.getCurrentUrl(driver)).to.match(/problems\/[a-z0-9]{24}/);
        expect(await helpers.isTextInDom(driver, problem.details.name)).to.be.true;
        expect(await helpers.isTextInDom(driver, problem.details.question)).to.be.true;
        expect(await helpers.isTextInDom(driver, problem.details.copyrightNotice)).to.be.true;
        expect(await helpers.isTextInDom(driver, problem.details.sharingAuth)).to.be.true;
        expect(await helpers.isTextInDom(driver, problem.details.author)).to.be.true;
        });
    });
  });
});



