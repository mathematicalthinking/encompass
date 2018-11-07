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

//FILTER OPTIONS
//Test to check all primary filters by account type
/* All users should have:
  * Mine
  * My Org
    * Recommended
    * Created by Org Members
  * Public
*/

/* Admin should also have
  * All
    * Org
    * Creator
    * PoWs
      * Private
      * Public
*/
//Depending on user type check for primary filters to exist
//Click primary filters and check values change accurately

//Test to check category filters
//Test to check more filters - admin only

/* All Users should have Category Search
 * Search/select identifier
 * Button to use menu
 * Toggle include sub categories
 * See categories added to list and be able to remove
 */

/* Admins should have more options
 * Toggle for show trashed
 */




describe('Problems', async function () {
  async function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, sections, organization, username } = user;
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
            console.log('filterOptions are', filterOptions);
            let filterSelectors = helpers.checkFilterSelectors(filterOptions);
            console.log('filterSelectors are', filterSelectors);

            // expect(await helpers.checkSelectorsExist(driver, filterSelectors)).to.be.true;
          });

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
