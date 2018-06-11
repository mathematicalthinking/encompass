const config = require('../../app/config');
const nconf = config.nconf;
const port = nconf.get('testPort');

const {Builder, By, Key, until} = require('selenium-webdriver');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const helpers = require('./helpers');
console.log('node_env', process.env.NODE_ENV);

const host = `http://localhost:${port}`
const login = `http://localhost:3000/NCTM-TMF-Login-Page/?SsoReturnType=tmf&SsoReturnUrl=http://localhost:${port}/back`;
const user = 'steve';

describe('Home Page', function() {
  this.timeout('10s');
  let driver = null;
  before(() => {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
  });

  after(() => {
    driver.quit();
  });

  it('should load without error', async function() {
    await helpers.navigateAndWait(driver, host, 'a[href="login"]');
  });

  it('login button should be visible', async function() {
    expect(await helpers.isElementVisible(driver, 'a[href="login"]')).to.be.true;
  });

  it('should display login page after clicking login', async function() {
    let url;
    let isUsername;
    let isPassword;
    let isSubmit;
    try {
      await driver.findElement(By.css('a[href="login"]')).sendKeys('webdriver', Key.RETURN);
      await driver.sleep(1000);
      url = await driver.getCurrentUrl();
      isUsername = await driver.findElement(By.css('input[name=username]')).isDisplayed();
      isPassword = await driver.findElement(By.css('input[name=password]')).isDisplayed();
      isSubmit = await driver.findElement(By.css('input[type=submit]')).isDisplayed();
    }catch(err) {
      console.log(err);
    }
    expect(url).to.equal(login);
    expect(isUsername).to.eql(true);
    expect(isPassword).to.be.true;
    expect(isSubmit).to.be.true;
  });

  it('should redirect to homepage after logging in', async function() {
    let url;
    let greeting;
    try {
      await driver.findElement(By.css('input[name=username]')).sendKeys(user);
      await driver.findElement(By.css('input[type=submit]')).sendKeys('webdriver', Key.RETURN);
      await driver.sleep(1000);
      url = await driver.getCurrentUrl();
      greeting = await driver.findElement(By.id('al_welcome')).getText();
      await driver.sleep(2000);
    }catch(err) {
      expect(url).to.equal(`${host}/`);
      expect(greeting).to.equal(`Welcome, ${user}`);
    }
  });

  describe('NavBar', async function() {
    const elements = ['workspaces', 'responses', 'users', 'logout', 'problem', 'workspaces/new', 'users/new'];
    function verifyNavElement(navElement) {
      let isVisible;
      it(`${navElement} link should exist`, async function() {
          try {
            isVisible = await driver.findElement(By.css(`a[href="#/${navElement}"]`)).isDisplayed();
          } catch(err) {
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


