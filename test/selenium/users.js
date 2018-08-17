// REQUIRE MODULES
const {Builder, By, Key, until} = require('selenium-webdriver')
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

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
    driver.quit();
  });

  describe('Logged in as an admin user', function () {
    before(async function () {
      // await helpers.findAndClickElement(driver, css.topBar.logout);
      // await helpers.waitForSelector(driver, css.topBar.login);
      await helpers.login(driver, host);
      await helpers.waitForSelector(driver, css.topBar.users);
    });

    function validateUsersPage() {
      it('should show/hide various editable fields', async function () {
        const inputs = ['input.user-username', 'input.user-name', 'input.user-location'];
        expect(await helpers.isTextInDom(driver, helpers.admin.username)).to.be.true;

        await helpers.findAndClickElement(driver, 'button.edit-user');

        // should there be an input to change username?
        for (let input of inputs) {
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
        expect(await helpers.isElementVisible(driver, 'input.user-name')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-organization')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.user-location')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.account-type')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.isAuthorized')).to.be.true;
      });

      xit('should let you create a new authorized user', async function () {
        let username = `muzzy`
        let displayName = 'muzzy'
        await helpers.findInputAndType(driver, 'form#newUser input.displayName', displayName);
        await helpers.findInputAndType(driver, 'form#newUser input.userName', username);
        await helpers.findAndClickElement(driver, 'button.newUser');
        await helpers.waitForSelector(driver, 'ul.listing');
        expect(await helpers.findAndGetText(driver, 'ul.auth-users>li.is-authorized:last-child')).to.contain(username);
      });
    }

    describe('Visiting the users list home page', function () {
      before(async function () {
        await helpers.navigateAndWait(driver, `${host}/#/users/home`, '#user-home');
      });

      it('should display a welcome page', async function () {
        await helpers.waitForSelector(driver, '#user-home');
      });

      it('should have a side list of users', async function () {
        await helpers.waitForSelector(driver, 'nav.listbox');
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
        expect(await helpers.findAndGetText(driver, 'ul.waiting-auth>li:first-child')).to.contain('nope');
      });

      it('should have a list of admins', async function () {
        expect(await helpers.getWebElements(driver, 'ul.admin-users>li')).to.have.lengthOf.at.least(6);
        expect(await helpers.findAndGetText(driver, 'ul.admin-users>li:first-child')).to.contain('superuser');
      });

      it('should have a list of pd admins', async function () {
        expect(await helpers.getWebElements(driver, 'ul.pd-users>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.pd-users>li:first-child')).to.contain('pdadmin');
      });

      it('should have a list of teachers', async function () {
        expect(await helpers.getWebElements(driver, 'ul.teacher-users>li')).to.have.lengthOf.at.least(11);
        expect(await helpers.findAndGetText(driver, 'ul.teacher-users>li:last-child')).to.contain('hle22');
      });

      it('should have a list of students', async function () {
        expect(await helpers.getWebElements(driver, 'ul.student-users>li')).to.have.lengthOf.at.least(1);
        expect(await helpers.findAndGetText(driver, 'ul.student-users>li:first-child')).to.contain('student1');
      });

      describe('clicking on your own account', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, `a[href$="${helpers.admin.username}"]`);
          await helpers.waitForSelector(driver, 'div#user-info');
        });
        validateUsersPage();
      });

      describe('Visiting a user page directly', async function () {
        before(async function () {
          await helpers.navigateAndWait(driver, `${host}/#/users/${helpers.admin.username}`, 'article.user');

        });
        validateUsersPage();
      });

      describe('clicking the Create New User link', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, '#new-user-link');
          await helpers.waitForSelector(driver, 'div#user-new-admin');
        });
        validateNewUserPage();
      });
    });
  });

  xdescribe('Logged in as an pd Admin', function () {
    before(async function () {
      await helpers.findAndClickElement(driver, css.topBar.logout);
      await helpers.waitForSelector(driver, css.topBar.login);
      await helpers.login(driver, host);
      await helpers.waitForSelector(driver, css.topBar.users);
    });

    function validateUsersPage() {
      xit('should show/hide various editable fields', async function () {
        const inputs = ['button.doneTour', 'input.isAdmin', 'input.isAuthorized'];
        expect(await helpers.isTextInDom(driver, helpers.admin.username)).to.be.true;

        await helpers.findAndClickElement(driver, 'button.editUser');

        // should there be an input to change username?
        for (let input of inputs) {
          expect(await helpers.isElementVisible(driver, input)).to.be.true;
        }
        await helpers.findAndClickElement(driver, 'button.saveUser');
      });
    }

    function validateNewUserPage() {
      xit('should display the page title and form', async function () {
        expect(await helpers.isTextInDom(driver, 'Create New User')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'form#newUser')).to.be.true;
      });

      xit('should show certain fields', async function () {
        expect(await helpers.isElementVisible(driver, 'input.displayName')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.userName')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.isAuthorized')).to.be.true;
      });

      xit('should let you create a new authorized user', async function () {
        let username = `muzzy`
        let displayName = 'muzzy'
        await helpers.findInputAndType(driver, 'form#newUser input.displayName', displayName);
        await helpers.findInputAndType(driver, 'form#newUser input.userName', username);
        await helpers.findAndClickElement(driver, 'button.newUser');
        await helpers.waitForSelector(driver, 'ul.listing');
        expect(await helpers.findAndGetText(driver, 'ul.auth-users>li.is-authorized:last-child')).to.contain(username);
      });
    }

    describe('Visiting the users page', function () {
      before(async function () {
        await helpers.navigateAndWait(driver, `${host}/#/users`, 'a.user');
      });

      it('should have a create new user link', async function () {
        //expect(await helpers.isElementVisible(driver, 'a[href="#/users/new"]')).to.be.true;
        await helpers.findAndClickElement(driver, `a[href="users/new"]`);
      });

      it('should have a list of users', async function () {
        expect(await helpers.getWebElements(driver, 'a.user')).to.have.lengthOf.at.least(10);
      });

      describe('clicking the user link', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, `a[href$="${helpers.admin.username}"]`);
          await helpers.waitForSelector(driver, 'article.user');
        });
        validateUsersPage();
      });

      describe('Visiting a user page directly', async function () {
        before(async function () {
          await helpers.navigateAndWait(driver, `${host}/#/users/${helpers.admin.username}`, 'article.user');

        });
        validateUsersPage();
      });

      describe('clicking the new user link', function () {
        before(async function () {
          await helpers.findAndClickElement(driver, '#new-user-link');
          await helpers.waitForSelector(driver, 'form#newUser');
        });
        validateNewUserPage();
      });
    });
  });

  xdescribe('Logged in as a teacher', function() {
    before(async function() {
      await helpers.login(driver, host, helpers.regUser);
      await helpers.waitForSelector(driver, css.topBar.users);
    });

    async function validateUsersPage(user){
      const shoulds = [helpers.regUser.username, 'Name', 'Last Seen', 'Seen Tour', 'Username', 'Display Name'];
      for (let str of shoulds) {
        it(`${str} should be in DOM`, async function() {
          expect(await helpers.isTextInDom(driver, str)).to.be.true;
        });
      }
      it('edit user button should not be visible', async function() {
        expect(await helpers.isElementVisible(driver, 'button.editUser')).to.eql(false);
      });
    }

    describe('Visiting the users page', function() {
      before(async function() {
        try {
          await driver.findElement(By.css('a.menu.users')).click();
          await driver.wait(until.elementLocated(By.css('a.user')));
        }catch(err) {
          console.log(err);
        }
      });

      it('should have a list of users', async function() {
        expect(await helpers.getWebElements(driver, 'a.user')).to.have.lengthOf.at.least(10);
      });

      describe('clicking the user link', function() {
        before(async function() {
          await helpers.findAndClickElement(driver, `a[href$="${helpers.regUser.username}"]`);
          await helpers.waitForSelector(driver, 'article.user');
        });
        describe('user info table', function() {
          validateUsersPage();
        });
      });

      describe('Visiting a user page directly', function() {
        before(async function() {
          await helpers.navigateAndWait(driver, `${host}/#/users/${helpers.regUser.username}`, 'article.user');
        });
        describe('user info table', function() {
          validateUsersPage();
        });

      });
    });
  });


});
