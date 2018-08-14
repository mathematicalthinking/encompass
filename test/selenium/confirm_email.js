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
const fixtures = require('./fixtures/confirm_email');

const host = helpers.host;
const confirmPath = '/#/auth/confirm';

const confirmLink = `${host}${confirmPath}/${fixtures.userLiveToken.token}`
const invalidResetLink = `${host}${confirmPath}/${fixtures.userLiveToken.invalidToken}`
const expiredResetLink = `${host}${confirmPath}/${fixtures.userExpiredToken.token}`

describe('Confirm Email', async function () {
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

  describe('Invalid token', async function() {
    before(async function() {
      await helpers.navigateAndWait(driver, invalidResetLink, css.confirmEmail.invalidToken);
    });

    it('should display error message', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.invalidToken)).to.be.true;
    });
  });

  describe('Matching but expired token', async function() {
    before(async function() {
      await helpers.navigateAndWait(driver, expiredResetLink, css.confirmEmail.invalidToken, 10000);
    });

    it('should display error message', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.invalidToken)).to.be.true;
    });
  });

  describe('Valid token', async function() {
    before(async function() {
      await helpers.navigateAndWait(driver, confirmLink, css.confirmEmail.successMessage, 10000);
    });

    it('should display success message', async function() {
      let message = 'Your email address has been successfully confirmed!';
      expect(await helpers.isElementVisible(driver, css.confirmEmail.successMessage)).to.be.true;

      expect(await helpers.isTextInDom(driver, message)).to.be.true;
    });

    it('should display link to login page', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.loginLink)).to.be.true;
    });
  });

  describe('Logging in without confirmed email', async function() {
    const user = {
      username: fixtures.userLiveToken.username,
      password: fixtures.userLiveToken.password
    };
    before(async function() {
      await dbSetup.prepTestDb();
      await helpers.login(driver, host, user);
    });

    it('should redirect to /unconfirmed', async function() {
      expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/#/unconfirmed`);

    });

    it('should display info message', async function() {
      const msg = 'It looks like the email address associated with your EnCoMPASS account has not been confirmed yet.'
      expect(await helpers.isTextInDom(driver, msg)).to.be.true;
    });

    it('should display Send New Email button', async function() {
      expect(await helpers.isElementVisible(driver, css.confirmEmail.newEmailButton)).to.be.true;
    });

    it('should send new email successfully after clicking button', async function() {
      await helpers.findAndClickElement(driver, css.confirmEmail.newEmailButton);
      await helpers.waitForSelector(driver, css.confirmEmail.resentConfirm);

      expect (await helpers.isElementVisible(driver, css.confirmEmail.resentConfirm)).to.be.true;
    });
  });


});

