// REQUIRE MODULES
const {
  Builder
} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const problem = helpers.newProblem;
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
        testDescriptionTitle
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
              await helpers.waitForSelector(driver, css.problemPageSelectors.problemContainer);

            });
            describe('Clicking on a problem title', function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, topLink);
                await helpers.waitForAndClickElement(driver, css.topBar.problemsNew);
              });

              it('should open problem new page from topbar', async function () {
                await helpers.waitForSelector(driver, '#problem-new');
                expect(await helpers.findAndGetText(driver, css.problemNew.problemNewHeading)).to.contain('Create New Problem');
              });

              it('should open problem new page from plus icon', async function () {
                await helpers.waitForAndClickElement(driver, '.remove-icon');
                await driver.sleep(800);
                await helpers.waitForAndClickElement(driver, css.problemNew.problemNewBtn);
                expect(await helpers.findAndGetText(driver, css.problemNew.problemNewHeading)).to.contain('Create New Problem');
              });

              it('should show a new problem form with 4 headers', async function () {
                let tabNames = ['general', 'categories', 'additional', 'legal'];
                let selectors = tabNames.map((tab) => {
                  return css.problemNew.menuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('the general page should have four inputs with labels', async function () {
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'title', true)).to.contain('problem title');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#title')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'statement', true)).to.contain('problem statement');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputQuill + '#editor')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'author', true)).to.contain('author');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#author')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'privacy', true)).to.contain('privacy');
                expect(await helpers.getWebElements(driver, css.problemNew.inputContentBlock + ' ul li')).to.have.lengthOf(3);
              });

              it('should show an error if navigating to next page without filling in required fields', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(800);
                await helpers.waitForTextInDom(driver, css.problemNew.errorMsgGeneral);
                expect(await helpers.findAndGetText(driver, '.error-box')).to.contain(css.problemNew.errorMsgGeneral);
                await helpers.waitForAndClickElement(driver, css.problemNew.errorBoxDismiss);
              });

              it('should show a modal if creating a public problem and go to next page', async function () {
                await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#title', problem.startTitle);
                await helpers.findInputAndType(driver, css.problemNew.inputQuill + '#editor .ql-editor', problem.text);
                await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#author', problem.author);
                await helpers.waitForAndClickElement(driver, css.problemNew.privacySetting);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                expect(await helpers.findAndGetText(driver, css.sweetAlert.heading, true)).to.contain('are you sure you want to create a public problem');
                await helpers.waitForAndClickElement(driver, css.sweetAlert.confirmBtn);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
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
