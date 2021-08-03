/*eslint-env node, mocha */
// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const fixtures = require('./fixtures/confirm_email');

const host = helpers.host;
const confirmPath = '/auth/confirm';

const confirmLink = `${host}${confirmPath}/${fixtures.userLiveToken.token}`;
const invalidResetLink = `${host}${confirmPath}/${fixtures.userLiveToken.invalidToken}`;
const expiredResetLink = `${host}${confirmPath}/${fixtures.userExpiredToken.token}`;

describe('Confirm Email', function () {
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
      let options = {
        selector: css.confirmEmail.invalidToken,
      };

      await helpers.navigateAndWait(driver, invalidResetLink, options);
    });

    it('should display error message', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.invalidToken)).to.be.true;
    });

    it('should display link to login page', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.loginLink)).to.be.true;
    });

  });

  describe('Matching but expired token', function() {
    before(async function() {
      let options = {
        selector: css.confirmEmail.invalidToken,
      };

      await helpers.navigateAndWait(driver, expiredResetLink, options);
    });

    it('should display error message', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.invalidToken)).to.be.true;
    });

    it('should display link to login page', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.loginLink)).to.be.true;
    });

  });

  describe('Valid token', function() {
    before(async function() {
      let options = {
        selector: css.confirmEmail.successMessage,
      };

      await helpers.navigateAndWait(driver, confirmLink, options);
    });

    it('should display success message', async function() {
      let message = 'Your email address has been successfully confirmed!';
      expect(await helpers.isElementVisible(driver, css.confirmEmail.successMessage)).to.be.true;

      expect(await helpers.isTextInDom(driver, message)).to.be.true;
    });

    it('should display link to login page', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.loginLink)).to.be.true;
    });

    describe('Navigating to valid link after already confirming', function() {
      it('should display that email is already confirmed', async function() {
        try {
          let msg = 'Email address has already been confirmed.';
          await driver.get(host);
          let options = {
            selector: css.confirmEmail.alreadyConfirmed
          };
          await helpers.navigateAndWait(driver, confirmLink, options);

          // await helpers.waitForSelector(driver, css.confirmEmail.alreadyConfirmed);
          console.log('after navand wait alrady conf');
          return helpers.waitForElementToHaveText(driver, css.confirmEmail.alreadyConfirmed, msg);

        }catch(err) {
          throw(err);
        }
      });

      it('should display link to login page', async function() {
        await helpers.waitForSelector(driver, css.confirmEmail.loginLink);
        expect(await helpers.isElementVisible(driver, css.confirmEmail.loginLink)).to.be.true;
      });
    });
  });

  describe('Logging in without confirmed email', function() {
    const user = {
      username: fixtures.userLiveToken.username,
      password: fixtures.userLiveToken.password
    };
    before(async function() {
      await dbSetup.prepTestDb();
      await helpers.login(driver, host, user);
      await helpers.waitForUrlMatch(driver, /unconfirmed/);
    });

    it('should redirect to /unconfirmed', async function() {
      expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/unconfirmed`);

    });

    it('should display info message', async function() {
      const msg = 'In order to start using the EnCoMPASS software, we need to confirm your email address.';
      expect(await helpers.isTextInDom(driver, msg)).to.be.true;
    });

    it('should display Send New Email button', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.newEmailButton)).to.be.true;
    });

    it('should send new email successfully after clicking button', async function() {
      await helpers.findAndClickElement(driver, css.confirmEmail.newEmailButton);
      await helpers.waitForSelector(driver, css.confirmEmail.resentConfirm);

      expect(await helpers.isElementVisible(driver, css.confirmEmail.resentConfirm)).to.be.true;
    });
  });


});
