// REQUIRE MODULES
const {
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const config = require('../../server/config');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Signup form', async function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function () {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    await helpers.navigateAndWait(driver, `${host}/`, css.topBar.signup);
    await helpers.findAndClickElement(driver, css.topBar.signup);
    await helpers.waitForSelector(driver, css.signup.form);
  });
  after(() => {
    driver.quit();
  });
  describe('Displaying form', async function () {
    async function verifySignupForm() {
      const inputs = css.signup.inputs;
      for (let input of Object.keys(inputs)) {
        it(`should display ${input} field`, async function () {
          expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
        });
      }
      it('should display submit button', async function () {
        expect(await helpers.isElementVisible(driver, css.signup.submit)).to.be.true;
      });
    }

    it('should display login form', async function () {
      expect(await helpers.isElementVisible(driver, css.signup.form)).to.be.true;
    });
    await verifySignupForm();
  });

  describe('Submitting form', function () {

    it('should display missing fields error when omitting username', async function () {
      await helpers.signup(driver, host, ['username']);
      await helpers.waitForSelector(driver, 'p');
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.incomplete)).to.be.true;
    });

    it('should remove error when a form field is modified', async function () {
      let usernameInput;
      try {
        usernameInput = await driver.findElement(By.css(css.signup.inputs.username));
        await usernameInput.sendKeys(helpers.newUser.username);
      } catch (err) {
        console.log(err);
      }
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.incomplete)).to.be.false;
    });

    it('should display terms error if submitted without checking agree to terms',
      async function() {
        // uncheck terms box from previous test
        await helpers.findAndClickElement(driver, css.signup.inputs.terms);
        await helpers.findAndClickElement(driver, css.signup.submit);
        await helpers.waitForSelector(driver, css.errorMessage);
        expect(await helpers.isTextInDom(driver, helpers.signupErrors.terms)).to.be.true;
      });

    it ('should remove terms error after checking the box', async function() {
      await helpers.findAndClickElement(driver, css.signup.inputs.terms);
      await helpers.waitForRemoval(driver, css.errorMessage);
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.terms)).to.be.false;
    });

    // We are not going to automatically login users, they need to be approved, change to approval page
    xit('should redirect to homepage after successful signup', async function () {
      await helpers.findAndClickElement(driver, css.signup.submit);
      await helpers.waitForSelector(driver, css.topBar.logout);

      expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/`);
      expect(await helpers.findAndGetText(driver, css.greeting)).to.eql(`${helpers.newUser.name}`);
    });
  });
});