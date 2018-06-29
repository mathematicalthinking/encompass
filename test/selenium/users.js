// REQUIRE MODULES
const {Builder, By, Key, until} = require('selenium-webdriver')
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Users', function() {
  this.timeout('10s');
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

  describe('Anonymously', function() {
   before(async function() {
    try {
      let options = await driver.manage();
      await options.deleteAllCookies();
    }catch(err) {
      console.log(err);
    }
    await helpers.navigateAndWait(driver, host, css.topBar.login);
    await helpers.navigateAndWait(driver, `${host}/#/users`, 'a.user');
   });

   function validateAnon(){
     xit('should show various fields', async function(){
      expect(await helpers.isTextInDom(driver, 'Display Name')).to.be.true;
     });
   }

   describe('Visiting the users page', function() {
     it('there is only one user in the list', async function() {
      expect(await helpers.getWebElements(driver, 'a.user')).to.have.lengthOf(1);
      expect(await helpers.findAndGetText(driver, 'a.user')).to.eql('anon');
     });

     describe('clicking the user link', function() {
       before(async function() {
         await helpers.findAndClickElement(driver, 'a.user');
         await helpers.waitForSelector(driver, 'article.user');
       });
       validateAnon();
     });
   });

   describe('Visiting a user page directly', function() {
     before(async function() {
      await helpers.navigateAndWait(driver, `${host}/#/users`, 'a.user');
     });
     validateAnon();
   });
  });

  describe('Logged in as a regular user', function() {
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

  describe('Logged in as an admin user', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, css.topBar.logout);
      await helpers.waitForSelector(driver, css.topBar.login);
      await helpers.login(driver, host);
      await helpers.waitForSelector(driver, css.topBar.users);
    });

    function validateUsersPage(){
      it('should show/hide various editable fields', async function(){
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
      it('should display the page title and form', async function() {
        expect(await helpers.isTextInDom(driver, 'Create New User')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'form#newUser')).to.be.true;
      });

      it('should show certain fields', async function() {
        expect(await helpers.isElementVisible(driver, 'input.displayName')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.userName')).to.be.true;
        expect(await helpers.isElementVisible(driver, 'input.isAuthorized')).to.be.true;
      });

      it('should let you create a new authorized user', async function() {
        let username = `muzzy`
        let displayName = 'muzzy'
        await helpers.findInputAndType(driver, 'form#newUser input.displayName', displayName);
        await helpers.findInputAndType(driver, 'form#newUser input.userName', username);
        await helpers.findAndClickElement(driver, 'button.newUser');
        await helpers.waitForSelector(driver, 'ul.listing');

        expect(await helpers.findAndGetText(driver, 'ul.listing>li.is-authorized:last-of-type')).to.contain(username);
      });
    }

    describe('Visiting the users page', function() {
      before(async function() {
        await helpers.navigateAndWait(driver, `${host}/#/users`, 'a.user');
      });

      it('should have a create new user link', async function() {
        await driver.sleep(7000);
        //expect(await helpers.isElementVisible(driver, 'a[href="#/users/new"]')).to.be.true;
        await helpers.findAndClickElement(driver, `a[href="users/new"]`);
      });

      it('should have a list of users', async function() {
        expect(await helpers.getWebElements(driver, 'a.user')).to.have.lengthOf.at.least(10);
      });

      describe('clicking the user link', function() {
        before(async function() {
          await helpers.findAndClickElement(driver, `a[href$="${helpers.admin.username}"]`);
          await helpers.waitForSelector(driver, 'article.user');
        });
        validateUsersPage();
      });

      describe('Visiting a user page directly', async function() {
        before(async function() {
          await helpers.navigateAndWait(driver, `${host}/#/users/${helpers.admin.username}`, 'article.user');
        });
        validateUsersPage();
      });

      describe('clicking the new user link', function() {
        before(async function() {
          await helpers.findAndClickElement(driver, 'a[href$="/users/new"]');
          await helpers.waitForSelector(driver, 'form#newUser');
        });
        validateNewUserPage();
      });
    });
  });
});
