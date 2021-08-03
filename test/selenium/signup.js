// REQUIRE MODULES
const {
  Builder,
  By
} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Signup form', function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function () {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();

    let signupLink = css.login.signup;
    await helpers.navigateAndWait(driver, host, { selector: signupLink, urlToWaitFor: helpers.loginUrl });
    await helpers.findAndClickElement(driver, signupLink);
    await helpers.waitForSelector(driver, css.signup.form);
  });
  after(() => {
    return driver.quit();
  });
  describe('Displaying form', async function () {
    function verifySignupForm() {
      const inputs = css.signup.inputs;
      for (let input of Object.keys(inputs)) {
        if (input !== 'confirmEmail' && input !== 'confirmPassword') {
          // eslint-disable-next-line no-loop-func
          it(`should display ${input} field`, async function () {
            expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
          });
        }
      }
      it('should display submit button', async function () {
        expect(await helpers.isElementVisible(driver, css.signup.submit)).to.be.true;
      });
    }

    it('should display signup form', async function () {
      expect(await helpers.isElementVisible(driver, css.signup.form)).to.be.true;
    });
    await verifySignupForm();
  });

  describe('Submitting form', function () {
    let invalidUsername = 'bad@username.com';
    let invalidPassword = 'tooshort';

    it('should display missing fields error when omitting username', async function () {
      await helpers.signup(driver, ['username']);
      await helpers.waitForSelector(driver, 'p');
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.incomplete)).to.be.true;
    });

    it('should remove error when a form field is modified', async function () {
      let usernameInput;
      try {
        usernameInput = await driver.findElement(By.css(css.signup.inputs.username));
        await usernameInput.sendKeys(invalidUsername);
      } catch (err) {
        console.log(err);
      }
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.incomplete)).to.be.false;
    });

    it('should not allow submitting with invalid username', async function() {
      let blackListed = 'admin';

      await helpers.findAndClickElement(driver, css.signup.submit);
      await driver.sleep(1000);
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.username)).to.eql(true);

      let url = await driver.getCurrentUrl();
      expect(url).to.eql(`${host}/auth/signup`);
      let usernameInput = await driver.findElement(By.css(css.signup.inputs.username));

      await usernameInput.clear();
      await usernameInput.sendKeys(blackListed);

    });

    it('should not allow submitting with blacklisted username', async function() {
      let expectedMsg = '"username" ' + helpers.signupErrors.blackListed;
      await helpers.findAndClickElement(driver, css.signup.submit);
      await helpers.waitForTextInDom(driver, expectedMsg );
      expect(await helpers.isTextInDom(driver, expectedMsg)).to.eql(true);

      let url = await driver.getCurrentUrl();
      expect(url).to.eql(`${host}/auth/signup`);
      let usernameInput = await driver.findElement(By.css(css.signup.inputs.username));

      await usernameInput.clear();
      await usernameInput.sendKeys(helpers.newUser.username);

    });

    it('should not allow submitting with existing username', async function() {
      let expectedMsg = 'Username already exists';
      let existingUsername = 'rick';

      let usernameInput = await driver.findElement(By.css(css.signup.inputs.username));

      await usernameInput.clear();
      await usernameInput.sendKeys(existingUsername);

      await helpers.findAndClickElement(driver, css.signup.submit);
      await helpers.waitForTextInDom(driver, expectedMsg );
      expect(await helpers.isTextInDom(driver, expectedMsg)).to.eql(true);

      let url = await driver.getCurrentUrl();
      expect(url).to.eql(`${host}/auth/signup`);

      await usernameInput.clear();
      await usernameInput.sendKeys(helpers.newUser.username);

    });


    it('should not allow submitting with invalid password', async function() {
      let passwordInput = await driver.findElement(By.css(css.signup.inputs.password));
      passwordInput.clear();
      passwordInput.sendKeys(invalidPassword);

      await helpers.findAndClickElement(driver, css.signup.submit);
      await driver.sleep(1000);
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.password)).to.eql(true);

      let url = await driver.getCurrentUrl();
      expect(url).to.eql(`${host}/auth/signup`);

      await passwordInput.clear();
      await passwordInput.sendKeys(helpers.newUser.password);

    });

    it('should not allow submitting with existing email', async function() {
      try {
        let confSel = css.signup.inputs.confirmEmail;
        let existingEmail = 'glaforge98@gmail.com';
        let errorMsg = 'Email address has already been used';

        let emailInput = await driver.findElement(By.css(css.signup.inputs.email));

        await emailInput.clear();
        await emailInput.sendKeys(existingEmail);

        await helpers.waitForSelector(driver, confSel);

        let confirmEmailInput = await driver.findElement({css: confSel});

        await confirmEmailInput.clear();
        await confirmEmailInput.sendKeys(existingEmail);

        await helpers.findAndClickElement(driver, css.signup.submit);
        await driver.sleep(1000);
        await helpers.waitForTextInDom(driver, errorMsg);

        let url = await driver.getCurrentUrl();
        expect(url).to.eql(`${host}/auth/signup`);

        await confirmEmailInput.clear();

        await emailInput.clear();
        await emailInput.sendKeys(helpers.newUser.email);

        await helpers.waitForSelector(driver, confSel);

        confirmEmailInput = await driver.findElement({css: confSel});

        await confirmEmailInput.sendKeys(helpers.newUser.email);

      }catch(err) {
        throw(err);
      }
    });

    it('should display terms error if submitted without checking agree to terms',
      async function() {
        // uncheck terms box from previous test
        await helpers.findAndClickElement(driver, css.signup.inputs.terms);
        await driver.sleep(100);
        await helpers.findAndClickElement(driver, css.signup.submit);
        await helpers.waitForSelector(driver, css.errorMessage);
        await driver.sleep(100);
        expect(await helpers.isTextInDom(driver, helpers.signupErrors.terms)).to.be.true;
      });

    it('should remove terms error after checking the box', async function () {
      await helpers.findAndClickElement(driver, css.signup.inputs.terms);
      await helpers.waitForRemoval(driver, css.errorMessage);
      expect(await helpers.isTextInDom(driver, helpers.signupErrors.terms)).to.be.false;
    });

    // We are not going to automatically login users, they need to be approved, change to approval page
    it('should redirect to unconfirmed after successful signup', async function () {
      await driver.sleep(1000);
      await helpers.findAndClickElement(driver, css.signup.submit);
      await helpers.waitForUrlMatch(driver, /unconfirmed/,10000);
      await helpers.waitForSelector(driver, css.topBar.logout);

      expect(await helpers.getCurrentUrl(driver)).to.eql(`${host}/unconfirmed`);
    });
  });
});