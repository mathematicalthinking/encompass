const { Builder, By, Key, until } = require('selenium-webdriver');
const expect = require('chai').expect;
const config = require('../../server/config');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const nconf = config.nconf;
const port = nconf.get('testPort');
const host = `http://localhost:${port}`
const loginUrl = `${host}/#/auth/login`;
const user = 'rick';
const password = 'sanchez';

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
    await driver.sleep(3000);
  });

  it('login button should be visible', async function () {
    expect(await helpers.isElementVisible(driver, css.topBar.login)).to.be.true;
  });

  it('should display login page after clicking login', async function () {
    await helpers.findAndClickElement(driver, css.topBar.login);
    await driver.sleep(5000);
    await helpers.waitForSelector(driver, css.login.username);
    let url = await helpers.getCurrentUrl(driver);

    expect(url).to.eql(loginUrl);
    expect(await helpers.isElementVisible(driver, css.login.username)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.password)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.submit)).to.be.true;
  });

  it('should redirect to homepage after logging in', async function () {
    let url;
    let greeting;
    let message;

    try {
      await helpers.findInputAndType(driver, css.login.username, user);
      await helpers.findInputAndType(driver, css.login.password, password);
      await helpers.findAndClickElement(driver, css.login.submit);

      greeting = await helpers.waitForSelector(driver, '#al_welcome');
      await driver.sleep(3000);
      url = await helpers.getCurrentUrl(driver);
      message = await greeting.getText();
    } catch (err) {
      console.log(err);
    }
    expect(url).to.equal(`${host}/`);
    expect(message).to.equal(`Welcome, ${user}`);
  });

  describe('NavBar', async function () {
    const elements = ['workspaces', 'responses', 'users', 'logout', 'problem', 'workspaces/new', 'users/new'];
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
});
