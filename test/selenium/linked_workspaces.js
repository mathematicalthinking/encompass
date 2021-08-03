// REQUIRE MODULES
const {Builder } = require('selenium-webdriver');
const expect = require('chai').expect;
// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const { newLinkedWs, assignment, originalLinkedWs } = require('./fixtures/linked_workspaces');

const wsInfoSelectors = css.wsInfo;

const host = helpers.host;

let owner = {
  username: 'ssmith',
  password: 'ssmith',
  _id: '5b4e4b48808c7eebc9f9e827',
  name: 'Summer Smith',
};

describe('Linking multiple workspaces to one assignment', function() {

  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, owner);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  async function openEditMenu() {
    await helpers.findAndClickElement(driver, css.wsInfo.settings.editBtn);
    await helpers.waitForSelector(driver, css.wsInfo.settings.cancelEdit);
    await helpers.waitForSelector(driver, css.wsInfo.settings.saveEdit);
  }

  async function saveSettings() {
    await helpers.findAndClickElement(driver, css.wsInfo.settings.saveEdit);
    await helpers.waitForSelector(driver, css.wsInfo.settings.editBtn);
  }

  let newWsBaseUrl = `${host}/workspaces/${newLinkedWs._id}`;
  let newWsInfoUrl = `${newWsBaseUrl}/info`;

  let assignmentInfoUrl = `${host}/assignments/${assignment._id}`;

  let newWsUrlFirstSub = `${newWsBaseUrl}/submissions/${newLinkedWs.firstSubmissionId}`;

  describe('Linking new workspace to assignment', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, newWsInfoUrl, {selector: wsInfoSelectors.container});
    });

    describe('Setting Linked Assignment', function() {
      before(async function() {
        await openEditMenu();
        let input = await helpers.getWebElements(driver, wsInfoSelectors.settings.linkedAssnInput);
        await input[0].sendKeys(assignment.name.slice(0,2));
        await helpers.waitForAndClickElement(driver, 'div.option.active');

        expect(await helpers.findAndGetText(driver, wsInfoSelectors.settings.linkedAssnText)).to.contain(assignment.name);
        await saveSettings();
      });

      it('should display success toast message', async function() {
        expect(await helpers.isTextInDom(driver, wsInfoSelectors.settings.updateSuccessText)).to.eql(true);
      });

      it('should display Linked Assignment name ', async function() {
        expect(await helpers.findAndGetText(driver, wsInfoSelectors.settings.linkedAssnText)).to.contain(assignment.name);

      });

      xit('should still display linked assignment name after page refresh', async function() {
        await helpers.navigateAndWait(driver, newWsInfoUrl, {selector: wsInfoSelectors.settings.container});
        expect(await helpers.findAndGetText(driver, wsInfoSelectors.settings.linkedAssnText)).to.contain(assignment.name);

      });
    });
  });

  describe('Visiting assignment page', function() {
    before(function() {
      return helpers.navigateAndWait(driver, assignmentInfoUrl, {selector: css.assignmentsTeacher.editAssignment})
      .catch((err) => {
        throw(err);
      });

    });
    after(async function() {
      await helpers.findAndClickElement(driver, css.topBar.logout);
    });

    it('should display 3 linkedWorkspaces', async function() {
      let wsLinks = await helpers.getWebElements(driver, css.assignmentsTeacher.linkedWorkspaces.link);
      expect(wsLinks).to.have.lengthOf(3);

      let wsNames = await Promise.all(wsLinks.map((webEl) => {
        return webEl.getAttribute('innerText');
      }));
      expect(wsNames).to.include(newLinkedWs.name);
    });

    xit('should display link to recently linked workspace', async function() {
      await helpers.waitForSelector(driver, css.workspace.container);
      expect(await helpers.getCurrentUrl(driver)).to.eql(newWsUrlFirstSub);
    });

    describe('Creating response in newly linked workspace', function() {
      it('should create response successfully', async function() {
        await helpers.navigateAndWait(driver, newWsUrlFirstSub, {selector: css.workspace.container});
        await helpers.findAndClickElement(driver, css.workspace.newResponse);

        await helpers.findAndClickElement(driver, 'button.new-response');
        await helpers.waitForSelector(driver, 'div.response-title');
        await helpers.findAndClickElement(driver,'button.save-response');
      });
    });
  });

  describe('Revising from responses page', function() {
    let submitterCss = css.responseInfo.submissionView;
    let answerNewCss = css.assignmentsStudent.newAnswerForm;

    describe('For original linked workspace', function() {
      let workspace = originalLinkedWs;
      let student = workspace.student;
      let responseUrl = `${host}/responses/submission/${student.submissionId}?responseId=${student.responseId}`;

      before(async function() {
        await helpers.login(driver, host, student);
        await helpers.navigateAndWait(driver, responseUrl, {selector: submitterCss.reviseBtn});
        await helpers.findAndClickElement(driver, submitterCss.reviseBtn);
      });

      after(async function() {
        await helpers.findAndClickElement(driver, css.topBar.logout);
      });

      describe('Submitting revision from response page', function() {
        let newExplanation = 'Revised explanation';

        it('should successfully create revision', async function () {
          let toastMsg = 'Answer Created';
          await helpers.clearElement(driver, answerNewCss.inputs.explanation);
          await helpers.findInputAndType(driver, answerNewCss.inputs.explanation, newExplanation);

          await helpers.findAndClickElement(driver, answerNewCss.createBtn);

          await helpers.waitForTextInDom(driver, toastMsg);
          await helpers.waitForRemoval(driver, css.sweetAlert.container);
          let revItems = await helpers.getWebElements(driver, submitterCss.revIndexItem);
          expect(revItems).to.have.lengthOf(student.originalRevisionCount + 1);
        });

        it('linked workspace should have been updated', async function() {

          await driver.get(`${host}/workspaces/${workspace._id}/work`);
          await helpers.waitForSelector(driver, 'span.submission_count');

          // click x button on tour box
          await helpers.findAndClickElement(driver, 'div.guiders_x_button');

          await helpers.waitForRemoval(driver, 'div#guiders_overlay');

          expect(await helpers.findAndGetText(driver, 'span.submission_count')).to.eql(((workspace.originalSubmissionCount + 1).toString()));

        });


      });
    });

    describe('For newly linked workspace', function() {
      let workspace = newLinkedWs;
      let student = workspace.student;
      let responseUrl = `${host}/responses/submission/${student.submissionId}`;

      before(async function() {
        await helpers.login(driver, host, student);
        await helpers.navigateAndWait(driver, responseUrl, {selector: submitterCss.reviseBtn});
        await helpers.findAndClickElement(driver, submitterCss.reviseBtn);
      });

      after(async function() {
        await helpers.findAndClickElement(driver, css.topBar.logout);
      });

      describe('Submitting revision from response page', function() {
        after(async function() {
          await helpers.findAndClickElement(driver, css.topBar.logout);
        });

        let newExplanation = 'Revised explanation';

        it('should successfully create revision', async function () {
          let toastMsg = 'Answer Created';
          await helpers.clearElement(driver, answerNewCss.inputs.explanation);
          await helpers.findInputAndType(driver, answerNewCss.inputs.explanation, newExplanation);

          await helpers.findAndClickElement(driver, answerNewCss.createBtn);

          await helpers.waitForTextInDom(driver, toastMsg);
          await helpers.waitForRemoval(driver, css.sweetAlert.container);

          let revItems = await helpers.getWebElements(driver, submitterCss.revIndexItem);
          expect(revItems).to.have.lengthOf(student.originalRevisionCount + 1);
        });

        it('linked workspace should have been updated', async function() {

          await driver.get(`${host}/workspaces/${workspace._id}/work`);
          await helpers.waitForSelector(driver, 'span.submission_count');

          // click x button on tour box
          await helpers.findAndClickElement(driver, 'div.guiders_x_button');

          await helpers.waitForRemoval(driver, 'div#guiders_overlay');

          expect(await helpers.findAndGetText(driver, 'span.submission_count')).to.eql(((workspace.originalSubmissionCount + 1)).toString());

        });


      });

      describe('Visiting assignment page', function() {
        before(async function() {
          await helpers.login(driver, host, owner);
          await helpers.navigateAndWait(driver, assignmentInfoUrl, {selector: css.assignmentsTeacher.editAssignment});
        });

        it('should have automatically updated assignment revision counts', async function() {
          let updatedCount = 4;
          let didAppear = await helpers.waitForTextInDom(driver, `for a total of ${updatedCount} submissions` );
          expect(didAppear).to.eql(true);
        });
      });
    });
  });


});