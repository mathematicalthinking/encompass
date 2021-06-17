//TODO switch to navigating with navbar line 47

// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const problem = helpers.newProblem;
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const testUsers = require('./fixtures/users');

describe('Problems New', async function () {
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle } = user;
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
            describe('Clicking on problem new page', function () {
              before(async function () {
                // await helpers.waitForAndClickElement(driver, topLink);
                // await helpers.waitForAndClickElement(driver, css.topBar.problemsNew);
                let options = {
                  selector: 'a',
                  urlToWaitFor: `${helpers.host}/#/problems/new`,
                  timeout: 10000
                };
            
                await helpers.navigateAndWait(driver, `${helpers.host}/#/problems/new`, options );
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

              it('the categories page should have two inputs with labels', async function () {
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
                expect(await helpers.isElementVisible(driver, css.problemNew.showCatsBtn)).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'keywords', true)).to.contain('problem keywords');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputSelectize)).to.be.true;
              });

              it('should let you continue without selecting categories or keywords', async function () {
                // modal was blocking the next button
                await helpers.waitForRemoval(driver, css.sweetAlert.container);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'additional', true)).to.contain('additional information');
              });

              it('should let you continue without adding any additional info', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'copyright', true)).to.contain('copyright notice');
              });

              it('should let you go back to categories page', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'additional', true)).to.contain('additional information');
                await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
              });

              it('should let you add categories to problem', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.showCatsBtn);
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
                expect(await helpers.getWebElements(driver, css.problemNew.selectedCatsList)).to.have.lengthOf(2);
              });

              it('should let you remove categories to problem', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.removeCategoryBtn);
                await driver.sleep(500);
                expect(await helpers.getWebElements(driver, css.problemNew.selectedCatsList)).to.have.lengthOf(1);
              });

              it('should let you hide the categories menu', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.hideCatsBtn);
                await driver.sleep(500);
                expect(await helpers.findAndGetText(driver, css.problemNew.showCatsBtn, true)).to.contain('show category menu');
              });

              it('should let you add problem keywords', async function () {
                let keywords = problem.keywords;
                await helpers.findInputAndType(driver, css.problemNew.inputSelectizeType, keywords[0], true);
                await helpers.findInputAndType(driver, css.problemNew.inputSelectizeType, keywords[1], true);
                await helpers.findInputAndType(driver, css.problemNew.inputSelectizeType, keywords[2], true);
              });

              it('the additional page should have two inputs with labels', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'additional', true)).to.contain('additional information');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputContentBlock + ' .input-container textarea')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'image', true)).to.contain('additional image');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputContentBlock + ' #image-upload')).to.be.true;
              });

              it('should type in additional info and continue to next page', async function () {
                await helpers.findInputAndType(driver, css.problemNew.inputContentBlock + ' .input-container textarea', problem.additionalInfo);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'copyright', true)).to.contain('copyright notice');
              });

              it('the legal page should have three inputs with labels', async function () {
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'copyright', true)).to.contain('copyright notice');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#copyright')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'sharing', true)).to.contain('sharing authorization');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputTextbox + '#sharing')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'legal', true)).to.contain('legal notice');
                expect(await helpers.isElementVisible(driver, css.problemNew.inputContentBlock + ' #legal-notice')).to.be.true;
              });

              it('should show an error when trying to submit without checking legal notice', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(800);
                await helpers.waitForTextInDom(driver, css.problemNew.errorMsgLegal);
                expect(await helpers.findAndGetText(driver, '.error-box')).to.contain(css.problemNew.errorMsgLegal);
                await helpers.waitForAndClickElement(driver, css.problemNew.errorBoxDismiss);
              });

              it('should fill in inputs and check legal notice', async function () {
                await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#copyright', problem.copyrightNotice);
                await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#sharing', problem.sharingAuth);
                await helpers.waitForAndClickElement(driver, css.problemNew.inputContentBlock + ' #legal-notice');
              });

              it('should go all the way back to the general page', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'additional', true)).to.contain('additional information');
                await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'categories', true)).to.contain('problem categories');
                await helpers.waitForAndClickElement(driver, css.problemNew.cancelButton);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputLabel + 'title', true)).to.contain('problem title');
              });

              it('the general page should have inputs still filled in and change title to duplicate', async function () {
                expect(await helpers.getWebElementValue(driver, css.problemNew.inputTextbox + '#title')).to.contain(problem.startTitle);
                expect(await helpers.findAndGetText(driver, css.problemNew.inputQuill + '#editor .ql-editor p')).to.contain(problem.text);
                await helpers.clearElement(driver, css.problemNew.inputTextbox + '#title');
                await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#title', problem.duplicateTitle);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(800);
                await helpers.waitForAndClickElement(driver, css.sweetAlert.confirmBtn);
                await driver.sleep(800);
              });

              it('the categories page should still have categories and keywords', async function () {
                expect(await helpers.getWebElements(driver, css.problemNew.selectedCatsList)).to.have.lengthOf(1);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
              });

              it('the additional page should still have inputs filled in', async function () {
                expect(await helpers.getWebElementValue(driver, css.problemNew.inputContentBlock + ' .input-container input#additionalInfo')).to.contain(problem.additionalInfo);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
              });

              it('the legal page should still have inputs filled in', async function () {
                expect(await helpers.getWebElementValue(driver, css.problemNew.inputTextbox + '#copyright')).to.contain(problem.copyrightNotice);
                expect(await helpers.getWebElementValue(driver, css.problemNew.inputTextbox + '#sharing')).to.contain(problem.sharingAuth);
              });

              it('creating a problem with duplicate name should throw error', async function () {
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(800);
                await helpers.waitForTextInDom(driver, css.problemNew.errorMsgTitle);
                expect(await helpers.findAndGetText(driver, '.error-box')).to.contain(css.problemNew.errorMsgTitle);
                await helpers.waitForAndClickElement(driver, css.problemNew.errorBoxDismiss);
                expect(await helpers.getWebElementValue(driver, css.problemNew.inputTextbox + '#title')).to.contain(problem.duplicateTitle);
               });

              it('change problem title and submit problem', async function () {
                await helpers.clearElement(driver, css.problemNew.inputTextbox + '#title');
                await helpers.findInputAndType(driver, css.problemNew.inputTextbox + '#title', problem.finalTitle);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(500);
                await helpers.waitForAndClickElement(driver, css.sweetAlert.confirmBtn);
                await driver.sleep(300);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(300);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(300);
                await helpers.waitForAndClickElement(driver, css.problemNew.primaryButton);
                await driver.sleep(1000);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problem.finalTitle);
              });

              it('newly created problem - general page should have correct info', async function () {
                expect(await helpers.isElementVisible(driver, css.problemInfo.privacySetting + 'fa-globe-americas')).to.be.true;
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemName)).to.contain(problem.finalTitle);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatement)).to.contain(problem.text);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemAuthor)).to.contain(problem.author);
                if (!isAdmin) {
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatus, true)).to.contain('pending');
                } else {
                  expect(await helpers.findAndGetText(driver, css.problemInfo.problemStatus, true)).to.contain('approved');
                }
              });

              it('newly created problem - categories page should have correct info', async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.problemMenuTab + 'categories');
                await driver.sleep(800);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemCategory)).to.contain(problem.category);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemKeyword + ':first-child')).to.contain(problem.keywords[0]);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemKeyword + ':nth-child(2)')).to.contain(problem.keywords[1]);
                expect(await helpers.findAndGetText(driver, css.problemInfo.problemKeyword + ':nth-child(3)')).to.contain(problem.keywords[2]);
              });

              it('newly created problem - additional page should have correct info', async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.problemMenuTab + 'additional');
                await driver.sleep(800);
                expect(await helpers.findAndGetText(driver, css.problemInfo.additionalInfo)).to.contain(problem.additionalInfo);
              });

              it('newly created problem - legal page should have correct info', async function () {
                await helpers.waitForAndClickElement(driver, css.problemInfo.problemMenuTab + 'legal');
                await driver.sleep(800);
                expect(await helpers.findAndGetText(driver, css.problemInfo.copyright)).to.contain(problem.copyrightNotice);
                expect(await helpers.findAndGetText(driver, css.problemInfo.sharingAuth)).to.contain(problem.sharingAuth);
              });


            });
        }

      });
    }
    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));
  }
  await runTests(testUsers);
});
