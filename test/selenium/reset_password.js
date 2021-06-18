// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const fixtures = require('./fixtures/reset_password');

const host = helpers.host;
const resetPath = '/#/auth/reset';

const resetLink = `${host}${resetPath}/${fixtures.userLiveToken.token}`;
const invalidResetLink = `${host}${resetPath}/${fixtures.userLiveToken.invalidToken}`;
const expiredResetLink = `${host}${resetPath}/${fixtures.userExpiredToken.token}`;

describe('Resetting Password', function () {
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
  describe('Invalid token', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, invalidResetLink, {selector: css.resetPassword.invalidToken});
    });

    it('should not display reset form', async function() {
      expect(await helpers.isElementVisible(driver, css.resetPassword.resetForm)).to.be.false;
    });

    it('should display error message', async function() {
      expect(await helpers.isElementVisible(driver, css.resetPassword.invalidToken)).to.be.true;
    });
  });

  describe('Matching but expired token', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, expiredResetLink, {selector: css.resetPassword.invalidToken, timeout: 10000});
    });

    it('should not display reset form', async function() {
      expect(await helpers.isElementVisible(driver, css.resetPassword.resetForm)).to.be.false;
    });

    it('should display error message', async function() {
      expect(await helpers.isElementVisible(driver, css.resetPassword.invalidToken)).to.be.true;
    });
  });

  describe('Valid token', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, resetLink, {selector: css.resetPassword.resetForm});
      // await driver.sleep(3000);
    });

    it('should display reset form', async function() {
      expect(await helpers.isElementVisible(driver, css.resetPassword.resetForm)).to.be.true;
    });

    describe('Reset Password Form', function() {
      function verifyResetForm() {
        const inputs = css.resetPassword.inputs;
        for (let input of Object.keys(inputs)) {
          // eslint-disable-next-line no-loop-func
            it(`should display ${input} field`, async function () {
              expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
            });
          }
        it('should display submit button', async function () {
          expect(await helpers.isElementVisible(driver, css.resetPassword.submit)).to.be.true;
        });
      }

      describe('Displaying form fields', async function() {
        await verifyResetForm();
      });

      describe('Submitting Form', function() {
        const user = fixtures.userLiveToken;
        before(async function() {
          await helpers.findInputAndType(driver, css.resetPassword.inputs.password, user.newPassword);

          await helpers.findInputAndType(driver, css.resetPassword.inputs.confirmPassword, user.newPassword);

          await helpers.findAndClickElement(driver, css.resetPassword.submit);

          await helpers.waitForSelector(driver, css.topBar.logout);
        });

        it('should automatically log user in and redirect to home', async function() {
          expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/`);
          // expect(await helpers.findAndGetText(driver, css.greeting)).to.eql(user.name);
        });

        it('should let user log in with new password', async function() {
          await helpers.findAndClickElement(driver, css.topBar.logout);
          await helpers.waitForSelector(driver, ".auth-form-input");
          await helpers.findInputAndType(driver, css.login.username, user.username);
          await helpers.findInputAndType(driver, css.login.password, user.newPassword);
          await helpers.findAndClickElement(driver, css.login.submit);
          await helpers.waitForSelector(driver, css.topBar.logout);

          expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/`);
        });
      });
    });
  });
});