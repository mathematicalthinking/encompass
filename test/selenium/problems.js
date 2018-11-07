// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const testUsers = require('./fixtures/users');
let topLink = css.topBar.problems;


describe('Problems', async function () {
  async function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, problems, organization, username } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';
      const isAdmin = accountType === 'A';

      describe(`As ${testDescriptionTitle}`, function() {
        this.timeout(helpers.timeoutTestMsStr);
        let driver = null;

        before(async function() {
          driver = new Builder()
            .forBrowser('chrome')
            .build();
            await dbSetup.prepTestDb();
            return helpers.login(driver, host, user);
          });

        after(function() {
          return driver.quit();
        });

        describe('Visiting problems main page', function () {
          before(async function () {
            await helpers.findAndClickElement(driver, topLink);
            if (!isStudent) {
              await helpers.waitForSelector(driver, css.problemPageSelectors.problemContainer);
            }
          });

          it('should display side list of filter options', async function () {
            if (!isStudent) {
              expect(await helpers.waitForSelector(driver, css.problemPageSelectors.sideFilterOptions));
            }
            let optionsList = css.problemFilterList.primaryFilters;
            let filterOptions = helpers.createFilterList(isStudent, isAdmin, optionsList, true);
            let filterSelectors = helpers.createSelectors(filterOptions);
            expect(await helpers.checkSelectorsExist(driver, filterSelectors)).to.be.true;
          });

          it('should display category filter options', async function () {
            if (!isStudent) {
              await helpers.findAndClickElement(driver, '.category-header');
              let filterSelectors = helpers.createSelectors(css.problemFilterList.categoryFilters);
              expect(await helpers.checkSelectorsExist(driver, filterSelectors)).to.be.true;
              await helpers.findAndClickElement(driver, '.category-header');
            }
          });

          it('should update problem list when clicking on Public', async function () {
            if (!isStudent) {
              await helpers.findAndClickElement(driver, 'li.filter-everyone');
              let resultsMsg = `${problems.public.count} problems found`;
              expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
            }
          });

          it('should update problem list when clicking on Mine', async function () {
            if (!isStudent) {
              await helpers.findAndClickElement(driver, 'li.filter-mine');
              let resultsMsg = `${problems.mine.count} problems found`;
              expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
            }
          });

          describe('Clicking on My Org filter option', function () {
            before(async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.filter-myOrg');
              }
            });

            it('should update problem list when clicking on My Org', async function () {
              if (!isStudent) {
                let resultsMsg = `${problems.org.total} problems found`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              }
            });

            it('should update problem list when unchecking created by members', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.fromOrg');
                await driver.sleep(500);
                let resultsMsg = `${problems.org.recommended} problems found`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              }
            });

            it('should update problem list when unchecking recommended', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.recommended');
                await driver.sleep(500);
                let resultsMsg = `No results found. Please try expanding your filter criteria.`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              }
            });

            it('should update problem list when checking created by members', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.fromOrg');
                await driver.sleep(500);
                let resultsMsg = `${problems.org.members} problems found`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              }
            });
          });

          if (isAdmin) {
            describe('Clicking on Trashed problems', function () {
              before(async function () {
                await helpers.findAndClickElement(driver, '.more-header');
              });

              it('should update problem list and display message', async function () {
                await helpers.findAndClickElement(driver, '#toggle-trashed');
                let resultsMsg = `2 problems found - Displaying Trashed Problems`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              });

              it('should restore a trashed problem', async function () {
                await helpers.findAndClickElement(driver, 'button.primary-button');
                await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                await driver.sleep(500);
                let resultsMsg = `1 problems found - Displaying Trashed Problems`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              });

              it('should continue displaying trashed problems until unchecked', async function () {
                await helpers.findAndClickElement(driver, 'li.filter-mine');
                let resultsMsg = `${problems.mine.count} problems found - Displaying Trashed Problems`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
                await helpers.findAndClickElement(driver, '#toggle-trashed');
                let updatedMsg = `${problems.mine.count} problems found`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(updatedMsg);
                await helpers.findAndClickElement(driver, '.more-header');
              });
            });

            describe('Clicking on All problems filter', function () {
              before(async function () {
                await helpers.findAndClickElement(driver, '.filter-all');
              });

              it('should update problem list and display message', async function () {
                await driver.sleep(500);
                let resultsMsg = `${problems.all.total} problems found`;
                expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              });

              // it('should restore a trashed problem', async function () {
              //   await helpers.findAndClickElement(driver, 'button.primary-button');
              //   await helpers.findAndClickElement(driver, 'button.swal2-confirm');
              //   await driver.sleep(500);
              //   let resultsMsg = `1 problems found - Displaying Trashed Problems`;
              //   expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              // });

              // it('should continue displaying trashed problems until unchecked', async function () {
              //   await helpers.findAndClickElement(driver, 'li.filter-mine');
              //   let resultsMsg = `${problems.mine.count} problems found - Displaying Trashed Problems`;
              //   expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(resultsMsg);
              //   await helpers.findAndClickElement(driver, '#toggle-trashed');
              //   let updatedMsg = `${problems.mine.count} problems found`;
              //   expect(await helpers.findAndGetText(driver, 'div.results-message')).to.contain(updatedMsg);
              //   await helpers.findAndClickElement(driver, '.more-header');
              // });
            });
          }
        });
      });
    }
    for (let user of Object.keys(users)) {
      // eslint-disable-next-line no-await-in-loop
      await _runTests(users[user]);
    }
  }
  await runTests(testUsers);
});



//SORT BAR
//Test to check sort bar is there - options are accurate
//Test to check alphabetical sorting
//Test to check date sorting
//Test to check privacy filtering
//Test to check status filtering

//RESULTS
//Test that list view displays everything properly
//Test that card view displays everything properly
//Test that values update when changes are made
//Test button values are acurate
//Test more menu shows correct values
//Test button actions perform correctly
//Test more actions perform correctly
//Test pagination works

//SEARCH BAR
//Test that there are 2 drop down items
//Search works with enter and clicking button
//Clear button shows when query is applied or text in field
//Clearing search bar resets results properly
//Searching only applies to results of primary filters
//Searching should work for title, text, author, additional Info, status, flagReason, status, sharingAuth/copyright in that order
