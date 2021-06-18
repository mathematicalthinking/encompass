//TODO fix search bar tests
//TODO fix refresh test

// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const testUsers = require('./fixtures/users');

const SwalDriver = require('./utilities/sweet_alert');

// const handleRetries = function (driver, fetchPromise, numRetries) {
//   console.log('inside handleRetries function');
//   numRetries = 'undefined' === typeof numRetries ? 1 : numRetries;
//   return fetchPromise().catch(function(err) {
//     if (numRetries > 0) {
//       return handleRetries(driver, fetchPromise, numRetries-1);
//     }
//     throw err;
//   });
// };

describe('Problems', async function () {
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, problems } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';
      const isAdmin = accountType === 'A';
      const isTeacher = accountType === 'T';
      const isPdadmin = accountType === 'P';

      describe(`As ${testDescriptionTitle}`, function() {
        this.timeout(helpers.timeoutTestMsStr);
        let driver = null;
        let swalDriver;
        before(async function() {
          driver = new Builder()
            .forBrowser('chrome')
            .build();
          driver.manage().window().setRect({ width: 1580, height: 1080 });

          swalDriver = new SwalDriver(driver);

            await dbSetup.prepTestDb();
            return helpers.login(driver, host, user);
          });

        after(function() {
          return driver.quit();
        });

        if (!isStudent) {
          describe('Visiting problems main page', function () {
            before(async function () {
              // await helpers.findAndClickElement(driver, topLink);
              let options = {
                selector: 'a',
                urlToWaitFor: `${helpers.host}/#/problems`,
                timeout: 10000
              };
          
              await helpers.navigateAndWait(driver, `${helpers.host}/#/problems`, options );
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
                await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                let resultsMsg = `${problems.public.count} problems found`;
                await helpers.waitForTextInDom(driver, resultsMsg);
                expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
              }
            });

            it('should update problem list when clicking on Mine', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                let resultsMsg = `${problems.mine.count} problems found`;
                await helpers.waitForTextInDom(driver, resultsMsg);
                expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
              }
            });

            if (!isStudent) {
              describe('Clicking on My Org filter option', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'li.filter-myOrg label.radio-label');
                  }
                });

                it('should update problem list when clicking on My Org', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.org.total} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should update problem list when unchecking created by members', async function () {
                  if (!isStudent) {
                    await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    let resultsMsg = `${problems.org.recommended} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show recommended problems with stars', async function () {
                  if (!isStudent) {
                    expect(await helpers.isElementVisible(driver, '#problem-list-ul li:first-child .item-section.name span:nth-child(2)')).to.be.true;
                  }
                });


                it('should update problem list when unchecking recommended', async function () {
                  if (!isStudent) {
                    await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    await helpers.waitForTextInDom(driver, css.noResultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(css.noResultsMsg);
                  }
                });

                it('should update problem list when checking created by members', async function () {
                  if (!isStudent) {
                    await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    let resultsMsg = `${problems.org.members} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                    await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
                  }
                });
              });

              describe('Clicking on Category filter menu', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '.category-header');
                  }
                });

                it('should show populate categories search list', async function () {
                  if (!isStudent) {
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', 'CCSS.Math.Content', true);
                    await helpers.clearElement(driver, '#categories-filter-selectized');
                    await driver.sleep(1000);
                  }
                });

                it('should show problems when adding category with problems to list', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.k} problems found`;
                    await helpers.clearElement(driver, '#categories-filter-selectized');
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', 'CCSS.Math.Content.K');
                    await helpers.findAndClickElement(driver, '[data-value="5bb650e1fefbf3cf9e88f673"]');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show more problems when adding category with problems to list', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.total} problems found`;
                    await helpers.clearElement(driver, '#categories-filter-selectized');
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', '8.EE');
                    await helpers.findAndClickElement(driver, '[data-value="5bb650e1fefbf3cf9e88f675"]');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show less problems when unchecking include subcategories', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.noSub} problems found`;
                    await helpers.findAndClickElement(driver, '.subfilter');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show less problems when removing a category', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.ee} problems found`;
                    await helpers.findAndClickElement(driver, '.subfilter');
                    await driver.sleep(500);
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('there should be no change when adding category with no problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.ee} problems found`;
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', 'Math.Content.4', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should clear selected category list', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                  }
                });

                it('should open up category menu modal', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.show-category-btn');
                    await helpers.waitForSelector(driver, '#category-list-modal');
                    await driver.sleep(5000);
                    expect(await helpers.findAndGetText(driver, '.modal-content h4')).to.contain('Select a Category');
                  }
                });

                it('should add category when clicked', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K"]');
                    await driver.sleep(500);
                    await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G"]');
                    await driver.sleep(300);
                    await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G.B"]');
                    await driver.sleep(300);
                    await helpers.findAndClickElement(driver, 'button[id="CCSS.Math.Content.K.G.B.6"]');
                    await driver.sleep(300);
                    await helpers.findAndClickElement(driver, 'button.close');
                    await driver.sleep(300);
                    let resultsMsg = `1 problems found`;
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });
              });

              xdescribe('Testing search bar', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                    await helpers.waitForSelector(driver, '.search-bar-comp');
                  }
                });

                it('should have two search options', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '#my-select select');
                    await helpers.findAndClickElement(driver, 'option[value="title"]');
                    await helpers.findAndClickElement(driver, 'option[value="general"]');
                  }
                });

                it('should show search results for Public', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.public} problems that contain "problem"`;
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findInputAndType(driver, '.search-field', 'Problem', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show search results for Org', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.org} problems that contain "problem"`;
                    await helpers.findAndClickElement(driver, 'li.filter-myOrg label.radio-label');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show search results for Mine', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.mine} problems that contain "problem"`;
                    if (problems.search.mine === 1) {
                      resultsMsg = `Based off your filter criteria, we found ${problems.search.mine} problem that contains "problem"`;
                    }
                    await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                if (isAdmin) {
                  it('should show search results for All', async function () {
                    if (!isStudent) {
                      let resultsMsg = `Based off your filter criteria, we found ${problems.search.all} problems that contain "problem"`;
                      await helpers.findAndClickElement(driver, 'li.filter-all label.radio-label');
                      await helpers.waitForTextInDom(driver, resultsMsg);
                      expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                    }
                  });
                }

                it('should clear search results', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.search.clear} problems found`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show search results for searching by Title', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.title} problem whose title contains "zebra"`;
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '#my-select select');
                    await helpers.findAndClickElement(driver, 'option[value="title"]');
                    await helpers.findInputAndType(driver, '.search-field', 'Zebra', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show clear button with empty search box and query applied', async function () {
                  if (!isStudent) {
                    await helpers.clearElement(driver, '.search-field');
                    expect(await helpers.isElementVisible(driver, 'svg.clear')).to.be.true;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                  }
                });

                it('should throw and error when search field is empty', async function () {
                  if (!isStudent) {
                    let errorMessage = "Query is too short (minimum is 1 characters)";
                    await helpers.findAndClickElement(driver, '.fa-search');
                    await helpers.waitForSelector(driver, '.error-box');
                    await helpers.waitForTextInDom(driver, errorMessage);
                    expect(await helpers.findAndGetText(driver, '.error-text')).to.contain(errorMessage);
                  }
                });

                it('should throw and error when search is too long', async function () {
                  if (!isStudent) {
                    let errorMessage = "Query is too long (maximum is 500 characters)";
                    await helpers.findInputAndType(driver, '.search-field', css.longString, true);
                    await helpers.findAndClickElement(driver, '.fa-search');
                    await helpers.waitForSelector(driver, '.error-box');
                    await helpers.waitForTextInDom(driver, errorMessage);
                    expect(await helpers.findAndGetText(driver, '.error-text')).to.contain(errorMessage);
                  }
                });

                it('should show results when searching specific word in description', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "graphton"`;
                    await helpers.findAndClickElement(driver, '#my-select select');
                    await helpers.findAndClickElement(driver, 'option[value="general"]');
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'Graphton', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching specific word in additional info', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "expected"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'expected', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching by status', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 3 problems that contain "pending"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'pending', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching by author', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "mccartney"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'McCartney', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching by copyright', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "apple"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'apple', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                    await helpers.findAndClickElement(driver, 'svg.clear');
                  }
                });
              });

              describe('Testing layout and refresh', function () {
                before(async function () {
                  let options = {
                    selector: 'a',
                    urlToWaitFor: `${helpers.host}/#/problems`,
                    timeout: 10000
                  };
              
                  await helpers.navigateAndWait(driver, `${helpers.host}/#/problems`, options );
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.refresh-icon');
                  }
                });

                xit('should show no changes after refresh', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.public.count} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show card view when clicking on grid', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.grid-icon');
                    await helpers.waitForSelector(driver, '.grid-view');
                    expect(await helpers.isElementVisible(driver, '.grid-view')).to.be.true;
                  }
                });

                it('should show list view when clicking on list view', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.list-icon');
                    await helpers.waitForSelector(driver, '#layout-view');
                    expect(await helpers.isElementVisible(driver, '#layout-view')).to.be.true;
                  }
                });
              });

              describe('Testing sortbar functionality', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.waitForSelector(driver, '.sort-bar');
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                  }
                });

                it('should have sortbar with many options', async function () {
                  if (!isStudent) {
                    let selectors = ['.sort-bar-item.privacy', '.sort-bar-item.name', '.sort-bar-item.date','.sort-bar-item.status'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
                });

                it('should be sorted reverse-alphabetically', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.name span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Zebra Problem');
                  }
                });

                it('should be sorted alphabetically', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.name span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Alphabetical Problem');
                  }
                });

                it('should be sorted by most recent', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.date span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Newest Problem');
                  }
                });

                it('should be sorted by oldest', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.date span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Oldest Problem');
                  }
                });

                it('should be filtered by private', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.privacy.private} problems found`;
                    await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                    await helpers.findAndClickElement(driver, '.sort-bar-item.privacy');
                    await helpers.findAndClickElement(driver, '#privacy-menu ul li .radio-filter .radio-label input[value="M"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should be filtered by public', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.privacy.public} problems found`;
                    await helpers.findAndClickElement(driver, '.sort-bar-item.privacy');
                    await helpers.findAndClickElement(driver, '#privacy-menu ul li .radio-filter .radio-label input[value="O,E"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should be filtered by all', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.privacy.total} problems found`;
                    await helpers.findAndClickElement(driver, '.sort-bar-item.privacy');
                    await helpers.findAndClickElement(driver, '#privacy-menu ul li .radio-filter .radio-label input[value="M,O,E"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should filter out approved problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.pending} problems found`;
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="approved"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should filter out pending problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.flagged} problems found`;
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="pending"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should filter out flagged and only show approved problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.approved} problems found`;
                    if (!isTeacher) {
                      await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                      await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="flagged"]');
                    }
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="approved"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

                it('should show all problems no matter the status', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.total} problems found`;
                    if (!isTeacher) {
                      await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                      await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="flagged"]');
                    }
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="pending"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  }
                });

              });

              describe('Testing problem list item functionality', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.waitForSelector(driver, '#problem-list-ul');
                  }
                });

                it('problem list item should have 7 items', async function () {
                  if (!isStudent) {
                    let itemSection = ['privacy', 'name', 'description', 'date', 'status', 'action', 'more'];
                    let selectors = itemSection.map((sel) => {
                      return `#problem-list-ul li:first-child .item-section.${sel}`;
                    });
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
                });

                it('clicking on problem title should show problem info', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '#problem-list-ul li:first-child .item-section.name span:first-child');
                    await driver.sleep(500);
                    let selectors = ['.info-header', '.side-info-menu'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
                });

                it('clicking on problem description should show problem info', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '#problem-list-ul li:first-child .item-section.description span:first-child');
                    await driver.sleep(500);
                    let selectors = ['.info-header', '.side-info-menu'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                    await driver.sleep(800);
                    await helpers.findAndClickElement(driver, '.remove-icon');
                  }
                });

                describe('Testing action button functionality', function () {
                  before(async function () {
                    if (!isStudent) {
                      await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                      await helpers.findAndClickElement(driver, '.sort-bar-item.name span');
                      await helpers.findAndClickElement(driver, '.sort-bar-item.name span');
                      await driver.sleep(500);
                      await helpers.waitForSelector(driver, '#problem-list-ul');
                    }
                  });

                  if (isTeacher) {
                    it('problem action button should be assign', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      let buttonText = 'Assign';
                      expect(await helpers.findAndGetText(driver, selector)).to.contain(buttonText);
                    });

                    it('clicking assign button should open assign view', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      await helpers.findAndClickElement(driver, selector);
                      await driver.sleep(500);
                      await helpers.waitForTextInDom(driver, 'Create New Assignment');
                      expect(await helpers.findAndGetText(driver, '#assignmentnewheader')).to.contain('Create New Assignment');
                      await helpers.findAndClickElement(driver, 'button.cancel-button');
                      await driver.sleep(500);
                      await helpers.findAndClickElement(driver, '.remove-icon');
                      await driver.sleep(500);
                    });
                  }

                  if (isPdadmin) {
                    it('approved problem action button should be assign', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      await driver.sleep(5000);
                      let buttonText = 'Assign';
                      expect(await helpers.findAndGetText(driver, selector)).to.contain(buttonText);
                    });
                    it('flagged problem action button should be copy', async function () {
                      let selector = '#problem-list-ul li:nth-child(2) .item-section.action button.primary-button';
                      let buttonText = 'Copy';
                      expect(await helpers.findAndGetText(driver, selector)).to.contain(buttonText);
                    });
                    it('clicking assign button should open assign view', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      await helpers.findAndClickElement(driver, selector);
                      await driver.sleep(500);
                      await helpers.waitForTextInDom(driver, 'Create New Assignment');
                      expect(await helpers.findAndGetText(driver, '#assignmentnewheader')).to.contain('Create New Assignment');
                      await helpers.findAndClickElement(driver, 'button.cancel-button');
                      await driver.sleep(500);
                      await helpers.findAndClickElement(driver, '.remove-icon');
                      await driver.sleep(500);
                    });
                    it('clicking copy button should copy flagged problem to mine', async function () {
                      let selector = '#problem-list-ul li:nth-child(2) .item-section.action button.primary-button';
                      await helpers.findAndClickElement(driver, selector);
                      await driver.sleep(500);
                      await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                      await driver.sleep(500);
                      expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Copy of Flagged Problem');
                    });
                  }

                  if (isAdmin) {
                    it('approved problem action button should be flag', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      let buttonText = 'Flag';
                      expect(await helpers.findAndGetText(driver, selector)).to.contain(buttonText);
                    });
                    it('flagged problem action button should be approve', async function () {
                      let selector = '#problem-list-ul li:nth-child(2) .item-section.action button.primary-button';
                      let buttonText = 'Approve';
                      expect(await helpers.findAndGetText(driver, selector)).to.contain(buttonText);
                    });
                    it('clicking flag button should open flag modal and flag problem', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      await helpers.findAndClickElement(driver, selector);
                      await driver.sleep(500);
                      await helpers.findAndClickElement(driver, '.swal2-confirm');
                      await helpers.findInputAndType(driver, 'select.swal2-select', 'Inappropriate', true);
                      await driver.sleep(500);
                      expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.status span.status-text', true)).to.contain('flagged');
                    });
                    it('clicking approve button should open approve modal and approve problem', async function () {
                      let selector = '#problem-list-ul li:first-child .item-section.action button.primary-button';
                      await helpers.findAndClickElement(driver, selector);
                      await driver.sleep(500);
                      await helpers.findAndClickElement(driver, '.swal2-confirm');
                      await driver.sleep(500);
                      expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.status span.status-text', true)).to.contain('approved');
                    });
                  }
                });

                describe("Testing more button menu listing", function() {
                  before(async function() {
                    if (!isStudent) {
                      await helpers.findAndClickElement(driver, "li.filter-everyone label.radio-label");
                      await helpers.waitForSelector(driver, "#problem-list-ul");
                    }
                  });

                  if (!isAdmin) {
                    // TODO: fix this test. passes locally but often fails on travis
                    xit("problem more button should only show report", async function() {
                      let selectors = ["#problem-list-ul li:first-child .item-section.more", '#container > div.item-section.more > span > ul > li > label > span'];
                      await helpers.findAndClickElement(driver, selectors[0]);
                      let reportIcon = 'fa-exclamation-circle';
                      let reportIconSel = `.item-section.more span.click-menu ul li label i.${reportIcon}`;
                      await helpers.waitForSelector(driver, reportIconSel);
                      expect(await helpers.isElementVisible(driver, reportIconSel)).to.be.true;

                      let editIcon = 'fa-edit';
                      let editIconSel = `.item-section.more span.click-menu ul li label i.${editIcon}`;

                      expect(await helpers.isElementVisible(driver, editIconSel)).to.be.false;

                      let trashIcon = 'fa-trash';
                      let trashIconSel = `.item-section.more span.click-menu ul li label i.${trashIcon}`;

                      expect(await helpers.isElementVisible(driver, trashIconSel)).to.be.false;
                    });
                    if (isPdadmin) {
                      it("problem more for mine should show 2 options", async function () {
                        let icons = ['fa-edit', 'fa-trash'];
                        let selectors = icons.map((sel) => {
                          return `.item-section.more span.click-menu ul li label i.${sel}`;
                        });
                        await helpers.findAndClickElement(driver, "li.filter-mine label.radio-label");
                        await driver.sleep(900);
                        await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                        await driver.sleep(500);
                        expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                      });
                    } else {
                      it("problem more for mine should show 3 options", async function () {
                        let icons = ['fa-edit', 'fa-exclamation-circle', 'fa-trash'];
                        let selectors = icons.map((sel) => {
                          return `.item-section.more span.click-menu ul li label i.${sel}`;
                        });
                        await helpers.findAndClickElement(driver, "li.filter-mine label.radio-label");
                        await driver.sleep(900);
                        await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                        await driver.sleep(500);
                        expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                      });
                    }
                  }

                  if (isAdmin) {
                    it("problem more for public should show 4 options", async function () {
                      let icons = ['fa-edit', 'fa-list-ul', 'fa-trash', 'fa-clock'];
                      let selectors = icons.map((sel) => {
                        return `.item-section.more span.click-menu ul li label i.${sel}`;
                      });
                      await helpers.findAndClickElement(driver, "li.filter-everyone label.radio-label");
                      await driver.sleep(800);
                      await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                      await driver.sleep(800);
                      expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                    });
                    it("problem more for mine flagged should show 3 options", async function () {
                      let icons = ['fa-edit', 'fa-trash', 'fa-clock'];
                      let selectors = icons.map((sel) => {
                        return `.item-section.more span.click-menu ul li label i.${sel}`;
                      });
                      await helpers.findAndClickElement(driver, "li.filter-mine label.radio-label");
                      await driver.sleep(800);
                      await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                      await driver.sleep(800);
                      expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                    });
                    it("problem more for mine pending should show 2 options", async function () {
                      await helpers.findAndClickElement(driver, "div.results-message");
                      await driver.sleep(500);
                      await helpers.findAndClickElement(driver, "#problem-list-ul li:nth-child(2) .item-section.more");
                      await driver.sleep(500);
                      expect(await helpers.getWebElements(driver, '.item-section.more span.click-menu ul>li')).to.have.lengthOf.at.least(2);
                    });
                  }
                });
              });

              describe('Testing problem card view functionality', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '.layout-icons .grid-icon');
                    await driver.sleep(500);
                    await helpers.waitForSelector(driver, '#problem-list-ul');
                  }
                });

                it('problem card item should have 6 items', async function () {
                  if (!isStudent) {
                    let itemSection = ['privacy', 'name', 'description', 'status', 'action', 'more'];
                    let selectors = itemSection.map((sel) => {
                      return `#problem-list-ul li:first-child .item-card.${sel}`;
                    });
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
                });

                it('clicking on problem title should show problem info', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '#problem-list-ul li:first-child .item-card.name a');
                    await driver.sleep(500);
                    let selectors = ['.info-header', '.side-info-menu'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;

                  }
                });

                it('clicking on problem description should show problem info', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '#problem-list-ul li:first-child .item-card.description a');
                    await driver.sleep(500);
                    let selectors = ['.info-header', '.side-info-menu'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                    await driver.sleep(800);
                    await helpers.findAndClickElement(driver, '.remove-icon');
                  }
                });

              });
            }

            if (isAdmin) {
              describe('Clicking on Trashed problems', function () {
                before(async function () {
                  await helpers.findAndClickElement(driver, '.category-header');
                  await helpers.findAndClickElement(driver, '.more-header');
                });

                it('should update problem list and display message', function () {
                  let resultsMsg = `2 problems found - Displaying Trashed Problems`;

                  return helpers.findAndClickElement(driver, '#toggle-trashed')
                  .then(async () => {
                    await helpers.saveScreenshot(driver);
                    return helpers.waitForElementToHaveText(driver, css.resultsMessage, resultsMsg);
                  })
                  .then(() => {
                    console.log('results message passed');
                  })
                  .catch((err) => {
                    throw(err);
                  });
                });

                it('should restore a trashed problem', async function () {
                  await helpers.saveScreenshot(driver);
                let list = await helpers.waitForSelector(driver, '#problem-list-ul');
                let firstItem = await list.findElement({xpath: './li'});

                let btn = await firstItem.findElement({css: '.primary-button'});
                  await btn.click();
                  await helpers.saveScreenshot(driver);
                  await swalDriver.confirmYesNoModal('Problem Restored');
                  let resultsMsg = `1 problems found - Displaying Trashed Problems`;

                  await helpers.waitForElementToHaveText(driver, css.resultsMessage, resultsMsg);
                });

                // is this actually being implemented?
                it('should continue displaying trashed problems until unchecked', async function () {
                  await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                  let resultsMsg = `${problems.mine.count} problems found - Displaying Trashed Problems`;

                  await helpers.waitForElementToHaveText(driver, css.resultsMessage, resultsMsg);

                  await helpers.findAndClickElement(driver, '.more-filter-list .subfilter input#toggle-trashed');
                  let updatedMsg = `${problems.mine.count} problems found`;

                  await helpers.waitForElementToHaveText(driver, css.resultsMessage, updatedMsg);

                  await helpers.findAndClickElement(driver, '.more-header');
                });
              });

              describe('Clicking on All problems filter', function () {
                before(async function () {
                  await helpers.findAndClickElement(driver, 'li.filter-all label.radio-label');
                  await helpers.findAndClickElement(driver, 'span.layout-icons .list-icon');
                });

                it('should update the problem list and display message', async function () {
                  await helpers.waitForSelector(driver, css.resultsMessage);
                  let resultsMsg = `${problems.all.total} problems found`;
                  await helpers.waitForTextInDom(driver, resultsMsg);
                  expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                });

                it('should test pagination and go to the second page', async function () {
                  await helpers.findAndClickElement(driver, '.sort-bar-item.name');
                  await helpers.findAndClickElement(driver, '.nav-right i.fa-caret-right');
                  // await driver.sleep(500);

                  await helpers.waitForElementToHaveText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child', 'The Shortest Possible Side' );
                  // expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain(`The Shortest Possible Side`);
                });

                it('should test pagination and go back to the first page', async function () {
                  await helpers.findAndClickElement(driver, '.nav-left i.fa-caret-left');
                  await driver.sleep(500);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain(`Alphabetical Problem`);
                });

                describe('Searching by organization', function () {
                  before(async function () {
                    await helpers.findInputAndType(driver, '#all-org-filter-selectized', 'Mathematical Thinking', true);
                    await helpers.findAndClickElement(driver, css.resultsMessage);
                  });

                  it('should select an organization then update the list and display message', async function () {
                    let resultsMsg = `${problems.all.org.total} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });

                  it('should uncheck Created by Members then update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    let resultsMsg = `${problems.all.org.recommended} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg );
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });

                  it('should uncheck Recommended then no problems should appear', async function () {
                    await helpers.findAndClickElement(driver, 'li.recommended label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    await helpers.waitForTextInDom(driver, css.noResultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(css.noResultsMsg);
                  });

                  it('should check Created by Members and the update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    let resultsMsg = `${problems.all.org.members} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });
                });

                describe('Searching by creator', function () {
                  before(async function () {
                    await helpers.findAndClickElement(driver, '#admin-filter-select-selectized');
                    await helpers.findAndClickElement(driver, '[data-value="creator"]');
                    await helpers.findInputAndType(driver, '#all-user-filter-selectized', 'morty');
                    await helpers.waitForSelector(driver, '[data-value="5b245841ac75842be3189526"]');
                    await helpers.findAndClickElement(driver, '[data-value="5b245841ac75842be3189526"]');
                    await helpers.findAndClickElement(driver, css.resultsMessage);
                  });

                  it('should select a creator and then update the list and display message', async function () {
                    let resultsMsg = `${problems.all.creator} problems found`;
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });
                });

                describe('Searching by PoWs', function () {
                  before(async function () {
                    await helpers.findAndClickElement(driver, '.selectize-input');
                    await helpers.findAndClickElement(driver, '#admin-filter-select-selectized');
                    await helpers.findAndClickElement(driver, '[data-value="pows"]');
                  });

                  it('should update the list and display message', async function () {
                    let resultsMsg = `${problems.all.pows.total} problems found`;
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });

                  it('should uncheck public then update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.shared label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    let resultsMsg = `${problems.all.pows.private} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });

                  it('should uncheck private then show no problems', async function () {
                    await helpers.findAndClickElement(driver, 'li.unshared label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    await helpers.waitForTextInDom(driver, css.noResultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(css.noResultsMsg);
                  });

                  it('should check private then update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.shared label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMessage);
                    let resultsMsg = `${problems.all.pows.public} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
                  });
                });

              });
            }

            describe("Testing more button functions", function() {
              before(async function() {
                if (!isStudent) {
                  await helpers.findAndClickElement(driver, "li.filter-mine label.radio-label");
                  await helpers.findAndClickElement(driver, '.layout-icons .list-icon');
                  await helpers.waitForSelector(driver, "#problem-list-ul");
                }
              });

              if (isTeacher) {
                it("edit button in more menu should show problem in edit view", async function() {
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-edit');
                  await driver.sleep(800);
                  expect(await helpers.isElementVisible(driver, '#problem-info input#title')).to.be.true;
                });
                it("delete button in more menu should show delete modal and remove problem", async function() {
                  await helpers.findAndClickElement(driver, '.remove-icon');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-trash');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  await driver.sleep(500);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain("Summer's Org Problem");
                });
                it("report button in more menu should report modal and mark problem as flagged", async function() {
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-exclamation-circle');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  await driver.sleep(800);
                  await helpers.findInputAndType(driver, 'select.swal2-select', 'Inappropriate', true);
                  await driver.sleep(800);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.status span.status-text', true)).to.contain("flagged");
                });
              }

              if (isPdadmin) {
                it("edit button in more menu should show problem in edit view", async function() {
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-edit');
                  await driver.sleep(800);
                  expect(await helpers.isElementVisible(driver, '#problem-info input#title')).to.be.true;
                });
                it("delete button in more menu should show delete modal and remove problem", async function() {
                  await helpers.findAndClickElement(driver, '.remove-icon');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, "li.filter-mine label.radio-label");
                  await driver.sleep(800);
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-trash');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  await driver.sleep(5000);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain("How High Is Enough?");
                });
                it("report button in more menu should report modal and mark problem as flagged", async function() {
                  await helpers.findAndClickElement(driver, "li.filter-everyone label.radio-label");
                  await driver.sleep(800);
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-exclamation-circle');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  await driver.sleep(800);
                  await helpers.findInputAndType(driver, 'select.swal2-select', 'Inappropriate', true);
                  await driver.sleep(800);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.status span.status-text', true)).to.contain("flagged");
                });
              }

              if (isAdmin) {
                it("edit button in more menu should show problem in edit view", async function() {
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-edit');
                  await driver.sleep(800);
                  expect(await helpers.isElementVisible(driver, '#problem-info input#title')).to.be.true;
                });
                it("pending button in more menu should show pending modal and mark as pending", async function() {
                  await helpers.findAndClickElement(driver, '.remove-icon');
                  await driver.sleep(800);
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-clock');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  await driver.sleep(500);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.status span.status-text', true)).to.contain("pending");
                });
                it("assign button in more menu should show problem assign view", async function() {
                  await helpers.findAndClickElement(driver, "li.filter-myOrg label.radio-label");
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:first-child .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-list-ul');
                  await driver.sleep(500);
                  await helpers.waitForTextInDom(driver, 'Create New Assignment');
                  expect(await helpers.findAndGetText(driver, '#assignmentnewheader')).to.contain('Create New Assignment');
                  await helpers.findAndClickElement(driver, 'button.cancel-button');
                  await driver.sleep(500);
                  await helpers.findAndClickElement(driver, '.remove-icon');
                  await driver.sleep(500);
                });
                it("delete button in more menu should show delete modal and remove problem", async function() {
                  await helpers.findAndClickElement(driver, "#problem-list-ul li:nth-child(2) .item-section.more");
                  await helpers.findAndClickElement(driver, '.item-section.more span.click-menu ul li label i.fa-trash');
                  // await driver.sleep(500);
                  await swalDriver.confirmYesNoModal('Problem Deleted');
                  // await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  // await driver.sleep(500);

                  await helpers.waitForElementToHaveText(driver, '#problem-list-ul li:nth-child(2) .item-section.name span:first-child', 'Flagged Problem');
                  // expect(await helpers.findAndGetText(driver, '#problem-list-ul li:nth-child(2) .item-section.name span:first-child')).to.contain("Flagged Problem");
                });
              }
            });

          });
        }

      });
    }

    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));
  }
  await runTests(testUsers);
});



