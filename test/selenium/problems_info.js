// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const testUsers = require('./fixtures/users');
const topLink = css.topBar.problems;

const handleRetries = function (driver, fetchPromise, numRetries) {
  console.log('inside handleRetries function');
  numRetries = 'undefined' === typeof numRetries ? 1 : numRetries;
  return fetchPromise().catch(function (err) {
    if (numRetries > 0) {
      return handleRetries(driver, fetchPromise, numRetries - 1);
    }
    throw err;
  });
};

describe('Problems', async function () {
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, problems } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';
      const isAdmin = accountType === 'A';
      const isTeacher = accountType === 'T';
      const isPdadmin = accountType === 'P';

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
          describe('Visiting problems new & info pages', function () {
            before(async function () {
              await helpers.findAndClickElement(driver, topLink);
              if (!isStudent) {
                await helpers.waitForSelector(driver, css.problemPageSelectors.problemContainer);
              }
            });
            describe('Clicking on problem new page', function () {
              before(async function () {
                if (!isStudent) {
                  await helpers.findAndClickElement(driver, topLink);
                  await helpers.findAndClickElement(driver, css.topBar.problemsNew);
                }
              });

              it('should open problem new page from topbar', async function () {
                if (!isStudent) {
                  await helpers.waitForSelector('#problem-new');
                  expect(await helpers.findAndGetText(driver, '#problem-new .side-info-menu .info-details .info-main .heading')).to.contain('Create New Problem');
                }
              });

              it('should open problem new page from plus icon', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, '.remove-icon');
                  await driver.sleep(800);
                  await helpers.waitForAndClickElement(driver, 'div.searchbar #problem-new-link');
                  expect(await helpers.findAndGetText(driver, '#problem-new .side-info-menu .info-details .info-main .heading')).to.contain('Create New Problem');
                }
              });

              it('should show a new problem form with 4 headers', async function () {
                if (!isStudent) {
                  let tabNames = ['general', 'categories', 'additional', 'legal'];
                  let selectors = tabNames.map((tab) => {
                    return `#problem-new .side-info-menu .info-details .info-menu button.tab-name.${tab}`;
                  });
                  expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
              });

              it('the general page should have four inputs with labels', async function () {
                if (!isStudent) {
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'title', true)).to.contain('problem title');
                  expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#title')).to.be.true;
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'statement', true)).to.contain('problem statement');
                  expect(await helpers.isElementVisible(driver, css.problemNew.inputQuill + '#editor')).to.be.true;
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'author', true)).to.contain('author');
                  expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#author')).to.be.true;
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'privacy', true)).to.contain('privacy');
                  expect(await helpers.getWebElements(driver, css.problemNew.inputContentBlock + ' ul li')).to.have.lengthOf(3);
                }
              });

              it('should show an error if navigating to next page without filling in required fields', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                  await driver.sleep(800);
                  await helpers.waitForTextInDom(driver, css.problemNew.errorMsgGeneral);
                  expect(await helpers.findAndGetText(driver, '.error-box')).to.contain(css.problemNew.errorMsgGeneral);
                  await helpers.waitForAndClickElement(driver, '.error-box p button i.fa-times');
                }
              });

              it('should show a modal if creating a public problem and go to next page', async function () {
                if (!isStudent) {
                  await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#title', ' New Test Problem ');
                  await helpers.findInputAndType(driver, css.problemNew.inputQuill + '#editor .ql-editor', 'Test problem content');
                  await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#author', 'Test author');
                  await helpers.waitForAndClickElement(driver, css.problemNew.inputContentBlock + '.privacy ul li.radio-item label.radio-label input.everyone');
                  await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                  expect(await helpers.findAndGetText(driver, 'h2#swal2-title', true)).to.contain('are you sure you want to create a public problem');
                  await helpers.waitForAndClickElement(driver, 'button.swal2-confirm');
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
                }
              });

              it('the categories page should have two inputs with labels', async function () {
                if (!isStudent) {
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
                  expect(await helpers.isElementVisible(driver, 'button.show-cats-btn')).to.be.true;
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'keywords', true)).to.contain('problem keywords');
                  expect(await helpers.isElementVisible(driver, css.problemNew.inputSelectize)).to.be.true;
                }
              });

              it('should let you continue without selecting categories or keywords', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'additional', true)).to.contain('additional information');
                }
              });

              it('should let you continue without adding any additional info', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'copyright', true)).to.contain('copyright notice');
                }
              });

              it('should let you go back to categories page', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'additional', true)).to.contain('additional information');
                  await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                  expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
                }
              });

              it('should let you add categories to problem', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, 'button.show-cats-btn');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G.B"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'button[id="CCSS.Math.Content.K.G.B.5"]');
                  await helpers.findAndClickElement(driver, 'button[id="CCSS.Math.Content.K.G.B.6"]');
                  await driver.sleep(500);
                  expect(await helpers.getWebElements(driver, css.problemNew.inputContentBlock + '.categories ul.problem-info li.category-item')).to.have.lengthOf(2);
                }
              });

              it('should let you remove categories to problem', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, css.problemNew.inputContentBlock + '.categories ul.problem-info li.category-item:first-child button.remove-cat');
                  await driver.sleep(500);
                  expect(await helpers.getWebElements(driver, css.problemNew.inputContentBlock + '.categories ul.problem-info li.category-item')).to.have.lengthOf(1);
                  }
              });

              it('should let you hide the categories menu', async function () {
                if (!isStudent) {
                  await helpers.waitForAndClickElement(driver, 'button.hide-cats-btn');
                  await driver.sleep(500);
                  expect(await helpers.findAndGetText(driver, 'button.show-cats-btn', true)).to.contain('show category menu');

                }
              });

            });


          });
        }

      });
    }
    // for (let user of Object.keys(users)) {
    //   // eslint-disable-next-line no-await-in-loop
    //   await _runTests(users[user]);
    // }
    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));
  }
  await runTests(testUsers);
});
