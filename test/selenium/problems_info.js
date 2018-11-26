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
const testUsers = require('./fixtures/users');
const topLink = css.topBar.problems;

describe('Problems New', async function () {
  function runTests(users) {
    function _runTests(user) {
      const {
        accountType,
        actingRole,
        testDescriptionTitle,
        problemInfo
      } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';
      const isAdmin = accountType === 'A';
      const isTeacher = accountType === 'T';

      describe(`As ${testDescriptionTitle}`, function () {
        this.timeout(helpers.timeoutTestMsStr);
        let driver = null;

        before(async function () {
          driver = new Builder()
            .forBrowser('chrome')
            .build();
          driver.manage().window().setRect({
            width: 1580,
            height: 1080
          });
          await dbSetup.prepTestDb();
          return helpers.login(driver, host, user);
        });

        after(function () {
          return driver.quit();
        });

        if (!isStudent) {
          describe('Visiting problem info', function () {
            before(async function () {
              await helpers.waitForAndClickElement(driver, topLink);
            });

            describe(`Checking the following is always visible`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, problemInfo.selector);
                await driver.sleep(500);
                let selectors = ['.info-header', '.side-info-menu'];
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should should privacy setting icon with hover tooltip', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.privacySettingParent);
                expect(await helpers.hasTooltipValue(driver, css.problemInfo.privacySettingParent, problemInfo.privacySetting)).to.be.true;
              });

              it('should show problem title and create date', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemName);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemInfo.title);
                await helpers.waitForSelector(driver, css.problemInfo.problemDate);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemDate)).to.contain(problemInfo.createDate);
              });

              it('should show 4 clickable menu headers', async function () {
                let tabNames = ['general', 'categories', 'additional', 'legal'];
                let selectors = tabNames.map((tab) => {
                  return css.problemInfo.problemMenuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should show the applicable action buttons', async function () {
                expect(await helpers.isElementVisible(driver, css.problemInfo.assignButton)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemInfo.copyButton)).to.be.true;
                if (!isTeacher) {
                  expect(await helpers.isElementVisible(driver, css.problemInfo.editButton)).to.be.true;
                  expect(await helpers.isElementVisible(driver, css.problemInfo.recommendButton)).to.be.true;
                }
              });
            });

            // Test visible for general
              // Organization (if applicable)
              // Flag reason - Admin

            describe(`Checking general page displays correct info`, function () {

              it('should should the problem statement', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemStatementCont);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatementCont)).to.contain(problemInfo.statement);
              });

              it('should show problem status', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemStatus);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatus, true)).to.contain(problemInfo.status);
              });

              it('should show problem author', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemAuthor);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemAuthor)).to.contain(problemInfo.author);
              });





            });

            xdescribe(`Checking categories page displays correct info`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, problemInfo.selector);
                await driver.sleep(500);
                let selectors = ['.info-header', '.side-info-menu'];
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should should privacy setting icon with hover tooltip', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.privacySettingParent);
                expect(await helpers.hasTooltipValue(driver, css.problemInfo.privacySettingParent, problemInfo.privacySetting)).to.be.true;
              });

              it('should show problem title and create date', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemName);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemInfo.title);
                await helpers.waitForSelector(driver, css.problemInfo.problemDate);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemDate)).to.contain(problemInfo.createDate);
              });

              it('should show 4 clickable menu headers', async function () {
                let tabNames = ['general', 'categories', 'additional', 'legal'];
                let selectors = tabNames.map((tab) => {
                  return css.problemInfo.problemMenuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should show the applicable action buttons', async function () {
                expect(await helpers.isElementVisible(driver, css.problemInfo.assignButton)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemInfo.copyButton)).to.be.true;
                if (!isTeacher) {
                  expect(await helpers.isElementVisible(driver, css.problemInfo.editButton)).to.be.true;
                  expect(await helpers.isElementVisible(driver, css.problemInfo.recommendButton)).to.be.true;
                }
              });
            });

            xdescribe(`Checking additional page displays correct info`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, problemInfo.selector);
                await driver.sleep(500);
                let selectors = ['.info-header', '.side-info-menu'];
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should should privacy setting icon with hover tooltip', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.privacySettingParent);
                expect(await helpers.hasTooltipValue(driver, css.problemInfo.privacySettingParent, problemInfo.privacySetting)).to.be.true;
              });

              it('should show problem title and create date', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemName);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemInfo.title);
                await helpers.waitForSelector(driver, css.problemInfo.problemDate);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemDate)).to.contain(problemInfo.createDate);
              });

              it('should show 4 clickable menu headers', async function () {
                let tabNames = ['general', 'categories', 'additional', 'legal'];
                let selectors = tabNames.map((tab) => {
                  return css.problemInfo.problemMenuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should show the applicable action buttons', async function () {
                expect(await helpers.isElementVisible(driver, css.problemInfo.assignButton)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemInfo.copyButton)).to.be.true;
                if (!isTeacher) {
                  expect(await helpers.isElementVisible(driver, css.problemInfo.editButton)).to.be.true;
                  expect(await helpers.isElementVisible(driver, css.problemInfo.recommendButton)).to.be.true;
                }
              });
            });

            xdescribe(`Checking legal page displays correct info`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, problemInfo.selector);
                await driver.sleep(500);
                let selectors = ['.info-header', '.side-info-menu'];
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should should privacy setting icon with hover tooltip', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.privacySettingParent);
                expect(await helpers.hasTooltipValue(driver, css.problemInfo.privacySettingParent, problemInfo.privacySetting)).to.be.true;
              });

              it('should show problem title and create date', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemName);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemInfo.title);
                await helpers.waitForSelector(driver, css.problemInfo.problemDate);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemDate)).to.contain(problemInfo.createDate);
              });

              it('should show 4 clickable menu headers', async function () {
                let tabNames = ['general', 'categories', 'additional', 'legal'];
                let selectors = tabNames.map((tab) => {
                  return css.problemInfo.problemMenuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should show the applicable action buttons', async function () {
                expect(await helpers.isElementVisible(driver, css.problemInfo.assignButton)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemInfo.copyButton)).to.be.true;
                if (!isTeacher) {
                  expect(await helpers.isElementVisible(driver, css.problemInfo.editButton)).to.be.true;
                  expect(await helpers.isElementVisible(driver, css.problemInfo.recommendButton)).to.be.true;
                }
              });
            });



          });
        }

      });
    }
    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));
  }
  await runTests(testUsers);
});


// Test visible for categories
  // Categories
    //If exists, should have url and description
  // Keywords

// Test visible for additional
  // Additional info textarea
  // Additional image (if applicable)
  // Created by as link to user profile
  // Problem origin (if copied)

// Test visible for legal
  // Copyright notice value
  // Sharing Auth value
  // Created by as link to user profile
  // Problem origin (if copied)

  // Test button functions
    // Copy
    // Recommend
    // Assign
    // Edit - new set of tests
