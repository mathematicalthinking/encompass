const config = require('../../app/config');
const nconf = config.nconf;
const port = nconf.get('testPort');
const {Builder, By, Key, until} = require('selenium-webdriver');
const expect = require('chai').expect;

const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const host = `http://localhost:${port}`
const login = `http://localhost:3000/NCTM-TMF-Login-Page/?SsoReturnType=tmf&SsoReturnUrl=http://localhost:${port}/back`;
const user = 'steve';

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
    await helpers.navigateAndWait(driver, host, 'a[href="/login"]');
    driver.sleep(5000);
  });

  it('login button should be visible', async function () {
    expect(await helpers.isElementVisible(driver, 'a[href="/login"]')).to.be.true;
  });

  it('should display login page after clicking login', async function () {
    let url;
    await helpers.findAndClickElement(driver, 'a[href="/login"]');
    driver.sleep(5000);
    await helpers.waitForSelector(driver, 'input[name=username]');

    try {
      url = await driver.getCurrentUrl();
    }catch(err) {
      console.log(err);
    }
    expect(url).to.eql(login);
    expect(await helpers.isElementVisible(driver, 'input[name=username]')).to.be.true;
    expect(await helpers.isElementVisible(driver, 'input[name=password]')).to.be.true;
    expect(await helpers.isElementVisible(driver, 'input[type=submit]')).to.be.true;
  });

  it('should redirect to homepage after logging in', async function () {
    let url;
    let greeting;
    let message;

    try {
      await helpers.findInputAndType(driver, 'input[name=username]', user);
      await helpers.findAndClickElement(driver, 'input[type=submit]');

      greeting = await helpers.waitForSelector(driver, '#al_welcome');
      url = await driver.getCurrentUrl();
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
