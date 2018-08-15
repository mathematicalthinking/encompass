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
const fixtures = require('./fixtures/forgot_password');

const host = helpers.host;
const url = `${host}/#/auth/forgot`;

describe('Forgot Password', async function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function () {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
  });
  after(() => {
    driver.quit();
  });

  describe('Forgot Password Form', async function() {
    before(async function() {
      await helpers.navigateAndWait(driver, url, css.forgotPassword.forgotForm);
    });
    async function verifyResetForm() {
      const inputs = css.forgotPassword.inputs;
      for (let input of Object.keys(inputs)) {
          it(`should display ${input} field`, async function () {
            expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
          });
        }
      it('should display Request Reset Link button', async function () {
        expect(await helpers.isElementVisible(driver, css.forgotPassword.submit)).to.be.true;
      });
    }

    describe('Displaying form fields', async function() {
      await verifyResetForm();
    });

    describe('Submitting Form', async function() {
      const user = fixtures.user;
      describe('Using nonexistant email address', async function() {
        before(async function() {
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.email, user.badEmail);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.errorMessage);
        });

        it('should display error message', async function() {
          const msg = "There is no account associated with that email address";
          expect(await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });
      xdescribe('Using existing email address', async function() {
        before(async function() {
          await helpers.clearElement(driver, css.forgotPassword.inputs.email);
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.email, user.email);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.successMessage);
        });

        it('should display success message', async function() {
          const msg = "An email with further instructions has been sent to the email address on file."
          expect(await helpers.isElementVisible(driver, css.general.successMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });



    });
  });

});