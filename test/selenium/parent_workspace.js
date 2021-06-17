// 1) Parent Workspace creation and updating
// Creating markup in child workspaces
//   Marking up as student1
//     Creating a response:
// TimeoutError: Could not find Response Sent in DOM
// Wait timed out after 8116ms

//For some reason student1 is not able to click "save", doing so manually passes all tests

// REQUIRE MODULES
const { Builder, By } = require('selenium-webdriver');

const expect = require('chai').expect;
require('geckodriver');
// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const fixtures = require('./fixtures/parent_workspace');

const host = helpers.host;

const RadioButtonSelector = require('./utilities/radio_group');
const SweetAlertDriver = require('./utilities/sweet_alert');

describe('Parent Workspace creation and updating', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;

  let { newAssignment, teacher, student1, student2 } = fixtures;

  let radioButtonSelector;
  let swalDriver;

  let assignmentInfoUrlRegEx = new RegExp(`^${host}/#/assignments/[0-9a-fA-F]{24}$`);

  let workspaceInfoUrlRegEx = new RegExp(`^${host}/#/workspaces/[0-9a-fA-F]{24}/info$`);

  let assignmentsUrl = `${host}/#/assignments`;
  let workspacesUrl = `${host}/#/workspaces`;

  let parentWorkspaceHref;
  let parentWorkspaceInfoHref;

  let student1WorkspaceHref;
  let student2WorkspaceHref;

  function getWsInfoHref(wsHref) {

    return wsHref.replace(/\/work$/, `/info`);
  }

  function goToWsInfo(url) {
    return helpers.navigateAndWait(driver, url, {selector: css.wsInfo.settings.editBtn});
  }

  before(async function() {
    driver = new Builder()
      .forBrowser('firefox')
      .build();
    await dbSetup.prepTestDb();
    radioButtonSelector = new RadioButtonSelector(driver);
    swalDriver = new SweetAlertDriver(driver);
    try {
      await helpers.login(driver, host, teacher);
    }catch(err) {
      throw(err);
    }
  });

  async function createAssignment(assignmentDetails, assignmentNewUrl=`${host}/#/assignments/new`) {
    let { section, problem, linkedWsName, parentWsName } = assignmentDetails;
    let inputSelectors = css.assignmentsNew.inputs;

    let linkedNameInput= css.assignmentsTeacher.linkedWorkspaces.nameInput;

    let parentNameInput = css.assignmentsTeacher.parentWorkspace.nameInput;

    try {
      await helpers.navigateAndWait(driver, assignmentNewUrl, {selector: css.assignmentsNew.container});

      // select section
      await helpers.selectSingleSelectizeItem(driver, inputSelectors.section.input, section.name, section.id );

      // select problem
      await helpers.selectSingleSelectizeItem(driver, inputSelectors.problem.input, problem.name , problem.id);

      // assignedDate dueDate optional

      // name optional

      // select yes for create linked ws
      await radioButtonSelector.selectRadioButton(inputSelectors.linkedWorkspaces.groupName, inputSelectors.linkedWorkspaces.yes.value);

      if (linkedWsName) {
        // use customName
        await helpers.clearElement(driver, linkedNameInput);
        await helpers.findInputAndType(driver, linkedNameInput, linkedWsName);
      }
      // select yes for parent ws

      await radioButtonSelector.selectRadioButton(inputSelectors.parentWorkspace.groupName, inputSelectors.parentWorkspace.yes.value);

      if (parentWsName) {
        await helpers.clearElement(driver, parentNameInput);
        await helpers.findInputAndType(driver, parentNameInput, parentWsName);

      }
      // submit

      await helpers.findAndClickElement(driver, css.assignmentsNew.submitBtn);

      await swalDriver.verifyToast('Assignment Created');
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
              await helpers.navigateAndWait(driver, workspacesUrl, {selector: '.results-list'});
              if (options.doUseHref) {
                await driver.get(parentWorkspaceHref);
                await helpers.waitForUrlMatch(driver, new RegExp(parentWorkspaceHref));

              } else {
                await helpers.navigateAndWait(driver, workspacesUrl, {selector: '.results-list'});
                let link = await driver.findElement(By.linkText(workspaceName));
                await link.click();

              await helpers.waitForSelector(driver, '.info-link');

              }
                await helpers.dismissWorkspaceTour(driver);
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

  function checkWorkspaceStatsFromPage (expectedStats) {
    let { submissions, selections, comments, folders, responses } = expectedStats;

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
  }

  async function createTextSelection(node1Selector, node2Selector, initialSelectionsCount) {
    try {
      let selectionLinkSelector = css.workspace.selections.selectionLink;
      let createdSelectionSelector = css.workspace.selections.selectedDraggable;
      let toastText = 'Selection Created';

      let [node1, node2] = await Promise.all([
        helpers.getWebWelementByCss(driver, node1Selector),
        helpers.getWebWelementByCss(driver, node2Selector)
      ]);
      const actions = driver.actions();

      await actions.dragAndDrop(node1, node2).perform();

      await swalDriver.verifyToast(toastText);

      let selectionLinks = await helpers.getWebElements(
        driver,
        selectionLinkSelector
      );
      expect(selectionLinks).to.have.lengthOf(initialSelectionsCount + 1);

      let createdSelection = await helpers.getWebWelementByCss(
        driver,
        createdSelectionSelector
      );
      return createdSelection;
    }catch(err) {
      throw(err);
    }
  }

  async function createComment(selectionWebEl, commentType, text, initialCount) {
    try {
      let commentTypes = ['notice', 'wonder', 'feedback'];

      if (!commentTypes.includes(commentType)) {
        throw new Error(`${commentType} is not a valid comment type`);
      }

      await selectionWebEl.click();

      await helpers.selectOption(driver, css.wsComments.commentTypeSelect, commentType, true);

      await helpers.findInputAndType(driver, css.wsComments.textArea, text);
      await helpers.findAndClickElement(driver, css.wsComments.save);

      let toastText = 'Comment Created';

      await swalDriver.verifyToast(toastText);

      let commentListItems = await helpers.getWebElements(driver, css.wsComments.commentListItem);

      expect(commentListItems).to.have.lengthOf(initialCount + 1);

      return commentListItems[0];
    }catch(err) {
      throw(err);
    }
  }

  async function deleteFolderByName(folderName) {
    try {
      await helpers.findAndClickElement(driver, css.workspace.folders.edit);

      let deleteSelector = `span[data-test="trash-${folderName}"]`;
      let deleteBtn = await helpers.waitForSelector(driver, deleteSelector);
      await deleteBtn.click();
      await swalDriver.confirmYesNoModal(`${folderName} deleted`);

      console.log(1);
      await helpers.waitForAndClickElement(driver, css.workspace.folders.doneEditingIcon);
      console.log(2);
      await helpers.waitForSelector(driver, css.workspace.folders.edit);
      console.log(3);
    }catch(err) {
      throw(err);
    }
  }

  after(() => {
    return driver.quit();
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

  it('Should not save assignment when no changes were made', async function() {
    await helpers.waitForAndClickElement(driver, css.assignmentsTeacher.editAssignment);
    await helpers.waitForAndClickElement(driver, css.assignmentsTeacher.saveAssignment);
    let msg = 'No changes to save';
    expect(await helpers.waitForTextInDom(driver, msg)).to.eql(true);
  });

  describe('Resulting linked workspaces', function() {
    let linkedWorkspacesLinks;

    it('should have created a linked workspace for each student', function() {
      let expectedCount = newAssignment.students.length;
      let linkSel = css.assignmentsTeacher.linkedWorkspaces.link;

      let expectedNames = [fixtures.student1.linkedWs.name, fixtures.student2.linkedWs.name, fixtures.student3.linkedWs.name];
      return helpers.getWebElements(driver, linkSel)
        .then((links) => {
          linkedWorkspacesLinks = links;
          expect(links).to.have.lengthOf(expectedCount);
          return Promise.all(links.map(async (link) => {
            let name = await link.getAttribute('innerText');
            let href = await link.getAttribute('href');
            return {
              name,
              href
            };
          }))
          .then((hrefs) => {
            expect(hrefs.map(o => o.name)).to.have.members(expectedNames);
            hrefs.forEach((obj) => {
              if (obj.name === student1.linkedWs.name) {
                student1WorkspaceHref = obj.href;
              } else if (obj.name === student2.linkedWs.name) {
                student2WorkspaceHref = obj.href;
              }
            });
          });
        });
    });

    it('should have created a parent workspace', function() {
      let expectedCount = 1;
      let linkSel = css.assignmentsTeacher.parentWorkspace.link;
      return helpers.waitForNElements(driver, linkSel, 1)
        .then((links) => {
          expect(links).to.have.lengthOf(expectedCount);
          let link = links[0];
          return Promise.all([link.getAttribute('href'), link.getAttribute('innerText')])
            .then((results) => {
              let [href, name ] = results;
              parentWorkspaceHref = href;
              parentWorkspaceInfoHref = getWsInfoHref(href);
              expect(name).to.eql(newAssignment.parentWsName);

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
          return helpers.navigateAndWait(driver, assignmentsUrl, {selector: '.your-assignments'})
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
          return helpers.navigateAndWait(driver, assignmentsUrl,{selector: '.your-assignments'})
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

  describe('Creating markup in child workspaces', function()
   {
     let wsSelectors = css.workspace;
    describe('Marking up as student1', function() {
      let student = student1;
      let selectionsCount = 0;
      let taggingsCount = 0;
      let commentsCount = 0;

      let selectionLinkSel = wsSelectors.selections.selectionLink;
      let studentToMarkup = student2;

      let createdSelection;
      let secondSelection;
      let createdFolder;
      let secondFolder;

      let secondComment;
      let secondFolderName;

      before(async function() {
        try {
          let studentWsUrl = student1WorkspaceHref;

          await helpers.logout(driver);
          await helpers.login(driver, host, student);
          let toggleSelectingInput = await helpers.navigateAndWait(driver, studentWsUrl, {selector: wsSelectors.toggleSelectingInput});

          await helpers.findAndClickElement(driver, wsSelectors.submissionNav.rightArrow);
          await helpers.waitForElementToHaveText(driver, wsSelectors.studentItem, studentToMarkup.username);
          await toggleSelectingInput.click();

        }catch(err) {
          throw(err);
        }
      });

      it('Should not create selection just clicking on text', async function() {
        let nodeSel = '#node-1';
        let initialCount = selectionsCount;

        let node = await helpers.getWebWelementByCss(driver, nodeSel );
        await node.click();


        let selectionLinks = await helpers.getWebElements(driver, selectionLinkSel);

        expect(selectionLinks).to.have.lengthOf(initialCount);
      });

      it('Creating a selection', async function() {
        let nodeSel = '#node-1';
        let node2Sel = '#node-2';
        let initialCount = selectionsCount;

        createdSelection = await createTextSelection(nodeSel, node2Sel, initialCount);
        expect(createdSelection).to.exist;
      });

      it('Creating a second selection', async function() {
        let nodeSel = '#node-1';
        let node2Sel = '#node-2';
        let initialCount = selectionsCount + 1;

        secondSelection = await createTextSelection(nodeSel, node2Sel, initialCount);
        expect(secondSelection).to.exist;

      });

      it('Deleting second selection', async function() {
        let toastText = 'Selection Deleted';
        let deleteBtn = await secondSelection.findElement({tagName: 'span'});
        await deleteBtn.click();

        await swalDriver.confirmYesNoModal(toastText);
      });

      it('Creating a comment', async function() {
        let text = student.linkedWs.newComment.text;
        let createdComment = await createComment(createdSelection, 'notice', text, commentsCount);

        expect(createdComment).to.exist;
      });

      it('Creating a second comment', async function() {
        let text = student.linkedWs.newComment.text + 'second comment';
        secondComment = await createComment(createdSelection, 'feedback', text, commentsCount + 1);

        expect(secondComment).to.exist;

      });

      it('Deleting second comment', async function() {
        let deleteBtn = await secondComment.findElement({css: 'span.delete_button'});
        await deleteBtn.click();
        await swalDriver.confirmYesNoModal('Comment Deleted');
      });

      xit('Reusing a comment', async function() {

      });

      it('Creating a folder', async function() {
        let folderName = student.linkedWs.newFolder.name;
        await helpers.findAndClickElement(driver, wsSelectors.folders.add);
        let swalInput = await helpers.waitForSelector(driver, css.sweetAlert.textInput);
        await swalInput.sendKeys(folderName);
        await helpers.findAndClickElement(driver, css.sweetAlert.confirmBtn);

        let toastText = `${folderName} created`;

        await swalDriver.verifyToast(toastText);

        createdFolder = await helpers.getWebWelementByCss(driver, '.dropZone');
        expect(createdFolder).to.exist;
      });

      it('Creating a second folder', async function() {
        let folderName = student.linkedWs.newFolder.name + 'second folder';
        secondFolderName = folderName;
        await helpers.findAndClickElement(driver, wsSelectors.folders.add);
        let swalInput = await helpers.waitForSelector(driver, css.sweetAlert.textInput);
        await swalInput.sendKeys(folderName);
        await helpers.findAndClickElement(driver, css.sweetAlert.confirmBtn);

        let toastText = `${folderName} created`;

        await swalDriver.verifyToast(toastText);

        secondFolder = await helpers.getWebWelementByCss(driver, '.dropZone');
        expect(secondFolder).to.exist;
      });

      it('Deleting second folder', async function() {
        await deleteFolderByName(secondFolderName);
      });

      xit('Filing a selection', async function() {
        const actions = driver.actions({bridge: true});
        let successText = 'Selection Filed';

        await actions
          .dragAndDrop(createdSelection, createdFolder)
          .perform();
          await helpers.waitForTextInDom(driver, successText);

      let showFolderCircle = await helpers.getWebWelementByCss(driver, wsSelectors.folders.showFolderCircle);
      expect(await showFolderCircle.getText()).to.eql((taggingsCount + 1).toString());

      });

      it('Creating a response', async function() {
        try {
          await helpers.findAndClickElement(driver, wsSelectors.newResponse);

          await helpers.waitForAndClickElement(driver, css.responsesNew.saveBtn);

          // await helpers.waitForTextInDom(driver, successText);
          // expect(await helpers.isElementVisible(driver, css.responseInfo.mentorReplyView.unreadIcon)).to.eql(true);
        }catch(err) {
          throw(err);
        }

      });

      xit('Updating a response', async function() {

      });
    });
  });

  describe('Checking parent workspace for updates', function()
  {
    let expectedStats = {
      submissions: 2,
      folders: 4,
      selections: 1,
      comments: 1,
      responses: 1,
    };

    before(async function() {
      await helpers.logout(driver);
      await helpers.login(driver, host, teacher);
    });
    checkWorkspaceStats(teacher.parentWorkspace.name, expectedStats, { doUseHref: true } );
  });

  describe('Turning off auto updates for parent workspace', function() {
    async function openEditMenu() {
      await helpers.findAndClickElement(driver, css.wsInfo.settings.editBtn);
      await helpers.waitForSelector(driver, css.wsInfo.settings.saveEdit);
    }
    async function saveSettings() {
      await helpers.findAndClickElement(driver, css.wsInfo.settings.saveEdit);
      await helpers.waitForSelector(driver, css.wsInfo.settings.editBtn);
    }

    describe('Toggling from yes to no', function() {
      before(async function() {
        await goToWsInfo(parentWorkspaceInfoHref);
        await openEditMenu();
        await helpers.selectOption(
          driver,
          css.wsInfo.settings.autoUpdateSelect,
          'No',
          true
        );

        await saveSettings();
      });

      it('should display success toast message', async function() {
        expect(
          await helpers.isTextInDom(
            driver,
            css.wsInfo.settings.updateSuccessText
          )
        ).to.eql(true);
      });

      it('should display No for automatic updates', async function() {
        expect(
          await helpers.findAndGetText(
            driver,
            css.wsInfo.settings.autoUpdateText
          )
        ).to.eql('No');
      });

      it('should display no after page refresh', async function() {
        await goToWsInfo(parentWorkspaceInfoHref);
        expect(
          await helpers.findAndGetText(
            driver,
            css.wsInfo.settings.autoUpdateText
          )
        ).to.eql('No');
      });
    });

    describe('Manually updating ', function() {
      it('Should display workspace up to date toast', async function() {
        let msg = 'Workspace Up to Date';
        await helpers.findAndClickElement(
          driver,
          css.wsInfo.settings.updateParentWs
        );
        let didAppear = await helpers.waitForTextInDom(driver, msg);
        expect(didAppear).to.eql(true);
      });
    });

    describe('Additional student markup while autoupdate is off', function() {
      let wsSelectors = css.workspace;
      describe('Marking up as student2', function() {
        let student = student2;
        let selectionsCount = 0;
        let taggingsCount = 0;

        let selectionLinkSel = wsSelectors.selections.selectionLink;
        let studentToMarkup = student1;

        let createdSelection;
        let createdFolder;

        before(async function() {
          try {
            let studentWsUrl = student2WorkspaceHref;

            await helpers.logout(driver);
            await helpers.login(driver, host, student);
            let toggleSelectingInput = await helpers.navigateAndWait(
              driver,
              studentWsUrl,
              {selector: wsSelectors.toggleSelectingInput}
            );

            await helpers.waitForElementToHaveText(
              driver,
              wsSelectors.studentItem,
              studentToMarkup.username
            );
            await toggleSelectingInput.click();
            await helpers.waitForSelector(
              driver,
              wsSelectors.selectableArea.container
            );
          } catch (err) {
            throw err;
          }
        });

        it('Should not create selection just clicking on text', async function() {
          let nodeSel = '#node-1';
          let initialCount = selectionsCount;

          let node = await helpers.getWebWelementByCss(driver, nodeSel);
          await node.click();

          let selectionLinks = await helpers.getWebElements(
            driver,
            selectionLinkSel
          );

          expect(selectionLinks).to.have.lengthOf(initialCount);
        });

        it('Creating a selection', async function() {
          let nodeSel = '#node-1';
          let node2Sel = '#node-2';
          let initialCount = selectionsCount;

          createdSelection = await createTextSelection(nodeSel, node2Sel, initialCount);
          expect(createdSelection).to;
        });

        it('Creating a comment', async function() {
          let text = student.linkedWs.newComment.text;

          await helpers.findInputAndType(driver, css.wsComments.textArea, text);
          await helpers.findAndClickElement(driver, css.wsComments.save);
          await helpers.waitForTextInDom(driver, 'Comment Created');

          let commentLinkItems = await helpers.getWebElements(
            driver,
            css.wsComments.commentText
          );
          expect(commentLinkItems).to.have.lengthOf(1);
        });

        xit('Reusing a comment', async function() {});

        it('Creating a folder', async function() {
          let folderName = student.linkedWs.newFolder.name;
          await helpers.findAndClickElement(driver, wsSelectors.folders.add);
          let swalInput = await helpers.waitForSelector(
            driver,
            css.sweetAlert.textInput
          );
          await swalInput.sendKeys(folderName);
          await helpers.findAndClickElement(driver, css.sweetAlert.confirmBtn);

          let toastText = `${folderName} created`;

          await swalDriver.verifyToast(toastText);

          createdFolder = await helpers.getWebWelementByCss(
            driver,
            '.dropZone'
          );
          expect(createdFolder).to.exist;
        });

        xit('Filing a selection', async function() {
          const actions = driver.actions({ bridge: true });
          let successText = 'Selection Filed';

          await actions.dragAndDrop(createdSelection, createdFolder).perform();
          await helpers.waitForTextInDom(driver, successText);

          let showFolderCircle = await helpers.getWebWelementByCss(
            driver,
            wsSelectors.folders.showFolderCircle
          );
          expect(await showFolderCircle.getText()).to.eql(
            (taggingsCount + 1).toString()
          );
        });

        it('Creating a response', async function() {
          try {
            let successText = 'Response Sent';
            await helpers.findAndClickElement(driver, wsSelectors.newResponse);

            await helpers.waitForAndClickElement(
              driver,
              css.responsesNew.saveBtn
            );

            await helpers.waitForTextInDom(driver, successText);
            expect(
              await helpers.existsElement(
                driver,
                css.responseInfo.mentorReplyView.unreadIcon
              )
            ).to.eql(true);
          } catch (err) {
            throw err;
          }
        });

        xit('Updating a response', async function() {});
      });

      describe('Checking parent workspace did not update automatically', function() {
        let expectedStats = {
          submissions: 2,
          folders: 4,
          selections: 1,
          comments: 1,
          responses: 1
        };

        before(async function() {
          await helpers.logout(driver);
          await helpers.login(driver, host, teacher);
        });
        checkWorkspaceStats(teacher.parentWorkspace.name, expectedStats, {
          doUseHref: true
        });
      });
    });

    describe('Manually updating after additional markup', function() {
      // already on info page
      it('Should display update success toast', async function() {
          let msg = 'Successfully updated parent workspace';
        await helpers.findAndClickElement(
          driver,
          css.wsInfo.settings.updateParentWs
        );
        let didAppear = await helpers.waitForTextInDom(driver, msg);
        expect(didAppear).to.eql(true);
      });

      describe('Checking that stats updated', function() {
        let expectedStats = {
          submissions: 2,
          folders: 5,
          selections: 2,
          comments: 2,
          responses: 2
        };

        checkWorkspaceStatsFromPage(expectedStats);

      });
    });
  });

});