// REQUIRE MODULES
const { Builder, By, Key, until } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const config = require('../../server/config');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Home Page', function () {
  this.timeout('10s');
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

  it('should load without error', async function () {
    await helpers.navigateAndWait(driver, host, css.topBar.login);
  });

  it('login button should be visible', async function () {
    expect(await helpers.isElementVisible(driver, css.topBar.login)).to.be.true;
  });

  it('should display login page after clicking login', async function () {
    await helpers.findAndClickElement(driver, css.topBar.login);
    await helpers.waitForSelector(driver, css.login.username);
    let url = await helpers.getCurrentUrl(driver);

    expect(url).to.eql(helpers.loginUrl);
    expect(await helpers.isElementVisible(driver, css.login.username)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.password)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.submit)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.google)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.signup)).to.be.true;
  });

  it('should redirect to homepage after logging in', async function () {
    let url;
    let greeting;
    let message;

    try {
      await helpers.findInputAndType(driver, css.login.username, helpers.admin.username);
      await helpers.findInputAndType(driver, css.login.password, helpers.admin.password);
      await helpers.findAndClickElement(driver, css.login.submit);

      greeting = await helpers.waitForSelector(driver, '#al_welcome');
      url = await helpers.getCurrentUrl(driver);
      message = await greeting.getText();
    } catch (err) {
      console.log(err);
    }
    expect(url).to.equal(`${host}/`);
    expect(message).to.equal(`Welcome, ${helpers.admin.username}`);
  });



  describe('NavBar', async function () {
    const elements = ['workspaces', 'responses', 'users', 'logout', 'problems', 'workspaces/new', 'users/new'];
    function verifyNavElement(navElement) {
      let isVisible;
      it(`${navElement} link should exist`, async function () {
        try {
          isVisible = await driver.findElement(By.css(`a[href="#/${navElement}"]`)).isDisplayed();
        } catch (err) {
          console.log(err);
        }
        expect(isVisible).to.be.true;
      });
    }
    elements.forEach((el) => {
      verifyNavElement(el);
    });
  });

  describe ('Logging Out', function() {
    it('should redirect to homepage after logging out', async function() {
      await helpers.findAndClickElement(driver, css.topBar.logout);
      await helpers.waitForSelector(driver, css.topBar.home);
      expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/`);
      expect(await helpers.isElementVisible(driver, css.topBar.login)).to.be.true;
      expect(await helpers.isElementVisible(driver, css.topBar.signup)).to.be.true;
    });
  });


});
