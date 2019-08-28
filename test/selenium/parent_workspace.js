// REQUIRE MODULES
const { Builder, By } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const fixtures = require('./fixtures/parent_workspace');

const host = helpers.host;

const RadioButtonSelector = require('./utilities/radio_group');

describe('Assignment Info as Teacher', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;

  let { newAssignment, teacher, student1, student2 } = fixtures;

  let radioButtonSelector;

  let assignmentInfoUrlRegEx = new RegExp(`^${host}/#/assignments/[0-9a-fA-F]{24}$`);

  let workspaceInfoUrlRegEx = new RegExp(`^${host}/#/workspaces/[0-9a-fA-F]{24}/info$`);

  let assignmentsUrl = `${host}/#/assignments`;
  let workspacesUrl = `${host}/#/workspaces`;

  let parentWorkspaceHref;

  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    radioButtonSelector = new RadioButtonSelector(driver);
    try {
      await helpers.login(driver, host, teacher);
    }catch(err) {
      console.log(err);
    }
  });

  async function createAssignment(assignmentDetails, assignmentNewUrl=`${host}/#/assignments/new`) {
    let { name, section, problem } = assignmentDetails;
    let inputSelectors = css.assignmentsNew.inputs;

    try {
      await helpers.navigateAndWait(driver, assignmentNewUrl, css.assignmentsNew.container);

      // select section
      await helpers.selectSingleSelectizeItem(driver, inputSelectors.section.input, section.name, section.id );

      // select problem
      await helpers.selectSingleSelectizeItem(driver, inputSelectors.problem.input, problem.name , problem.id);

      // assignedDate dueDate optional

      // name optional

      // select yes for create linked ws
      await radioButtonSelector.selectRadioButton(inputSelectors.linkedWorkspaces.groupName, inputSelectors.linkedWorkspaces.yes.value);

      // select yes for parent ws

      await radioButtonSelector.selectRadioButton(inputSelectors.parentWorkspace.groupName, inputSelectors.parentWorkspace.yes.value);

      // submit

      await helpers.findAndClickElement(driver, css.assignmentsNew.submitBtn);

      // wait for url to match /assignments/id

      let urlRegEx = assignmentInfoUrlRegEx;
      await helpers.waitForUrlMatch(driver, urlRegEx);

    }catch(err) {
      throw(err);
    }
  }

  function checkWorkspaceStats (workspaceName, expectedStats, options = {}) {
    describe('Checking stats for ' + workspaceName, function() {
      let { submissions, selections, comments, folders, responses } = expectedStats;

      before(async function() {
        try {
          await helpers.navigateAndWait(driver, workspacesUrl, '.results-list');
          if (options.doUseHref) {
            await driver.get(parentWorkspaceHref);
            await helpers.waitForUrlMatch(driver, new RegExp(parentWorkspaceHref));
            await helpers.waitForSelector(driver, 'div.guiders_x_button');

          } else {
            await helpers.navigateAndWait(driver, workspacesUrl, '.results-list');
            let link = await driver.findElement(By.linkText(workspaceName));
            await link.click();

          await helpers.waitForSelector(driver, '.info-link');

          }
          await helpers.findAndClickElement(driver, 'div.guiders_x_button');
          await helpers.waitForRemoval(driver, 'div#guiders_overlay');

          await helpers.findAndClickElement(driver, '.info-link > a');
          await helpers.waitForSelector(driver, '#workspace-info-stats');

        }catch(err) {
          throw(err);
        }
      });
      it(`should have ${submissions || 0} submissions`, async function() {
        let actualCount = await helpers.findAndGetText(driver, '.row-value.submissions');
        let expectedCount = submissions || 0;
        expect(actualCount).to.eql(expectedCount.toString());
      });
      it(`should have ${selections || 0} selections`, async function() {
        let actualCount = await helpers.findAndGetText(driver, '.row-value.selections');
        let expectedCount = selections || 0;
        expect(actualCount).to.eql(expectedCount.toString());
      });
      it(`should have ${comments || 0} comments`, async function() {
        let actualCount = await helpers.findAndGetText(driver, '.row-value.comments');
        let expectedCount = comments || 0;
        expect(actualCount).to.eql(expectedCount.toString());
      });
      it(`should have ${folders || 0} folders`, async function() {
        let actualCount = await helpers.findAndGetText(driver, '.row-value.folders');
        let expectedCount = folders || 0;
        expect(actualCount).to.eql(expectedCount.toString());
      });

      it(`should have ${responses || 0} responses`, async function() {
        let actualCount = await helpers.findAndGetText(driver, '.row-value.responses');
        let expectedCount = responses || 0;
        expect(actualCount).to.eql(expectedCount.toString());
      });
    });

  }

  after(() => {
    driver.quit();
  });

  it('should create assignment successfully', function() {
    return createAssignment(newAssignment)
    .then(() => {
      return driver.getCurrentUrl()
        .then((url) => {
          expect(url).to.match(assignmentInfoUrlRegEx);
        });
    })
    .catch((err) => {
      throw(err);
    });
  });

  describe('Resulting linked workspaces', function() {
    let linkedWorkspacesLinks;

    it('should have created a linked workspace for each student', function() {
      let expectedCount = newAssignment.students.length;
      let linkSel = css.assignmentsTeacher.linkedWorkspaces.link;

      return helpers.getWebElements(driver, linkSel)
        .then((links) => {
          linkedWorkspacesLinks = links;
          expect(links).to.have.lengthOf(expectedCount);
        });
    });

    it('should have created a parent workspace', function() {
      let expectedCount = 1;
      let linkSel = css.assignmentsTeacher.parentWorkspaces.link;
      return helpers.waitForNElements(driver, linkSel, 1)
      .then(() => {
        return helpers.getWebElements(driver, linkSel)
        .then((links) => {
          expect(links).to.have.lengthOf(expectedCount);
          let link = links[0];
          return link.getAttribute('href')
            .then((href) => {
              parentWorkspaceHref = href;
            });
        });
      });


    });

    describe('Visiting one of the linked workspaces', function() {
      it('Should redirect to info page since workspace is empty', function(){
        return linkedWorkspacesLinks[0].click()
          .then(() => {
            return helpers.waitForUrlMatch(driver, workspaceInfoUrlRegEx)
            .then((doesMatch) => {
              expect(doesMatch).to.eql(true);
            });
          })
          .catch((err) => {
            throw(err);
          });
      });

      // TODO
      // subs, sels, foldrs, comm should be 0
    });

    describe('Student submitting to linked workspace', function() {
      let student = student1;
      before(function() {
        return helpers.logout(driver)
          .then(() => {
            return helpers.login(driver, host, student);
          });
      });

      describe('Respond to assignment', function() {
        before(function() {
          return helpers.navigateAndWait(driver, assignmentsUrl, '.your-assignments')
          .then(() => {
            return driver.findElement(By.linkText(newAssignment.name))
            .then((link) => {
              return link.click()
              .then(() => {
                return helpers.waitForSelector(driver, css.assignmentsStudent.infoPage.submitBtn);
              });
            });
          });
        });

        it('should create response', async function() {
          let { firstResponse } = student;

          await helpers.findAndClickElement(driver, css.assignmentsStudent.infoPage.submitBtn);

          expect(await helpers.isElementVisible(driver, css.assignmentsStudent.newAnswerForm.container)).to.be.true;

          await helpers.findInputAndType(driver, css.assignmentsStudent.newAnswerForm.inputs.briefSummary, firstResponse.briefSummary);

          await helpers.findInputAndType(driver, css.assignmentsStudent.newAnswerForm.inputs.explanation, firstResponse.explanation);

          await helpers.findAndClickElement(driver, css.assignmentsStudent.newAnswerForm.createBtn);
          return true;
        });
          checkWorkspaceStats(student.linkedWs.name, {submissions: 1});
      });
    });

    describe('Student2 submitting to assignment', function() {
      let student = student2;
      before(function() {
        return helpers.logout(driver)
          .then(() => {
            return helpers.login(driver, host, student);
          });
      });

      describe('Respond to assignment', function() {
        before(function() {
          return helpers.navigateAndWait(driver, assignmentsUrl, '.your-assignments')
          .then(() => {
            return driver.findElement(By.linkText(newAssignment.name))
            .then((link) => {
              return link.click()
              .then(() => {
                return helpers.waitForSelector(driver, css.assignmentsStudent.infoPage.submitBtn);
              });
            });
          });
        });

        it('should create response', async function() {
          let { firstResponse } = student;

          await helpers.findAndClickElement(driver, css.assignmentsStudent.infoPage.submitBtn);

          expect(await helpers.isElementVisible(driver, css.assignmentsStudent.newAnswerForm.container)).to.be.true;

          await helpers.findInputAndType(driver, css.assignmentsStudent.newAnswerForm.inputs.briefSummary, firstResponse.briefSummary);

          await helpers.findInputAndType(driver, css.assignmentsStudent.newAnswerForm.inputs.explanation, firstResponse.explanation);

          await helpers.findAndClickElement(driver, css.assignmentsStudent.newAnswerForm.createBtn);
          return true;
        });
          checkWorkspaceStats(student.linkedWs.name, {submissions: 2});
      });
    });
  });

  describe('Checking if parent workspace auto-updated submissions', function() {
    before(async function() {
      await helpers.logout(driver);
      await helpers.login(driver, host, teacher);
    });
    checkWorkspaceStats(teacher.parentWorkspace.name, {submissions: 2, folders: teacher.parentWorkspace.initialFolders}, {doUseHref: true} );

  });

});