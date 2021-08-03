// REQUIRE MODULES
const {
  Builder
} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Home Page', function () {
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

  it('should load without error', async function () {
    let options = {
      selector: css.login.username,
      urlToWaitFor: helpers.loginUrl,
      timeout: 10000
    };

    await helpers.navigateAndWait(driver, host, options );

  });
  // default behavior is now to redirect to login page if user is not logged in

  it('should display login page', async function () {
    expect(await helpers.isElementVisible(driver, css.login.username)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.password)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.submit)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.google)).to.be.true;
    expect(await helpers.isElementVisible(driver, css.login.signup)).to.be.true;
  });

  describe('submitting login form', function () {
      it('should display missing credentials if empty form submitted', async function () {
      await helpers.findAndClickElement(driver, css.login.submit);
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.incomplete)).to.be.true;
    });

    it('should remove missing credentials error ', async function () {
      await helpers.findInputAndType(driver, css.login.username, helpers.admin.username);
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.incomplete)).to.be.false;
    });

    it('should display missing credentials if password omitted', async function () {
      await helpers.findAndClickElement(driver, css.login.submit);
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.incomplete)).to.be.true;
    });

    it('should remove missing credentials error', async function () {
      await helpers.findInputAndType(driver, css.login.password, 'badpassword');
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.incomplete)).to.be.false;
    });

    it('should display incorrect password if wrong password submitted', async function () {
      await helpers.findAndClickElement(driver, css.login.submit);
      await driver.sleep(2000);
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.password)).to.be.true;
    });

    it('should remove incorrect password error', async function () {
      await helpers.findInputAndType(driver, css.login.username, 'q');
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.password)).to.be.false;
    });

    it('should display incorrect username if wrong username submitted', async function () {
      await helpers.findAndClickElement(driver, css.login.submit);
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.username)).to.be.true;
    });

    it('should remove incorrect username error', async function () {
      await helpers.findInputAndType(driver, css.login.username, 's');
      expect(await helpers.isTextInDom(driver, helpers.signinErrors.username)).to.be.false;
    });

    it('should redirect to homepage after logging in', async function () {
      try {
        await helpers.clearElement(driver, css.login.username);
        await helpers.clearElement(driver, css.login.password);
        await helpers.findInputAndType(driver, css.login.username, helpers.admin.username);
        await helpers.findInputAndType(driver, css.login.password, helpers.admin.password);
        await helpers.findAndClickElement(driver, css.login.submit);

        await helpers.waitForSelector(driver, 'a.nav__logout');
      } catch (err) {
        console.log(err);
      }
      expect(await helpers.getCurrentUrl(driver)).to.equal(`${host}/`);
    });
  });

  describe('NavBar', function () {
    const elements = ['workspaces', 'responses', 'users', 'logout', 'problems', 'sections'];

    function verifyNavElement(navElement) {
      it(`${navElement} link should exist`, async function () {
        expect(await helpers.existsElement(driver, `a[href="/${navElement}"]`)).to.be.true;
      });
    }
    elements.forEach((el) => {
      verifyNavElement(el);
    });
  });

  describe('Logging Out', function () {
    it('should redirect to login page after logging out', async function () {
      await helpers.findAndClickElement(driver, css.topBar.logout);
      await helpers.waitForSelector(driver, css.topBar.login);
      expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/auth/login`);
      expect(await helpers.isElementVisible(driver, css.topBar.login)).to.be.true;
      expect(await helpers.isElementVisible(driver, css.topBar.signup)).to.be.true;
    });
  });
  //TODO: Figure out best way to test signing in with google
  // xdescribe('Logging in with google', async function () {
  //   let emailInput = 'input[type="email"]';
  //   // let emailAddress = 'encompassmath@gmail.com';
  //   let emailAddress = userAuth.getEmailAuth().username;
  //   //let password = process.env.GMAIL_PASSWORD;
  //   before(async function () {
  //     await helpers.findAndClickElement(driver, css.topBar.login);
  //     await helpers.waitForAndClickElement(driver, css.login.google);
  //     await helpers.waitForSelector(driver, emailInput);
  //   });

  //   it('EnCoMPASS should be in DOM', async function () {
  //     expect(await helpers.isTextInDom(driver, 'EnCoMPASS')).to.be.true;
  //   });
  //   xdescribe('Clicking next', function () {
  //     before(async function () {
  //       await helpers.findInputAndType(driver, emailInput, emailAddress);
  //       await helpers.findAndClickElement(driver, 'content>span');

  //       let isRecovery = await helpers.isTextInDom(driver, 'recovery');

  //       if (isRecovery) {

  //       }
  //     });

  //     it('should display privacy notice', async function () {
  //     });
  //   });
  // });


});