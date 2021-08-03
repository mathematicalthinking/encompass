// REQUIRE MODULES
const { Builder, By } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const messages = require('./fixtures/messages');

const host = helpers.host;


describe('Users', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
  });

  after(() => {
    return driver.quit();
  });

  function clearUsername (driver) {
    return helpers.clearElement(driver, 'input.user-username');
  }

  function clearPassword(driver) {
    return helpers.clearElement(driver, 'input.user-password');
  }

  function typePassword(driver, text) {
    return helpers.findInputAndType(driver, 'input.user-password', text);
  }

  function clearInput(driver, inputType) {
    return helpers.clearElement(driver, `input.user-${inputType}`);
  }

  function clearAndTypeInput(driver, inputType, text) {
    return clearInput(driver, inputType)
      .then(() => {
        return helpers.findInputAndType(driver, `input.user-${inputType}`, text);
      });
  }

  describe('Logged in as an admin user', function () {
    let user = helpers.admin;
    before(async function () {
      await helpers.login(driver, host, user);
      await helpers.waitForSelector(driver, 'a[href="/users"]');
    });

    function validateUsersPage() {
      it('should show/hide various editable fields', async function () {
        const inputs = ['input.user-email', 'input.user-first-name', 'input.user-last-name', 'input.user-location'];
        expect(await helpers.isTextInDom(driver, helpers.admin.username)).to.be.true;

        await helpers.findAndClickElement(driver, 'button.edit-user');

        // should there be an input to change username?
        for (let input of inputs) {
          // eslint-disable-next-line no-await-in-loop
          expect(await helpers.isElementVisible(driver, input)).to.be.true;
        }
        await helpers.findAndClickElement(driver, 'button.saveUser');
      });
    }

    function validateNewUserPage() {
      it('should display the page title and form', async function () {
        expect(await helpers.isTextInDom(driver, 'Create New User')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'article.user')).to.be.true;
      });

      it('should show certain fields', async function () {
        expect(await helpers.isElementVisible(driver, 'input.user-username')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-password')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-first-name')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-last-name')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-email')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.typeahead')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-location')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'select')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-isAuth')).to.be.true;
      });

      it('should not let you submit form with missing fields', async function () {
        let username = `muzzy`;
        await helpers.findInputAndType(driver, 'input.user-username', username);
        await helpers.selectOption(driver, 'my-select', 'Teacher');
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-box');
        await helpers.waitForTextInDom(driver, 'Missing required fields');

        expect(await helpers.findAndGetText(driver, '.error-box')).to.contain('Missing required fields');

        await helpers.dismissErrorBox(driver);
      });

      it('should not let you submit form with invalid password', async function() {
        let tooShortPass = 'tooshort';
        let expectedMsg = messages.signup.errors.passwordTooShort;
        await helpers.findInputAndType(driver, 'input.user-password', tooShortPass);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-box');
        await helpers.waitForTextInDom(driver, expectedMsg);
        expect(await helpers.findAndGetText(driver, '.error-box')).to.contain(expectedMsg);
        await helpers.dismissErrorBox(driver);

      });

      it('should not let you submit form with invalid username', async function() {
        let password = 'test45678!';
        let badUsername = 'bad@bad.com';
        let expectedMsg = helpers.signupErrors.username;

        await clearAndTypeInput(driver, 'password', password);
        await clearAndTypeInput(driver, 'username', badUsername);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-box');
        await helpers.waitForElementToHaveText(driver, 'div.error-box', expectedMsg);
        // expect(await helpers.waitForAndGetErrorBoxText(driver)).to.contain(expectedMsg);
        await helpers.dismissErrorBox(driver);

      });

      it('should not let you submit form with black-listed username', async function () {
        let firstName = `Muzzy`;
        let lastName = 'Doe';
        let email = `mdoe@gmail.com`;
        let organization = `Drexel University`;
        let location = `Philadelphia, PA`;
        let badUsername = 'admin';
        let expectedMsg = `"username" ${helpers.signupErrors.blackListed}`;

        await clearAndTypeInput(driver, 'username', badUsername);
        await helpers.selectOption(driver, 'my-select', 'Pd Admin');
        await helpers.findInputAndType(driver, 'input.user-first-name', firstName);
        await helpers.findInputAndType(driver, 'input.user-last-name', lastName);
        await helpers.findInputAndType(driver, 'input.user-email', email);
        await helpers.findInputAndType(driver, 'input.typeahead', organization);
        await helpers.findInputAndType(driver, 'input.user-location', location);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-box');
        await helpers.waitForTextInDom(driver, expectedMsg);
        await helpers.waitForElementToHaveText(driver, 'div.error-box', expectedMsg);
        // expect(await helpers.waitForAndGetErrorBoxText(driver)).to.contain(expectedMsg);
        await helpers.dismissErrorBox(driver);
      });

      it('should let you create a new unauthorized pdadmin', async function () {
        let username = `muzzy`;
        await clearAndTypeInput(driver, 'username', username);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '#user-info', 10000);
        await helpers.waitForRemoval(driver, css.sweetAlert.container);
        expect(await helpers.findAndGetText(driver, 'ul.waiting-auth>li:first-child')).to.contain('muzzy');

      });

      it('should let you create a new authorized teacher', async function () {
        let username = `msmith`;
        let password = 'test45678!';
        let firstName = `John`;
        let lastName = 'Doe';
        let oldEmail = `mdoe@gmail.com`;
        let newEmail = `msmith@gmail.com`;
        let organization = `Drexel University`;
        let location = `Philadelphia, PA`;
        await helpers.findAndClickElement(driver, '#new-user-link');
        await helpers.waitForSelector(driver, 'div#user-new-admin');
        await clearAndTypeInput(driver, 'username', username);
        await helpers.findInputAndType(driver, 'input.user-password', password);
        await helpers.findInputAndType(driver, 'input.user-first-name', firstName);
        await helpers.findInputAndType(driver, 'input.user-last-name', lastName);
        await helpers.findInputAndType(driver, 'input.user-email', oldEmail);
        await helpers.findInputAndType(driver, 'input.typeahead', organization);
        await helpers.findInputAndType(driver, 'input.user-location', location);
        await helpers.selectOption(driver, 'my-select', 'Teacher');
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.findAndClickElement(driver, 'button.new-user');
        await helpers.waitForTextInDom(driver, 'Email address has already been used');
        await helpers.waitForElementToHaveText(driver, 'div.error-box', 'Email address has already been used');

        // expect(await helpers.waitForAndGetErrorBoxText(driver)).to.contain('Email address has already been used');
        await helpers.dismissErrorBox(driver);
        await helpers.clearElement(driver, 'input.user-email');
        await helpers.findInputAndType(driver, 'input.user-email', newEmail);
        await helpers.findAndClickElement(driver, '#new-user-btn');
        await helpers.waitForSelector(driver, '#user-info', 7000);
        expect(await helpers.findAndGetText(driver, 'ul.teacher-users>li:first-child')).to.contain('msmith');
      });
      //check to make sure the user info page has the info

      it('should let you create a new student without an email', async function () {
        let oldUsername = `student1`;
        let newUsername = `newstudent`;
        let password = 'test45678!';
        let firstName = `Student`;
        let lastName = 'Doe';
        let organization = `Drexel University`;
        await helpers.findAndClickElement(driver, '#new-user-link');
        await helpers.waitForSelector(driver, 'div#user-new-admin');
        await helpers.findInputAndType(driver, 'input.user-username', oldUsername);
        await helpers.findInputAndType(driver, 'input.user-password', password);
        await helpers.findInputAndType(driver, 'input.user-first-name', firstName);
        await helpers.findInputAndType(driver, 'input.user-last-name', lastName);
        await helpers.findInputAndType(driver, 'input.typeahead', organization);
        await helpers.selectOption(driver, 'my-select', 'Student');
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.findAndClickElement(driver, 'button.new-user');
        await helpers.waitForSelector(driver, '.error-text');
        await helpers.waitForTextInDom(driver, 'Username already exists');
        expect(await helpers.findAndGetText(driver, '.error-text')).to.contain('Username already exists');
        await clearUsername(driver);
        await helpers.findInputAndType(driver, 'input.user-username', newUsername);
        await helpers.findAndClickElement(driver, 'button.new-user');
        await helpers.waitForSelector(driver, '#user-info', 7000);
        expect(await helpers.findAndGetText(driver, 'ul.student-users>li:first-child')).to.contain('newstudent');
      });

    }

    function changeAuth() {
      it('should authorize a new user', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.findAndClickElement(driver, 'button.save-user');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'ul.pd-users>li:first-child')).to.contain('muzzy');
      });
    }

    function changeAccountType() {
      it('should change a teacher to an admin', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.selectOption(driver, 'my-select', 'Admin');
        await helpers.findAndClickElement(driver, 'button.save-user');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'ul.admin-users>li:first-child')).to.contain('nope');
      });
    }

    function confirmEmail() {
      it('should manually confirm email', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.findAndClickElement(driver, 'input.user-email-auth');
        await helpers.findAndClickElement(driver, 'button.save-user');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'td.is-email-confirm')).to.contain('true');
      });
    }

    describe('Visiting the users list home page', function () {
      before(async function () {
        await helpers.navigateAndWait(driver, `${host}/users`, {selector: '#user-home'});
      });

      it('should display a welcome page', async function () {
        await helpers.waitForSelector(driver, '#user-home');
      });

      it('should have a create new user link', async function () {
        await helpers.findAndClickElement(driver, `a[href="users/new"]`);
      });

      it('should display a list with your account', async function () {
        expect(await helpers.getWebElements(driver, 'ul.your-account>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.your-account>li:first-child')).to.contain('rick');
      });

      it('should have a list of users waiting for authorization', async function () {
        expect(await helpers.getWebElements(driver, 'ul.waiting-auth>li')).to.have.lengthOf.at.least(2);
        expect(await helpers.findAndGetText(driver, 'ul.waiting-auth>li:first-child')).to.contain('unconfirmed');
      });

      it('should have a list of admins', async function () {
        expect(await helpers.getWebElements(driver, 'ul.admin-users>li')).to.have.lengthOf.at.least(6);
        expect(await helpers.findAndGetText(driver, 'ul.admin-users>li:first-child')).to.contain('superuser');
      });

      it('should have a list of pd admins', async function () {
        expect(await helpers.getWebElements(driver, 'ul.pd-users>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.pd-users>li:first-child')).to.contain('mentorpd');
      });

      it('should have a list of teachers', async function () {
        expect(await helpers.getWebElements(driver, 'ul.teacher-users>li')).to.have.lengthOf.at.least(11);
        expect(await helpers.findAndGetText(driver, 'ul.teacher-users>li:first-child')).to.contain('jl_picard');
      });

      it('should have a list of students', async function () {
        expect(await helpers.getWebElements(driver, 'ul.student-users>li')).to.have.lengthOf(12);
      });

      describe('clicking on your own account', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, `.your-account li a`);
          await helpers.waitForSelector(driver, '#user-info');
        });
        validateUsersPage();
      });

      describe('clicking the Create New User link', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, '#new-user-link');
          await helpers.isElementVisible(driver, 'div#user-new-admin');
        });
        validateNewUserPage();
      });

      describe('authorizing a user', async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("muzzy"));
          link.click();
        });
        await changeAuth();
      });

      describe("changing a user's account type", async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("nope"));
          link.click();
        });
        await changeAccountType();
      });

      describe('manually authorize a users email', async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("superuser"));
          link.click();
        });
        await confirmEmail();
      });

    });
  });

  describe('Logged in as a pd admin user', function () {
    before(async function () {
      await helpers.findAndClickElement(driver, css.topBar.logout);
      await helpers.login(driver, host, helpers.pdAdmin);
      await helpers.navigateAndWait(driver, `${host}/users`, {selector: '#user-home'});
    });

    function validateUsersPage() {
      it('should show/hide various editable fields', async function () {
        const inputs = ['input.user-email', 'input.user-first-name', 'input.user-last-name', 'input.user-location'];
        expect(await helpers.isTextInDom(driver, helpers.pdAdmin.username)).to.be.true;

        await helpers.findAndClickElement(driver, 'button.edit-user');
        // should there be an input to change username?
        for (let input of inputs) {
          // eslint-disable-next-line no-await-in-loop
          expect(await helpers.isElementVisible(driver, input)).to.be.true;
        }
        await helpers.findAndClickElement(driver, 'button.save-user');
      });
    }

    function validateNewUserPage() {
      let signupMessages = messages.signup;
      it('should display the page title and form', async function () {
        expect(await helpers.isTextInDom(driver, 'Create New User')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'article.user')).to.be.true;
      });

      it('should show certain fields', async function () {
        expect(await helpers.isElementVisible(driver, 'input.user-username')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-password')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-first-name')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-last-name')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-email')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-location')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'select')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-isAuth')).to.be.true;
      });

      it('should not let you submit form with missing fields', async function () {
        let username = `bunny`;
        await helpers.findInputAndType(driver, 'input.user-username', username);
        await helpers.selectOption(driver, 'my-select', 'Teacher');
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain('Missing required fields');
      });

      it('should not let you submit form with invalid password', async function() {
        let tooShortPass = 'tooshort';
        let expectedMsg = signupMessages.errors.passwordTooShort;
        await helpers.findInputAndType(driver, 'input.user-password', tooShortPass);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain(expectedMsg);
      });

      it('should not let you submit form with invalid username', async function() {
        let password = 'test45678!';

        await clearPassword(driver);
        await typePassword(driver, password);
        await clearUsername(driver);

        let badUsername = 'bad@bad.com';
        let expectedMsg = helpers.signupErrors.username;
        await helpers.findInputAndType(driver, 'input.user-username', badUsername);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        await helpers.waitForTextInDom(driver, expectedMsg);
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain(expectedMsg);
        await clearUsername(driver);
      });

      it('should not let you submit form with black-listed username', async function () {
        let firstName = `Bunny`;
        let lastName = 'Doe';
        let email = `bdoe@gmail.com`;
        let location = `Philadelphia, PA`;
        let badUsername = 'admin';
        let expectedMsg = `"username" ${helpers.signupErrors.blackListed}`;

        await helpers.findInputAndType(driver, 'input.user-username', badUsername);

        await helpers.selectOption(driver, 'my-select', 'Teacher');
        await helpers.findInputAndType(driver, 'input.user-first-name', firstName);
        await helpers.findInputAndType(driver, 'input.user-last-name', lastName);
        await helpers.findInputAndType(driver, 'input.user-email', email);
        await helpers.findInputAndType(driver, 'input.user-location', location);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        await helpers.waitForTextInDom(driver, expectedMsg);

        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain(expectedMsg);
        await clearUsername(driver);
      });

      it('should let you create a new unauthorized teacher', async function () {
        let username = `bunny`;
        await helpers.findInputAndType(driver, 'input.user-username', username);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '#user-info');

        expect(await helpers.findAndGetText(driver, 'ul.waiting-auth>li:first-child')).to.contain('bunny');
      });

      it('should let you create a new authorized student', async function () {
        let oldUsername = `bunny`;
        let username = `beyonce`;
        let password = 'test45678!';
        let firstName = `Beyonce`;
        await helpers.findAndClickElement(driver, '#new-user-link');
        await helpers.waitForSelector(driver, 'div#user-new');
        await helpers.selectOption(driver, 'my-select', 'Student');
        await helpers.findInputAndType(driver, 'input.user-username', oldUsername);
        await helpers.findInputAndType(driver, 'input.user-password', password);
        await helpers.findInputAndType(driver, 'input.user-first-name', firstName);
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.findAndClickElement(driver, '#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain('Username already exists');
        await clearUsername(driver);
        await helpers.findInputAndType(driver, 'input.user-username', username);
        await helpers.findInputAndType(driver, 'input.user-last-name', '');
        await helpers.findAndClickElement(driver, '#new-user-btn');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'ul.student-users>li:first-child')).to.contain('beyonce');
      });

    }

    function changeAuth() {
      it('should authorize a new user', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.findAndClickElement(driver, 'button.save-user');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'ul.teacher-users>li:first-child')).to.contain('bunny');
      });
    }

    function changeAccountType() {
      it('should change a teacher to a student', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.selectOption(driver, 'my-select', 'Student');
        await helpers.findAndClickElement(driver, 'button.save-user');

        await helpers.waitForSelector(driver, 'button.edit-user');
      });
    }

    function confirmEmail() {
      it('should manually confirm email', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.findAndClickElement(driver, 'input.user-email-auth');
        await helpers.findAndClickElement(driver, 'button.save-user');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'td.is-email-confirm')).to.contain('true');
      });
    }

    describe('Visiting the users list home page', function () {
      before(async function () {
        await helpers.navigateAndWait(driver, `${host}/users`, {selector: '#user-home'});
      });

      it('should display a welcome page', async function () {
        await helpers.waitForSelector(driver, '#user-home');
      });

      it('should have a create new user link', async function () {
        await helpers.findAndClickElement(driver, `a[href="users/new"]`);
      });

      it('should display a list with your account', async function () {
        expect(await helpers.getWebElements(driver, 'ul.your-account>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.your-account>li:first-child')).to.contain('pdadmin');
      });

      it('should have a list of users waiting authorization', async function () {
        expect(await helpers.getWebElements(driver, 'ul.waiting-auth>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.waiting-auth>li:first-child')).to.contain('wes');
      });

      it('should have a list of teachers', async function () {
        expect(await helpers.getWebElements(driver, 'ul.teacher-users>li')).to.have.lengthOf.at.least(5);
        expect(await helpers.findAndGetText(driver, 'ul.teacher-users>li:first-child')).to.contain('msmith');
      });

      it('should have a list of students', async function () {
        expect(await helpers.getWebElements(driver, 'ul.student-users>li')).to.have.lengthOf.at.least(3);
        expect(await helpers.findAndGetText(driver, 'ul.student-users>li:first-child')).to.contain('newstudent');
      });

      describe('clicking on your own account', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, `.your-account li a`);
          await helpers.waitForSelector(driver, 'div#user-info');
        });
        validateUsersPage();
      });

      describe('clicking the Create New User link', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, '#new-user-link');
          await helpers.waitForSelector(driver, 'div#user-new');
        });
        validateNewUserPage();
      });

      describe('authorizing a user', async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("bunny"));
          link.click();
        });
        await changeAuth();
      });

     describe("changing a user's account type", async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("eeyore"));
          link.click();
        });
        await changeAccountType();
      });

      describe('manually authorize a user\'s email', async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("perryu"));
          link.click();
        });
        await confirmEmail();
      });

    });
  });

  describe('Logged in as a teacher', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, css.topBar.logout);
      await helpers.login(driver, host, helpers.regUser);
      await helpers.findAndClickElement(driver, css.topBar.users);
    });

    function validateUsersPage() {
      it('should show/hide various editable fields', async function () {
        const inputs = ['input.user-first-name', 'input.user-last-name', 'input.user-location'];
        expect(await helpers.isTextInDom(driver, helpers.pdAdmin.username)).to.be.true;

        await helpers.findAndClickElement(driver, 'button.edit-user');
        // should there be an input to change username?
        for (let input of inputs) {
          // eslint-disable-next-line no-await-in-loop
          expect(await helpers.isElementVisible(driver, input)).to.be.true;
        }
        await helpers.findAndClickElement(driver, 'button.save-user');
      });
    }

    function validateNewUserPage() {
      let signupMessages = messages.signup;
      it('should display the page title and form', async function () {
        expect(await helpers.isTextInDom(driver, 'Create a New Student')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'article.user')).to.be.true;
      });

      it('should show certain fields', async function () {
        expect(await helpers.isElementVisible(driver, 'input.user-username')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-password')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-first-name')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-last-name')).to.be.true;

      });

      it('should not let you submit form with missing fields', async function () {
        let username = `mystudent`;
        await helpers.findInputAndType(driver, 'input.user-username', username);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain('Username & Password are required');
      });

      it('should not let you submit form with invalid password', async function() {
        let tooShortPass = 'tooshort';
        let expectedMsg = signupMessages.errors.passwordTooShort;
        await helpers.findInputAndType(driver, 'input.user-password', tooShortPass);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain(expectedMsg);
      });

      it('should not let you submit form with invalid username', async function() {
        let badUsername = 'bad@bad.com';
        let password = 'test45678!';

        let expectedMsg = helpers.signupErrors.username;

        await clearAndTypeInput(driver, 'password', password);
        await clearAndTypeInput(driver, 'username', badUsername);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain(expectedMsg);
      });

      it('should not let you submit form with black-listed username', async function() {
        let badUsername = 'admin';
        let expectedMsg = `"username" ${helpers.signupErrors.blackListed}`;
        await clearAndTypeInput(driver, 'username', badUsername);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '.error-message');
        expect(await helpers.findAndGetText(driver, '.error-message')).to.contain(expectedMsg);
      });

      it('should let you create a new student', async function () {
        let password = 'test45678!';
        let username = 'mystudent';
        let name = `mystudent`;

        await clearAndTypeInput(driver, 'username', username);
        await helpers.findInputAndType(driver, 'input.user-password', password);
        await helpers.findInputAndType(driver, 'input.user-first-name', name);
        await helpers.findAndClickElement(driver, 'button#new-user-btn');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'ul.your-users>li:first-child')).to.contain('mystudent');
      });
    }

    function changeAuth() {
      it('should unauthorize a new student', async function () {
        await helpers.findAndClickElement(driver, 'button.edit-user');
        await helpers.findAndClickElement(driver, 'input.user-isAuth');
        await helpers.findAndClickElement(driver, 'button.save-user');
        await helpers.waitForSelector(driver, '#user-info');
        expect(await helpers.findAndGetText(driver, 'ul.your-users>li:first-child')).to.contain('mystudent');
      });
    }

    describe('Visiting the users list home page', function () {
      before(async function () {
        await helpers.navigateAndWait(driver, `${host}/users`, {selector: '#user-home'});
      });

      it('should display a welcome page', async function () {
        await helpers.waitForSelector(driver, '#user-home');
      });

      it('should have a create new user link', async function () {
        await helpers.findAndClickElement(driver, `a[href="users/new"]`);
      });

      it('should display a list with your account', async function () {
        expect(await helpers.getWebElements(driver, 'ul.your-account>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.your-account>li:first-child')).to.contain('morty');
      });

      it('should have a list of users you have created', async function () {
        expect(await helpers.getWebElements(driver, 'ul.your-users>li')).to.have.lengthOf.at.least(1);
      });

      it('should have a list of users in your org', async function () {
        expect(await helpers.getWebElements(driver, 'ul.org-users>li')).to.have.lengthOf.at.least(8);
        expect(await helpers.findAndGetText(driver, 'ul.org-users>li:first-child')).to.contain('bunny');
      });

      describe('clicking on your own account', async function () {
        before(async function () {
          await helpers.findAndClickElement(driver, `.your-account li a`);
          await helpers.waitForSelector(driver, 'div#user-info');
        });
        await validateUsersPage();
      });

      describe('clicking the Create New User link', async function () {
        before(async function () {
          await helpers.findAndClickElement(driver, '#new-user-link');
          await helpers.waitForSelector(driver, 'div#user-new');
        });
        await validateNewUserPage();
      });

      describe('unauthorizing a user', async function () {
        before(async function () {
          const link = await driver.findElement(By.linkText("mystudent"));
          link.click();
        });
        await changeAuth();
      });

    });
  });


});
