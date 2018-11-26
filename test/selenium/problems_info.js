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

            //Test following is always visible
            // Problem Title
            // Problem Create Date
            // 4 meny headers (change active status) - be able to click any
            // Copy
            // Recommend (not teacher)
            // Edit btn
            // Assign btn

            describe(`Checking the following is always visible`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, topLink);
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
                  return css.problemNew.menuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should show the applicable action buttons', async function () {
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'title', true)).to.contain('problem title');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#title')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'statement', true)).to.contain('problem statement');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputQuill + '#editor')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'author', true)).to.contain('author');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#author')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'privacy', true)).to.contain('privacy');
                expect(await helpers.getWebElements(driver, css.problemNew.inputContentBlock + ' ul li')).to.have.lengthOf(3);
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



// Test visible for general
  // Problem Statement
  // Problem Status
  // Author (if applicable)
  // Organization (if applicable)
  // Flag reason - Admin

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
