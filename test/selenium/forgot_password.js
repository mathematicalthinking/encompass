// REQUIRE MODULES
const { Builder}  = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const fixtures = require('./fixtures/forgot_password');

const host = helpers.host;
const url = `${host}/auth/forgot`;
const messages = fixtures.messages;

describe('Forgot Password', function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function () {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
  });
  after(() => {
    return driver.quit();
  });

  describe('Forgot Password Form', function() {
    before(async function() {
      let options = {
        selector: css.forgotPassword.forgotForm
      };
      await helpers.navigateAndWait(driver, url, options );
    });
    function verifyResetForm() {
      const inputs = css.forgotPassword.inputs;
      for (let input of Object.keys(inputs)) {
        // eslint-disable-next-line no-loop-func
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

    describe('Submitting Form', function() {
      const user = fixtures.user;

      describe('Submitting Empty Form', function() {
        before(async function() {
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.errorMessage);
        });

        it('should display error message', async function() {
          const msg = messages.errors.missing;
          expect(await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });

      describe('Providing both email and username', function() {
        before(async function() {
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.email, user.email);
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.username, user.username);

          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.errorMessage);
        });

        it('should display error message', async function() {
          const msg = messages.errors.tooMuch;
          expect(await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });

      describe('Providing valid username that does not have an associated email address', function() {
        before(async function() {
          await helpers.clearElement(driver, css.forgotPassword.inputs.email);
          await helpers.clearElement(driver, css.forgotPassword.inputs.username);

          await helpers.findInputAndType(driver, css.forgotPassword.inputs.username, fixtures.student.username);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.errorMessage);
        });

        it('should display error message', async function() {
          const msg = messages.errors.noAssociatedEmail;
          expect(await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });

      describe('Using nonexistant email address', function() {
        before(async function() {
          await helpers.clearElement(driver, css.forgotPassword.inputs.email);
          await helpers.clearElement(driver, css.forgotPassword.inputs.username);

          await helpers.findInputAndType(driver, css.forgotPassword.inputs.email, user.badEmail);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.errorMessage);
        });

        it('should display error message', async function() {
          const msg = messages.errors.noEmail;
          expect(await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });
      describe('Using existing email address', function() {
        before(async function() {
          await helpers.clearElement(driver, css.forgotPassword.inputs.email);
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.email, user.email);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.successMessage);
        });

        it('should display success message', async function() {
          const msg = messages.success.completed;
          expect(await helpers.isElementVisible(driver, css.general.successMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });

      describe('Using nonexistant username', function() {
        before(async function() {
          await helpers.clearElement(driver, css.forgotPassword.inputs.email);
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.username, user.badUsername);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.errorMessage);
        });

        it('should display error message', async function() {
          const msg = messages.errors.noUsername;
          expect(await helpers.isElementVisible(driver, css.general.errorMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });

      describe('Using existing username', function() {
        before(async function() {
          await helpers.clearElement(driver, css.forgotPassword.inputs.username);
          await helpers.findInputAndType(driver, css.forgotPassword.inputs.username, user.username);
          await helpers.findAndClickElement(driver, css.forgotPassword.submit);
          await helpers.waitForSelector(driver, css.general.successMessage);
        });

        it('should display success message', async function() {
          const msg = messages.success.completed;
          expect(await helpers.isElementVisible(driver, css.general.successMessage)).to.be.true;
          expect(await helpers.isTextInDom(driver, msg)).to.be.true;
        });
      });
    });
  });
});