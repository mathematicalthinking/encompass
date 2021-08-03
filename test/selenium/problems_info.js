//There is an issue with locating the link to the problems route
//Currently manually navigating with navigateAndWait
//TODO change navigateAndWait to waitForAndClickElement

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

describe('Problems Info', async function () {
  function runTests(users) {
    function _runTests(user) {
      const {
        accountType,
        actingRole,
        testDescriptionTitle,
        problems,
        problemInfo,
        problemEdit
      } = user;
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
          describe('Visiting problem info', function () {
            before(async function () {
              // await helpers.waitForAndClickElement(driver, topLink);
              let options = {
                selector: 'a',
                urlToWaitFor: `${helpers.host}/problems`,
                timeout: 10000
              };
          
              await helpers.navigateAndWait(driver, `${helpers.host}/problems`, options );
            });

            describe(`Checking the following is always visible`, function () {
              before(async function () {
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                await driver.sleep(800);
                await helpers.findAndClickElement(driver, problemInfo.selector);
                await driver.sleep(800);
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
                    await helpers.findAndClickElement(driver, problemInfo.selector2);
                    await driver.sleep(500);
                  });

                  it('should show problem organization', async function () {
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
                  expect(await helpers.findAndGetText(driver, css.problemInfo.additionalImage)).to.contain(problemInfo.additionalImage);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.additionalImage);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.additionalImage, true)).to.contain('no additional image');
                }
              });

              if (problemInfo.origin) {
                it('should show problem origin - if applicable', async function () {
                  await helpers.waitForSelector(driver, css.problemInfo.origin);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.origin, true)).to.contain(problemInfo.origin);
                });
              }

              if (isAdmin) {
                it('should show problem creator', async function () {
                  await helpers.waitForSelector(driver, css.problemInfo.creator);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.creator, true)).to.contain(problemInfo.creator);
                });
              }
            });

            describe(`Checking legal page displays correct info`, function () {
              before(async function () {
                await helpers.findAndClickElement(driver, css.problemInfo.problemMenuTab + 'legal');
                await driver.sleep(800);
              });

              it('should show copyright notice - if applicable', async function () {
                if (problemInfo.copyright) {
                  await helpers.waitForSelector(driver, css.problemInfo.copyright);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.copyright)).to.contain(problemInfo.copyright);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.copyrightNone);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.copyrightNone, true)).to.contain('no copyright notice');
                }
              });

              it('should show sharing authorization - if applicable', async function () {
                if (problemInfo.sharingAuth) {
                  await helpers.waitForSelector(driver, css.problemInfo.sharingAuth);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.sharingAuth)).to.contain(problemInfo.sharingAuth);
                } else {
                  await helpers.waitForSelector(driver, css.problemInfo.sharingAuth);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.sharingAuth, true)).to.contain('no sharing authorization');
                }
              });
            });

            describe(`Checking functionality of buttons`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, problemInfo.selector);
                await driver.sleep(800);
              });

              it('should show create new assignment when clicking assign', async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.assignButton);
                await driver.sleep(500);
                await helpers.waitForTextInDom(driver, 'Create New Assignment');
                expect(await helpers.findAndGetText(driver, '#assignmentnewheader', true)).to.contain('create new assignment');
                await helpers.findAndClickElement(driver, 'button.cancel-button');
                await driver.sleep(500);
              });

              it('should create a copy of current problem when clicking copy', async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.copyButton);
                await driver.sleep(500);
                await helpers.waitForAndClickElement(driver,'#problem-list-ul li:first-child .item-section.name span:first-child');
                await driver.sleep(800);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain('Copy of ' + problemInfo.title);
              });

              if (!isTeacher) {
                it('should fill in star icon when recommended', async function () {
                  await helpers.waitForAndClickElement(driver, css.problemInfo.recommendButton);
                  await driver.sleep(500);

                  await helpers.waitForAndClickElement(driver, css.sweetAlert.confirmBtn);

                  if (isAdmin) {
                    await helpers.waitForSelector(driver, css.sweetAlert.select);
                    await helpers.findInputAndType(driver, css.sweetAlert.select, 'Drexel', true);
                  }

                  await helpers.waitForRemoval(driver, css.sweetAlert.modal);
                  let filledSel = css.problemInfo.recommendButton + ' i.star-filled';
                  await helpers.waitForSelector(driver, filledSel);

                  expect(await helpers.isElementVisible(driver, filledSel)).to.be.true;
                });
                it('should remove fill for star icon when removed from recommended', async function () {
                  await driver.sleep(500);
                  await helpers.waitForAndClickElement(driver, css.problemInfo.recommendButton);

                  let filledSel = css.problemInfo.recommendButton + ' i.star-filled';

                  await helpers.waitForRemoval(driver, filledSel);

                  let lineSel = css.problemInfo.recommendButton + ' i.star-line';
                  await helpers.waitForSelector(driver, lineSel);
                  expect(await helpers.isElementVisible(driver, lineSel)).to.be.true;
                });
              }

            });

          });

          describe('Visiting problem info to edit', function () {
            before(async function () {
              await helpers.findAndClickElement(driver, '.remove-icon');
              await helpers.waitForRemoval(driver, '#problem-info');
              // await helpers.waitForAndClickElement(driver, topLink);
              let options = {
                selector: 'a',
                urlToWaitFor: `${helpers.host}/problems`,
                timeout: 10000
              };
          
              await helpers.navigateAndWait(driver, `${helpers.host}/problems`, options );
              await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
              await helpers.waitForAndClickElement(driver, '#problem-list-ul li:first-child .item-section.name span:first-child');
              // await driver.sleep(5000);
            });

            describe(`Checking the following is always visible`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
                // await driver.sleep(500);
                await helpers.waitForSelector(driver, css.problemEdit.saveButton);
              });

              it('should show privacy setting icon with select drop down', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.privacySettingIcon)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemEdit.privacySettingSelect)).to.be.true;
              });

              it('privacy setting drop down should have 3 options and should change icon when changing setting', async function () {
                await helpers.findAndClickElement(driver, css.problemEdit.privacySettingSelect);
                await helpers.findInputAndType(driver, css.problemEdit.privacySettingSelect, 'Everyone', true);
                expect(await helpers.isElementVisible(driver, css.problemEdit.privacySettingIcon + '.fa-globe-americas')).to.be.true;
              });

              it('should show problem title input and create date', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.problemNameInput)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemEdit.problemDate)).to.be.true;
              });

              it('should change the problem title', async function () {
                await helpers.clearElement(driver, css.problemEdit.problemNameInput);
                await helpers.findInputAndType(driver, css.problemEdit.problemNameInput, 'Test Edit Problem', true);
              });

              it('should show 4 clickable menu headers', async function () {
                let tabNames = ['general', 'categories', 'additional', 'legal'];
                let selectors = tabNames.map((tab) => {
                  return css.problemEdit.problemMenuTab + tab;
                });
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });
            });

            describe(`Checking general page can edit info`, function () {

              it('should show the problem statement and edit it', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.problemStatement)).to.be.true;
                await helpers.clearElement(driver, css.problemEdit.problemStatement);
                await helpers.findInputAndType(driver, css.problemEdit.problemStatement, 'Test Edit Problem Content');
              });

              it('should show problem author and change it', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.problemAuthor)).to.be.true;
                expect(await helpers.getWebElementValue(driver, css.problemEdit.problemAuthor)).to.contain(problemInfo.author);
                await helpers.clearElement(driver, css.problemEdit.problemAuthor);
                await helpers.findInputAndType(driver, css.problemEdit.problemAuthor, 'Test Problem Author');
              });

              if (isAdmin) {
                it('should show problem organization', async function () {
                  await helpers.waitForSelector(driver, css.problemInfo.problemOrg);
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemOrg, true)).to.contain(problemInfo.org);
                });
              }

              it('should show and change the problem status', async function () {
                if (isTeacher) {
                  expect(await helpers.isElementVisible(driver, css.problemEdit.problemStatusFixed)).to.be.true;
                } else {
                  expect(await helpers.isElementVisible(driver, css.problemEdit.problemStatus)).to.be.true;
                  await helpers.findInputAndType(driver, css.problemEdit.problemStatus, 'pending', true);
                }
              });

              it('should show the applicable action buttons', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.deleteButton)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemEdit.cancelButton)).to.be.true;
                expect(await helpers.isElementVisible(driver, css.problemEdit.saveButton)).to.be.true;
              });
            });

            describe(`Saving general page and that changes persist`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
                await driver.sleep(500);
                await helpers.waitForAndClickElement(driver, css.sweetAlert.confirmBtn);
                await driver.sleep(500);
              });

              it('privacy setting and problem title should have changed', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.privacySettingParent);
                expect(await helpers.hasTooltipValue(driver, css.problemInfo.privacySettingParent, problemEdit.privacySetting)).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problemEdit.title);
              });

              it('the problem statement, author and status should have changed', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.problemStatementCont);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatementCont)).to.contain(problemEdit.statement);
                await helpers.waitForSelector(driver, css.problemInfo.problemAuthor);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemAuthor)).to.contain(problemEdit.author);
                await helpers.waitForSelector(driver, css.problemInfo.problemStatus);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatus, true)).to.contain(problemEdit.status);
              });
            });

            describe(`Checking categories page can edit info`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, css.problemInfo.problemMenuTab + 'categories');
                await driver.sleep(800);
                let selectors = [css.problemInfo.problemCategoryHeader, css.problemInfo.problemKeywordHeader];
                expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
              });

              it('should be able to edit or add categores to list', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.problemCategoryAdd)).to.be.true;
                if (problemInfo.categories) {
                  await helpers.findAndClickElement(driver, css.problemEdit.problemCategoryRemove);
                  await helpers.findAndClickElement(driver, css.problemEdit.problemCategoryRemove);
                  await helpers.findAndClickElement(driver, css.problemEdit.problemCategoryAdd);
                  await driver.sleep(1000);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G.B"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'button[id="CCSS.Math.Content.K.G.B.5"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, css.problemEdit.problemCategoryAdd);
                  await driver.sleep(500);
                  expect(await helpers.getWebElements(driver, css.problemEdit.problemCategoryList)).to.have.lengthOf(2);
                } else {
                  await helpers.findAndClickElement(driver, css.problemEdit.problemCategoryAdd);
                  await driver.sleep(1000);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G.B"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, 'button[id="CCSS.Math.Content.K.G.B.5"]');
                  await driver.sleep(300);
                  await helpers.findAndClickElement(driver, css.problemEdit.problemCategoryAdd);
                  await driver.sleep(500);
                  expect(await helpers.getWebElements(driver, css.problemEdit.problemCategoryList)).to.have.lengthOf(1);
                }
              });

              it('should be able to delete and add keywords', async function () {
                  let keywords = ['test', 'keywords'];
                  await helpers.findInputAndType(driver, css.problemEdit.keywordInput, keywords[0], true);
                  await driver.sleep(300);
                  await helpers.findInputAndType(driver, css.problemEdit.keywordInput, keywords[1], true);
              });
            });

            describe(`Saving categories page and that changes persist`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
                await driver.sleep(500);
              });

              it('categories list should have changed', async function () {
                expect(await helpers.getWebElements(driver, css.problemEdit.problemCategoryList)).to.have.lengthOf(problemEdit.categoriesLength);
              });

              it('keywords list should have changed', async function () {
                expect(await helpers.getWebElements(driver, css.problemEdit.keywordsListing)).to.have.lengthOf(problemEdit.keywordsLength);
              });
            });

            describe(`Checking additional page can edit info`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, css.problemInfo.problemMenuTab + 'additional');
                await driver.sleep(800);
              });

              it('should show and edit additional info', async function () {
                expect(await helpers.getWebElementValue(driver, css.problemEdit.additionalInfo)).to.contain(problemEdit.additionalInfo);
                await helpers.clearElement(driver, css.problemEdit.additionalInfo);
                await helpers.findInputAndType(driver, css.problemEdit.additionalInfo, 'Test Problem Additional Info');
              });

              it('should show upload additional image option', async function () {
                expect(await helpers.isElementVisible(driver, css.problemEdit.additionalImage)).to.be.true;
              });

              it('should show problem origin', async function () {
                expect(await helpers.findAndGetText(driver, css.problemEdit.origin)).to.contain(problemInfo.title);
              });

              if (isAdmin) {
                it('should show problem creator', async function () {
                  expect(await helpers.findAndGetText(driver, css.problemEdit.creator)).to.contain('rick');
                });
              }
            });

            describe(`Saving additional page and that changes persist`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
                await driver.sleep(500);
              });

              it('should show and edit additional info', async function () {
                expect(await helpers.findAndGetText(driver, css.problemInfo.additionalInfo)).to.contain('Test Problem Additional Info');
              });

              it('should show problem origin', async function () {
                expect(await helpers.findAndGetText(driver, css.problemInfo.origin)).to.contain(problemInfo.title);
              });

              if (isAdmin) {
                it('should show problem creator', async function () {
                  expect(await helpers.findAndGetText(driver, css.problemInfo.creator)).to.contain('rick');
                });
              }
            });

            describe(`Checking legal page can edit info`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
                await driver.sleep(500);
                await helpers.findAndClickElement(driver, css.problemInfo.problemMenuTab + 'legal');
                await driver.sleep(800);
              });

              it('should show and edit copyright notice', async function () {
                await helpers.waitForSelector(driver, css.problemEdit.copyright);
                if (problemEdit.copyright) {
                  expect(await helpers.getWebElementValue(driver, css.problemEdit.copyright)).to.contain(problemEdit.copyright);
                } else {
                  expect(await helpers.getWebElementValue(driver, css.problemEdit.copyright)).to.contain('');
                }
                await helpers.clearElement(driver, css.problemEdit.copyright);
                await helpers.findInputAndType(driver, css.problemEdit.copyright, 'Test Problem Copyright');
              });

              it('should show and edit sharing authorization', async function () {
                await helpers.waitForSelector(driver, css.problemEdit.sharingAuth);
                if (problemEdit.sharingAuth) {
                  expect(await helpers.getWebElementValue(driver, css.problemEdit.sharingAuth)).to.contain(problemEdit.sharingAuth);
                } else {
                  expect(await helpers.getWebElementValue(driver, css.problemEdit.sharingAuth)).to.contain('');
                }
                await helpers.clearElement(driver, css.problemEdit.sharingAuth);
                await helpers.findInputAndType(driver, css.problemEdit.sharingAuth, 'Test Problem Sharing Auth');
              });

            });

            describe(`Saving legal page and that changes persist`, function () {
              before(async function () {
                await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
                await driver.sleep(500);
              });

              it('copyright notice should have changed', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.copyright);
                expect(await helpers.findAndGetText(driver, css.problemInfo.copyright)).to.contain(problemEdit.copyright2);
              });

              it('sharing authorization should have changed', async function () {
                await helpers.waitForSelector(driver, css.problemInfo.sharingAuth);
                expect(await helpers.findAndGetText(driver, css.problemInfo.sharingAuth)).to.contain(problemEdit.sharingAuth2);
              });
            });

          });

          describe('General problem info testing', function() {
            before(async function () {
              // await helpers.waitForAndClickElement(driver, topLink);
              let options = {
                selector: 'a',
                urlToWaitFor: `${helpers.host}/problems`,
                timeout: 10000
              };
          
              await helpers.navigateAndWait(driver, `${helpers.host}/problems`, options );
              await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
              await helpers.waitForAndClickElement(driver, '#problem-list-ul li:first-child .item-section.name span:first-child');
              await driver.sleep(500);
            });

            it('cancel button should stop editing view', async function () {
              await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
              await driver.sleep(500);
              expect(await helpers.isElementVisible(driver, css.problemEdit.problemNameInput)).to.be.true;
              await helpers.waitForAndClickElement(driver, css.problemEdit.cancelButton);
              expect(await helpers.isElementVisible(driver, css.problemInfo.problemName)).to.be.true;
            });

            it('should show error when trying to create public problem with duplicate name', async function () {
              await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
              await driver.sleep(500);
              await helpers.clearElement(driver, css.problemEdit.problemNameInput);
              await helpers.findInputAndType(driver, css.problemEdit.problemNameInput, 'Alphabetical Problem');
              await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
              await driver.sleep(800);
              await helpers.waitForSelector(driver, css.problemEdit.errorBox);
              expect(await helpers.findAndGetText(driver, css.problemEdit.errorBoxText)).to.contain('There is already an existing public problem titled "Alphabetical Problem."');
              await helpers.waitForAndClickElement(driver, css.problemEdit.errorBoxDismiss);
            });

            it('should show error when saving a problem without a name', async function () {
              await helpers.clearElement(driver, css.problemEdit.problemNameInput);
              await driver.sleep(500);
              await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
              await driver.sleep(800);
              await helpers.waitForSelector(driver, css.problemEdit.errorBox);
              expect(await helpers.findAndGetText(driver, css.problemEdit.errorBoxText)).to.contain('Please fill in all required fields');
              await helpers.waitForAndClickElement(driver, css.problemEdit.errorBoxDismiss);
              await driver.sleep(500);
            });

            it('should show error when saving a problem without a statement', async function () {
              await helpers.waitForAndClickElement(driver, css.problemEdit.cancelButton);
              await driver.sleep(200);
              await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
              await driver.sleep(300);
              await helpers.clearElement(driver, css.problemEdit.problemStatement);
              await driver.sleep(500);
              await helpers.waitForAndClickElement(driver, css.problemEdit.saveButton);
              await driver.sleep(800);
              await helpers.waitForSelector(driver, css.problemEdit.errorBox);
              expect(await helpers.findAndGetText(driver, css.problemEdit.errorBoxText)).to.contain('Please fill in all required fields');
            });

            it('should delete a problem you created with no answers', async function () {
              await helpers.waitForAndClickElement(driver, css.problemEdit.deleteButton);
              await driver.sleep(200);
              await helpers.waitForAndClickElement(driver, css.sweetAlert.confirmBtn);
              await driver.sleep(300);
              await helpers.waitForAndClickElement(driver, '.refresh-icon');
              let resultsMsg = `${problems.mine.count} problems found`;
              await helpers.waitForTextInDom(driver, resultsMsg);
              expect(await helpers.findAndGetText(driver, css.resultsMessage)).to.contain(resultsMsg);
            });

            if (isPdadmin) {
              it('should show warning modal if editing assigned problem', async function () {
                await helpers.findAndClickElement(driver, "li.filter-myOrg label.radio-label");
                await driver.sleep(500);
                await helpers.waitForAndClickElement(driver, '#problem-list-ul li:nth-child(2) .item-section.name span:first-child');
                await driver.sleep(500);
                await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
                await driver.sleep(500);
                expect(await helpers.findAndGetText(driver, css.sweetAlert.heading, true)).to.contain('are you sure you want to edit a problem that has already been assigned');
                await helpers.waitForAndClickElement(driver, css.sweetAlert.cancelBtn);
              });
            }

            if (isAdmin) {
              it('should show warning modal if editing problem with answers', async function () {
                await helpers.findAndClickElement(driver, 'li.filter-all label.radio-label');
                await helpers.waitForAndClickElement(driver, '#problem-list-ul li:nth-child(1) .item-section.name span:first-child');
                await driver.sleep(500);
                await helpers.waitForAndClickElement(driver, css.problemInfo.editButton);
                await driver.sleep(500);
                expect(await helpers.findAndGetText(driver, css.sweetAlert.heading, true)).to.contain('are you sure you want to edit a problem with answers?');
                await helpers.waitForAndClickElement(driver, css.sweetAlert.cancelBtn);
              });
            }


          });
        }
      });
    }
    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));
  }
  await runTests(testUsers);
});