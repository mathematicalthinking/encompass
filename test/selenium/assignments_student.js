// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const { expect } = require('chai');
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const host = helpers.host;
const testUsers = require('./fixtures/users');

describe('Assignments as Student', async function () {
  function runTests(users) {
    function _runTests(user) {
      const { testDescriptionTitle, assignments, username } = user;

      const assignmentDetails = assignments.testExample;
      const submitDetails = assignments.submitting;
      const assignmentLink = `${host}/assignments/${assignmentDetails._id}`;

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

        describe('Visiting assignments page', function () {
          before(async function () {
            await helpers.navigateAndWait(driver, assignmentLink, { selector: 'div' });
            await helpers.waitForSelector(driver, css.assignmentsStudent.ownList);
          });
          it('should display list of assignments', async function() {
            expect(await helpers.isElementVisible(driver, css.assignmentsStudent.ownList)).to.exist;

            expect(await helpers.getWebElements(driver, `${css.assignmentsStudent.ownList} a`)).to.have.lengthOf(assignments.own.count);
          });
        });

        describe(`Visting ${assignmentDetails.name}`, function() {
          before(async function() {
            await helpers.navigateAndWait(driver, assignmentLink, { selector: 'div'});
            await helpers.waitForSelector(driver, css.assignmentsStudent.infoPage.container);
          });

          it('should display assignment details', async function() {
            let results = await Promise.all(_.map(assignmentDetails, (val, key) => {
              if (key === '_id') {
                return true;
              }
                driver.sleep(500);
                return helpers.waitForTextInDom(driver, val);
            }));
            expect(_.every(results, res => res === true)).to.be.true;
          });
        });

        describe(`Submitting response to assignment`, function() {
          let newAnswerSelectors = css.assignmentsStudent.newAnswerForm;
          let btnText = 'Share Your Ideas';
          if (submitDetails.isRevision) {
            btnText = 'Revise';
          }
          it(`should display ${btnText} button`, async function() {
            expect(await helpers.findAndGetText(driver, css.assignmentsStudent.infoPage.submitBtn)).to.eql(btnText);
          });

          it('Clicking button should bring up new answer form', async function() {
            await helpers.findAndClickElement(driver, css.assignmentsStudent.infoPage.submitBtn);

            expect(await helpers.isElementVisible(driver, newAnswerSelectors.container)).to.be.true;
          });

          if (submitDetails.isRevision) {
            // fields should be prefilled
            it('brief summary should be prefilled', async function() {
              expect(await helpers.getWebElementValue(driver, newAnswerSelectors.inputs.briefSummary)).to.eql(submitDetails.oldAnswer.briefSummary);
            });
            it('explanation should be prefilled', async function() {
              expect(await helpers.findAndGetText(driver, newAnswerSelectors.inputs.explanation)).to.eql(submitDetails.oldAnswer.explanation);
            });
            // TODO add test for an answer with multiple contributors
            it('contributors should list all contributors from previous answer', async function() {
              let listItems = await helpers.getWebElements(driver, `${newAnswerSelectors.inputs.studentList} li`);
              expect(listItems).to.have.lengthOf(submitDetails.oldAnswer.contributors.length);
              expect(await listItems[0].getText()).to.eql(username);
            });
          } else {
            // fields should be empty
            it('brief summary should empty', async function() {
              expect(await helpers.getWebElementValue(driver, newAnswerSelectors.inputs.briefSummary)).to.eql('');
            });
            it('explanation should empty', async function() {
              expect(await helpers.findAndGetText(driver, newAnswerSelectors.inputs.explanation)).to.eql('');
            });
            it('contributors should only contain the submitting student', async function() {
              let listItems = await helpers.getWebElements(driver, `${newAnswerSelectors.inputs.studentList} li`);
              expect(listItems).to.have.lengthOf(1);
              expect(await listItems[0].getText()).to.eql(username);
            });
            xit('should display errors if empty form is submitted', async function() {
              let numExpectedErrors = 2;

              await helpers.findAndClickElement(driver, newAnswerSelectors.createBtn);
              let errors = await helpers.waitForNElements(driver, 'div.error-box', numExpectedErrors);

              expect(errors).to.have.lengthOf(2);

              expect(await helpers.isTextInDom(driver, `can't be blank`)).to.be.true;
            });

            it('should display error if explanation is omitted', async function() {
              await helpers.findInputAndType(driver, newAnswerSelectors.inputs.briefSummary, submitDetails.newAnswer.briefSummary);

              await helpers.findAndClickElement(driver, newAnswerSelectors.createBtn);

              let errors = await helpers.getWebElements(driver, 'div.error-box');
              expect(errors).to.have.lengthOf(1);

              expect(await helpers.isTextInDom(driver, `Explanation can't be blank`)).to.be.true;

            });

            it('should display error if brief summary is omitted', async function() {
              await helpers.clearElement(driver, newAnswerSelectors.inputs.briefSummary);

              await helpers.findInputAndType(driver, newAnswerSelectors.inputs.explanation, submitDetails.newAnswer.explanation);

              await helpers.findAndClickElement(driver, newAnswerSelectors.createBtn);

              let errors = await helpers.getWebElements(driver, 'div.error-box');
              expect(errors).to.have.lengthOf(1);

              expect(await helpers.isTextInDom(driver, `Brief summary can't be blank`)).to.be.true;

            });
          }
          it('should succesfully create answer', async function() {
            if(user.accountType === 'S'){
              return true;
            }
            if (submitDetails.isRevision) {
              // should we block user from submitting exact duplicate?
              // modify answer and submit
              await helpers.clearElement(driver, newAnswerSelectors.inputs.explanation);
              await helpers.findInputAndType(driver, newAnswerSelectors.inputs.explanation, submitDetails.newAnswer.explanation);
            } else {
              // fill in brief summary and submit
              await helpers.findInputAndType(driver, newAnswerSelectors.inputs.briefSummary, submitDetails.newAnswer.briefSummary);
            }
            await helpers.findAndClickElement(driver, newAnswerSelectors.createBtn);
            await helpers.waitForSelector(driver, css.assignmentsStudent.infoPage.pastSubsHeader);
            await driver.wait(async function() {
              let pastAnswers = await helpers.getWebElements(driver, 'ol.submission-list li');
              return pastAnswers.length === assignments.answers.count + 1;
            }, 5000);

            let pastAnswers = await helpers.getWebElements(driver, 'ol.submission-list li');

            expect(pastAnswers).to.have.lengthOf(assignments.answers.count + 1);

            if (submitDetails.isRevision) {
              await driver.get(`${host}/#/workspaces/${submitDetails.newAnswer.workspacesToUpdate[0]}/work`);
              await helpers.waitForSelector(driver, 'span.submission_count');

              // click x button on tour box
              await helpers.findAndClickElement(driver, 'div.guiders_x_button');

              await helpers.waitForRemoval(driver, 'div#guiders_overlay');

              expect(await helpers.findAndGetText(driver, 'span.submission_count')).to.eql('2');

              await helpers.findAndClickElement(driver, css.topBar.assignments);
              await helpers.waitForSelector(driver, css.assignmentsStudent.ownList);
              await helpers.findAndClickElement(driver, assignmentLink);
              await helpers.waitForSelector(driver, css.assignmentsStudent.infoPage.container);
            }
          });

          describe('Viewing most recent submission', function() {
            //TODO adjust test for new student flow
            if(user.accountType === 'S'){
              return true;
            }
            before(async function() {
              let items = await helpers.getWebElements(driver, `${css.assignmentsStudent.infoPage.subList} li`);
              await items[0].click();
              await helpers.waitForSelector(driver, css.assignmentsStudent.answerInfo.container);
            });

            it('should display correct brief summary', async function() {
              expect(await helpers.findAndGetText(driver, css.assignmentsStudent.answerInfo.briefSummary)).to.eql(submitDetails.newAnswer.briefSummary);
            });

            it('should display correct explanation', async function() {
              expect(await helpers.findAndGetText(driver, css.assignmentsStudent.answerInfo.explanation)).to.contain(submitDetails.newAnswer.explanation);
            });

            it('should display correct contributors', async function() {
              let items = await helpers.getWebElements(driver, `${css.assignmentsStudent.answerInfo.studentList} li`);
              expect(items).to.have.lengthOf(submitDetails.newAnswer.contributors.length);
            });

            it(`should not have erroneous "undefined" in explanation`, async function() {
              expect(await helpers.findAndGetText(driver, css.assignmentsStudent.answerInfo.explanation)).to.not.contain('undefined');
            });
          });

        });
      });
    }

    return Promise.all(Object.keys(users).map(user => {
      if (['studentMT', 'teacherActingStudent'].includes(user)) {
        _runTests(users[user]);
      }
    }));

  }
  await runTests(testUsers);
});

