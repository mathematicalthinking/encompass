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

              it('general page should have four inputs with labels', async function () {
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


              // it('should update problem list when unchecking recommended', async function () {
              //   if (!isStudent) {
              //     await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
              //     await helpers.waitForSelector(driver, css.resultsMesasage);
              //     await helpers.waitForTextInDom(driver, css.noResultsMsg);
              //     expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(css.noResultsMsg);
              //   }
              // });

              // it('should update problem list when checking created by members', async function () {
              //   if (!isStudent) {
              //     await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
              //     await helpers.waitForSelector(driver, css.resultsMesasage);
              //     let resultsMsg = `${problems.org.members} problems found`;
              //     await helpers.waitForTextInDom(driver, resultsMsg);
              //     expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
              //     await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
              //   }
              // });
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
