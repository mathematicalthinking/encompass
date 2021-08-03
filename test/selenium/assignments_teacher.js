// REQUIRE MODULES
const { Builder, } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const SwalDriver = require('./utilities/sweet_alert');
const { assignmentsTeacher: assnSels } = css;
const { cancelAssignment: cancelAssn, editAssignment: editAssn } = assnSels;
const host = helpers.host;

const fixtures = require('./fixtures/assignments_teacher');

let teacherInfo = {
  username: 'mtgteacher',
  password: 'test',
  _id: "5c6eb45d9852e5710311d633",
  name: 'Alex Smith',
};

let assignmentInfo = {
  _id: "5c6eb5199852e5710311d638",
  name: 'MTG Period 1 SCR',
  problemName: 'Seven Congruent Rectangles',
  className: 'MTG Period! SCR',
};

describe('Assignment Info as Teacher', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  let swalDriver;

  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    swalDriver = new SwalDriver(driver);
    try {
      await helpers.login(driver, host, teacherInfo);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  describe('Navigating to assignment info', function() {
    let assignmentId = assignmentInfo._id;
    let url = `${host}/assignments/${assignmentId}`;
    before(async function() {
      let selector = editAssn;
      await helpers.navigateAndWait(driver, url, { selector } );
    });

    it('should display Edit Assignment Button', async function() {
      let btn = await helpers.getWebElements(driver, editAssn);
      expect(btn[0]).to.exist;

    });

    function isEditing(webDriver) {
      let containerSel = assnSels.container;
      let targetClass = 'is-editing';
      return helpers.getWebWelementByCss(webDriver, containerSel)
        .then((container) => {
          return container.getAttribute('class')
            .then((className) => {
              return className.includes(targetClass);
            });
        });
    }
    describe('After clicking Edit', function() {
      let addLinkedWsBtn;

      it('should display trashcan button/icon after clicking edit', async function() {

        await helpers.findAndClickElement(driver, editAssn);
        await helpers.waitForSelector(driver, assnSels.trashBtn);

        expect(await helpers.isElementVisible(driver, assnSels.trashBtn)).to.eql(true);

      });

      it('Should not display Add Parent Workspace button', async function() {
        expect(
          await helpers.isElementVisible(
            driver,
            assnSels.parentWorkspace.add
          )
        ).to.eql(false);
      });

      it('Should display no parent workspace info msg', async function() {
        expect(
          await helpers.isElementVisible(
            driver,
            assnSels.parentWorkspace.noParentMsg
          )
        ).to.eql(true);
      });

      it('Should display Add LinkedWorkspaces button', async function() {
        addLinkedWsBtn = await helpers.getWebWelementByCss(
          driver,
          assnSels.linkedWorkspaces.add
        );

        expect(await addLinkedWsBtn.isDisplayed()).to.eql(true);
      });

      it('Should not display full linked workspace info msg', async function() {
        expect(
          await helpers.isElementVisible(
            driver,
            assnSels.linkedWorkspaces.fullLinkedMsg
          )
        ).to.eql(false);
      });

      it('Should stop editing after hitting cancel', async function() {
        await helpers.findAndClickElement(
          driver,
          cancelAssn
        );
        await helpers.waitForRemoval(
          driver,
          assnSels.saveAssignment
        );
        expect(await isEditing(driver)).to.eql(false);
      });

      it('Should not save assignment when no changes were made', async function() {
        await helpers.findAndClickElement(driver, editAssn);
        await helpers.waitForSelector(driver, assnSels.trashBtn);

        await helpers.findAndClickElement(driver, assnSels.saveAssignment);
        let msg = 'No changes to save';
        expect(await helpers.waitForTextInDom(driver, msg)).to.eql(true);
      });

      describe('Adding linked workspaces', function() {
        let nameInputSel = assnSels.linkedWorkspaces.nameInput;
        let usernames = fixtures.linkedWorkspaces.studentUsernames;
        let defaultName = fixtures.linkedWorkspaces.defaultName;

        function getLinkedWsNamePreviews(webDriver) {
          let sel = assnSels.linkedWorkspaces.namePreviews;
          return helpers.getWebElements(webDriver, sel).then(els => {
            return Promise.all(
              els.map(el => {
                return el.getAttribute('innerText');
              })
            );
          });
        }

        function getLinkedWsNameVal(webDriver) {
          let sel = nameInputSel;
          return helpers.getWebWelementByCss(webDriver, sel).then(el => {
            return el.getAttribute('value');
          });
        }

        before(async function() {
          await helpers.findAndClickElement(
            driver,
            editAssn
          );
          await helpers.waitForAndClickElement(
            driver,
            assnSels.linkedWorkspaces.add
          );
          await helpers.waitForSelector(driver, nameInputSel);
        });

        it('Name input should be prefilled', async function() {
          let expectedText = defaultName;
          expect(await getLinkedWsNameVal(driver)).to.eql(expectedText);
        });

        it('Should display name previews', async function() {
          let nameVal = defaultName;
          let expected = usernames.map(username => {
            return `${username}: ${nameVal}`;
          });
          let actual = await getLinkedWsNamePreviews(driver);

          expect(actual).to.have.members(expected);
        });

        it('Modifying name format should change name previews', async function() {
          let original = defaultName;
          let newText = ' workspace';
          let expected = usernames.map(username => {
            return `${username}: ${original}${newText}`;
          });

          await helpers.findInputAndType(driver, nameInputSel, newText);
          let actual = await getLinkedWsNamePreviews(driver);
          expect(actual).to.have.members(expected);
        });

        it('Clearing input should display default name previews', async function() {
          await helpers.clearElement(driver, nameInputSel);
          await driver.sleep(100);
          let nameVal = defaultName;
          let expected = usernames.map(username => {
            return `${username}: ${nameVal}`;
          });
          let actual = await getLinkedWsNamePreviews(driver);

          expect(actual).to.have.members(expected);
        });

        it('Clicking Save Assignment should display error toast and not save', async function() {
          let msg = fixtures.toasts.finishLinkedWs;
          await helpers.findAndClickElement(
            driver,
            assnSels.saveAssignment
          );

          await swalDriver.verifyToast(msg);
          expect(await isEditing(driver)).to.eql(true);
        });

        describe('Canceling assignment edit while linked workspace form is open', function() {
          it('Clicking cancel should prompt user to confirm cancelling', async function() {
            await helpers.findAndClickElement(
              driver,
              cancelAssn
            );
            await helpers.waitForSelector(driver, css.sweetAlert.modal);

            expect(await isEditing(driver)).to.eql(true);
          });

          it('Clicking modal cancel button should close modal and still be editing', async function() {
            await swalDriver.cancelYesNoModal();
            expect(
              await helpers.isElementVisible(
                driver,
                cancelAssn
              )
            ).to.eql(true);
            expect(await isEditing(driver)).to.eql(true);
          });

          it('Clicking modal confirm should cancel editing of assignment', async function() {
            await helpers.findAndClickElement(
              driver,
              cancelAssn
            );

            await swalDriver.confirmYesNoModal();

            await helpers.waitForRemoval(
              driver,
              assnSels.linkedWorkspaces.container
            );
            await helpers.waitForRemoval(
              driver,
              assnSels.linkedWorkspaces.cancel
            );
            expect(await isEditing(driver)).to.eql(false);
          });
        });

        describe('Clicking cancel on linked ws form', function() {
          it('Should hide input', async function() {
            await helpers.findAndClickElement(
              driver,
              editAssn
            );

            await helpers.waitForAndClickElement(
              driver,
              assnSels.linkedWorkspaces.add
            );

            await helpers.waitForAndClickElement(
              driver,
              assnSels.linkedWorkspaces.cancel
            );

            let didRemove = await helpers.waitForRemoval(
              driver,
              assnSels.linkedWorkspaces.container
            );
            expect(didRemove).to.eql(true);
          });
        });

        describe('Creating linked workspaces', function() {
          before(async function() {
            await helpers.findAndClickElement(
              driver,
              assnSels.linkedWorkspaces.add
            );

            await helpers.findAndClickElement(
              driver,
              assnSels.linkedWorkspaces.create
            );
          });

          it('Should display success toast', async function() {
            let didAppear = await helpers.waitForTextInDom(
              driver,
              fixtures.toasts.linkedWsSuccess
            );
            expect(didAppear).to.eql(true);
          });

          it('Linked workspace form should be closed', async function() {
            expect(
              await helpers.isElementVisible(
                driver,
                assnSels.linkedWorkspaces.container
              )
            ).to.eql(false);
          });

          it('Should still be editing assignment', async function() {
            expect(await isEditing(driver)).to.eql(true);
          });

          it('Should display newly created workspace links', async function() {
            let links = await helpers.getWebElements(
              driver,
              assnSels.linkedWorkspaces.link
            );

            let expectedCount =
              fixtures.linkedWorkspaces.studentUsernames.length;

            expect(links).to.have.lengthOf(expectedCount);
          });

          it('Should display full linked workspaces msg', async function() {
            expect(
              await helpers.isElementVisible(
                driver,
                assnSels.linkedWorkspaces.fullLinkedMsg
              )
            ).to.eql(true);
          });

          it('Should not display Add LinkedWorkspaces button', async function() {
            expect(
              await helpers.isElementVisible(
                driver,
                assnSels.linkedWorkspaces.add
              )
            ).to.eql(false);
          });
        });
      });
      describe('Adding parent workspaces', function() {
        let nameInputSel = assnSels.parentWorkspace.nameInput;
        let defaultName = fixtures.parentWorkspace.defaultName;

        function getParentWsNameVal(webDriver) {
          let sel = nameInputSel;
          return helpers.getWebWelementByCss(webDriver, sel).then(el => {
            return el.getAttribute('value');
          });
        }

        before(async function() {
          await helpers.findAndClickElement(
            driver,
            assnSels.parentWorkspace.add
          );
          await helpers.waitForSelector(driver, nameInputSel);
        });

        it('Name input should be prefilled', async function() {
          let expectedText = defaultName;
          expect(await getParentWsNameVal(driver)).to.eql(expectedText);
        });

        it('Clicking Save Assignment should display error toast and not save', async function() {
          let msg = fixtures.toasts.finishParentWs;
          await helpers.findAndClickElement(
            driver,
            assnSels.saveAssignment
          );

          await swalDriver.verifyToast(msg);
          expect(await isEditing(driver)).to.eql(true);
        });

        describe('Canceling assignment edit while parent workspace form is open', function() {
          it('Clicking cancel should prompt user to confirm cancelling', async function() {
            await helpers.findAndClickElement(
              driver,
              cancelAssn
            );
            await helpers.waitForSelector(driver, css.sweetAlert.modal);

            expect(await isEditing(driver)).to.eql(true);
            // await helpers.saveScreenshot(driver);
          });

          it('Clicking modal cancel button should close modal and still be editing', async function() {
            await swalDriver.cancelYesNoModal();
            await helpers.waitForElToBeVisible(driver, cancelAssn);
            expect(await isEditing(driver)).to.eql(true);
          });

          it('Clicking modal confirm should cancel editing of assignment', async function() {
            await helpers.findAndClickElement(
              driver,
              cancelAssn
            );
              await swalDriver.confirmYesNoModal();

            await helpers.waitForRemoval(
              driver,
              assnSels.parentWorkspace.container
            );
            await helpers.waitForRemoval(
              driver,
              assnSels.parentWorkspace.cancel
            );
            expect(await isEditing(driver)).to.eql(false);
          });
        });

        describe('Clicking cancel on linked ws form', function() {
          it('Should hide input', async function() {
            await helpers.findAndClickElement(
              driver,
              editAssn
            );

            await helpers.waitForAndClickElement(
              driver,
              assnSels.parentWorkspace.add
            );

            await helpers.waitForAndClickElement(
              driver,
              assnSels.parentWorkspace.cancel
            );

            let didRemove = await helpers.waitForRemoval(
              driver,
              assnSels.parentWorkspace.container
            );
            expect(didRemove).to.eql(true);
          });
        });

        describe('Creating parent workspace', function() {
          before(async function() {
            await helpers.findAndClickElement(
              driver,
              assnSels.parentWorkspace.add
            );

            await helpers.findAndClickElement(
              driver,
              assnSels.parentWorkspace.create
            );
          });

          it('Should display success toast', async function() {
            await swalDriver.verifyToast(fixtures.toasts.parentWsSuccess);
          });

          it('Parent workspace form should be closed', async function() {
            expect(
              await helpers.isElementVisible(
                driver,
                assnSels.parentWorkspace.container
              )
            ).to.eql(false);
          });

          it('Should still be editing assignment', async function() {
            expect(await isEditing(driver)).to.eql(true);
          });

          it('Should display newly created workspace link', async function() {
            let links = await helpers.getWebElements(
              driver,
              assnSels.parentWorkspace.link
            );

            let expectedCount = 1;

            expect(links).to.have.lengthOf(expectedCount);
          });

          it('Should not display Add Parent Workspace button', async function() {
            expect(
              await helpers.isElementVisible(
                driver,
                assnSels.parentWorkspace.add
              )
            ).to.eql(false);
          });
        });
      });
      describe('Deleting assignment', function() {
        it('confirm modal should be displayed after clicking trash icon', async function() {
          await helpers.findAndClickElement(driver, editAssn);
          let confirmTrash = assnSels.confirmTrash;
          await helpers.findAndClickElement(driver, assnSels.trashBtn);
          await helpers.waitForSelector(driver, confirmTrash);
          expect(await helpers.isElementVisible(driver, confirmTrash)).to.eql(true);
        });

        it('clicking confirm delete should remove assignment from the list', async function() {
          await helpers.findAndClickElement(driver, assnSels.confirmTrash);

          let linkSelector = `a[href="${url}"]`;
          let didRemove = await helpers.waitForRemoval(driver, linkSelector);
          expect(didRemove).to.eql(true);
        });
      });
    });
  });


});