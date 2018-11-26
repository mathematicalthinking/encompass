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

describe('Problems Info', async function () {
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

              it('should show privacy setting icon with hover tooltip', async function () {
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

            describe(`Checking general page displays correct info`, function () {

              it('should show the problem statement', async function () {
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

              if (isAdmin) {
                describe(`Checking general page displays info for admins`, function () {
                  before(async function () {
                    await helpers.waitForAndClickElement(driver, '.remove-icon');
                    await driver.sleep(800);
                    await helpers.findAndClickElement(driver, problemInfo.selector2);
                    await driver.sleep(500);
                  });

                  it('should show problem organization', async function () {
                    await helpers.waitForSelector(driver, css.problemInfo.problemOrg);
                    expect(await helpers.findAndGetText(driver, css.problemInfo.problemOrg, true)).to.contain(problemInfo.org);
                  });

                  it('should show flagged problem', async function () {
                    await helpers.waitForSelector(driver, css.problemInfo.problemStatus);
                    expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatus, true)).to.contain(problemInfo.status2);
                  });

                  it('should display flag reason and more detials', async function () {
                    await helpers.findAndClickElement(driver, css.problemInfo.flagReasonBtn);
                    await helpers.waitForSelector(driver, css.problemInfo.flagReasonCont);
                    expect(await helpers.findAndGetText(driver, css.problemInfo.flagReason, true)).to.contain(problemInfo.flagReason);
                    expect(await helpers.findAndGetText(driver, css.problemInfo.flagReasonDetails, true)).to.contain(problemInfo.flagDetails);
                  });
                });
              }


            });

            describe(`Checking categories page displays correct info`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, css.problemInfo.problemMenuTab + 'categories');
                await driver.sleep(800);
                let selectors = [css.problemInfo.problemCategoryHeader, css.problemInfo.problemKeywordHeader];
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should show list of categories - if applicable', async function () {
                if (problemInfo.categories) {
                  await helpers.waitForSelector(driver, css.problemInfo.problemCategory);
                  let categories = problemInfo.categories;
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemCategoryItem + ':first-child')).to.contain(categories[0]);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemCategoryItem + ':first-child p.category-description', true)).to.contain(problemInfo.categoryDesc);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemCategoryItem + ':nth-child(2)')).to.contain(categories[1]);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemCategoryItem + ':nth-child(3)')).to.contain(categories[2]);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.problemCategoryHeader);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemCategoryNone, true)).to.contain('no problem categories');
                }
              });

              it('should problem keywords - if applicable', async function () {
                if (problemInfo.keywords) {
                  let keywords = problemInfo.keywords;
                  await helpers.waitForSelector(driver, css.problemInfo.problemKeyword);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemKeyword + ':first-child')).to.contain(keywords[0]);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemKeyword + ':nth-child(2)')).to.contain(keywords[1]);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.problemKeywordHeader);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemKeywordNone, true)).to.contain('no problem keywords');
                }
              });

            });

      // Test visible for additional
        // Additional info textarea - 2 should have additional info
        // Additional image (if applicable) - add one
        // Created by as link to user profile - if admin
        // Problem origin (if copied) - make one

            describe(`Checking additional page displays correct info`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, css.problemInfo.problemMenuTab + 'additional');
                await driver.sleep(800);
                await helpers.waitForSelector(driver, css.problemInfo.additionalInfo);
              });

              it('should show additional info - if applicable', async function () {
                if (problemInfo.additionalInfo) {
                  await helpers.waitForSelector(driver, css.problemInfo.additionalInfo);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.additionalInfo)).to.contain(problemInfo.additionalInfo);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.additionalInfo);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.additionalInfo, true)).to.contain('no additional info');
                }
              });

              it('should show additional image - if applicable', async function () {
                if (problemInfo.additionalImage) {
                  await helpers.waitForSelector(driver, css.problemInfo.additionalImage);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.additionalImage)).to.contain(problemInfo.additionalInfo);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.additionalImage);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.additionalImage, true)).to.contain('no additional image');
                }
              });

              // it('should show problem origin - if applicable', async function () {
              //   await helpers.waitForSelector(driver, css.problemInfo.problemName);
              //   expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemInfo.title);
              //   await helpers.waitForSelector(driver, css.problemInfo.problemDate);
              //   expect(await helpers.findAndGetText(driver, css.problemInfo.problemDate)).to.contain(problemInfo.createDate);
              // });

              // if (isAdmin) {
              //   it('should show problem creator as a link', async function () {
              //     await helpers.waitForSelector(driver, css.problemInfo.problemName);
              //     expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemInfo.title);
              //     await helpers.waitForSelector(driver, css.problemInfo.problemDate);
              //     expect(await helpers.findAndGetText(driver, css.problemInfo.problemDate)).to.contain(problemInfo.createDate);
              //   });
              // }


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
