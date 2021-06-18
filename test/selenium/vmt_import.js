//TODO set up mock VMT server data

// REQUIRE MODULES
const {Builder } = require('selenium-webdriver');
const expect = require('chai').expect;
// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const { newWs } = require('./fixtures/vmt_import');

const host = helpers.host;

let user = {
  username: 'jl_picard',
  password: 'enterprise',
  _id: '5d1a59d79c78ad48c0480cc0',
  name: 'jean-luc picard',
};

xdescribe('Importing VMT Work', function() {

  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    try {
      driver = new Builder()
      .forBrowser('chrome')
      .build();
      await dbSetup.prepTestDb();
      console.log('db prepped vmt');
      return helpers.login(driver, host, user);
    }catch(err) {
      throw(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  describe('Visiting VMT Import Page', function() {
    describe('Using direct link', function() {
      let url = `${host}/#/vmt/import`;
      before(async function() {
        await helpers.navigateAndWait(driver, url, {selector: css.vmtImport.search.container});
      });

      it('should load import page on step 1', async function() {
        expect(await helpers.isElementVisible(driver, css.vmtImport.search.container)).to.eql(true);
      });
    });

    describe('Searching for Rooms / Activities', function() {
      let searchInput = css.vmtImport.search.input;

      it('Should display error clicking next without selecting any rooms', async function() {
        await helpers.findAndClickElement(driver, css.vmtImport.next);
        expect(await helpers.isTextInDom(driver, css.vmtImport.noRoomsError)).to.eql(true);

        await helpers.waitForRemoval(driver, css.sweetAlert.container);

        expect(await helpers.isElementVisible(driver, css.vmtImport.search.container)).to.eql(true);
      });

      it('searching for nonexistent room name should yield no results', async function() {
        await helpers.findInputAndType(driver, searchInput, 'bogusname');
        let roomsMsg = css.vmtImport.noRoomsResult;
        let activitiesMsg = css.vmtImport.noActivitiesResult;

        let roomsList = await helpers.waitForSelector(driver, '.vmt-room-list');

        console.log('roomsList', roomsList);

        let activityList = await helpers.waitForSelector(driver, '.vmt-activity-list');
        console.log('activityList', activityList);
        await helpers.waitForElementToHaveText(driver, css.vmtImport.noRoomsItem, roomsMsg);
        console.log('after rooms');
        await helpers.waitForElementToHaveText(driver, css.vmtImport.noActivitiesItem, activitiesMsg);

        console.log('after activities');
      });

      xdescribe('should return both own and public activities', function() {
        // currently no test activities with rooms
        let info = {
          query: 'activity',
          numRooms: 0,
          numActivities: 0,
          activityNoRoomsId: '5bd1da254b2d4b2a6c45def7',

        };
        before(async function() {
          await helpers.clearElement(driver, searchInput);
          await helpers.findInputAndType(driver, searchInput, info.query);

          await helpers.waitForSelector(driver, css.vmtImport.activityListItem);

        });

        it(`Should return ${info.numActivities} activities`, async function() {
          let activityResults = await helpers.getWebElements(driver, css.vmtImport.activityListItem);


          expect(activityResults).to.have.lengthOf(info.numActivities);
        });

        it(`Should return ${info.numRooms} rooms`, async function() {
          let roomResults = await helpers.getWebElements(driver, css.vmtImport.roomListItem);

          expect(roomResults).to.have.lengthOf(info.numRooms);
        });

        // default behavior is now to not return activities with no rooms
        // restore if test is added for selecting "return all activities"
        xit('Should display error message clicking checkbox for activity with no rooms', async function() {
          let sel = `input[value="${info.activityNoRoomsId}"]`;
          await helpers.findAndClickElement(driver, sel);

          expect(await helpers.isTextInDom(driver, css.vmtImport.activityNoRoomsError)).to.eql(true);

          await helpers.waitForRemoval(driver, css.sweetAlert.container);

          expect(await helpers.findAndGetText(driver, css.vmtImport.selectedRoomsDisplay)).to.eql('No Rooms');

          //deselect
          await helpers.findAndClickElement(driver, sel);
          await helpers.waitForRemoval(driver, css.sweetAlert.container);

        });
      });

      describe('should return both own and public rooms', function() {
        let info = {
          query: 'room',
          numRooms: 7,
          numActivities: 0,
        };
        before(async function() {
          await helpers.clearElement(driver, searchInput);
          await helpers.findInputAndType(driver, searchInput, info.query);

          await helpers.waitForSelector(driver, css.vmtImport.roomListItem);

        });

        it(`Should return ${info.numRooms} rooms`, async function() {
          let roomResults = await helpers.getWebElements(driver, css.vmtImport.roomListItem);

          expect(roomResults).to.have.lengthOf(info.numRooms);
        });

        it(`Should return ${info.numActivities} activities`, async function() {
          let activityResults = await helpers.getWebElements(driver, css.vmtImport.activityListItem);

          expect(activityResults).to.have.lengthOf(info.numActivities);
        });

      });

      describe('Selecting 2 rooms ', function() {
        let { room1, room2 } = newWs;

        before(async function() {
          await helpers.clearElement(driver, searchInput);
          await helpers.findInputAndType(driver, searchInput, room1.name);

          await helpers.findAndClickElement(driver, `input[value="${room1.id}"]`);

          await helpers.clearElement(driver, searchInput);
          await helpers.findAndClickElement(driver, searchInput, room2.name);
          await helpers.findAndClickElement(driver,`input[value="${room2.id}"]`);

        });

        it('Clicking next should move on to next step', async function() {
          await helpers.findAndClickElement(driver, css.vmtImport.next);
          expect(await helpers.isElementVisible(driver, css.vmtImport.wsOptions.container)).to.eql(true);
        });

        it('Should display 2 Selected Rooms', async function() {
          let els = await helpers.getWebElements(driver, css.vmtImport.selectedRoomsDisplay);
          let count = await els[0].getText();
          expect(count).to.eql('2');
        });
      });

      describe('Creating Workspace', function() {
        let sels = css.vmtImport.wsOptions;

        it('Clicking yes radio btn should bring up workspace settings menu', async function() {
          await helpers.findAndClickElement(driver, sels.createWsRadio);
          expect(await helpers.isElementVisible(driver, sels.wsSettings.container)).to.eql(true);
        });

        it('clicking no should hide the menu', async function() {
          await helpers.findAndClickElement(driver, sels.doNotCreateWsRadio);
          await helpers.waitForRemoval(driver, sels.wsSettings.container);
          expect(await helpers.isElementVisible(driver, sels.wsSettings.container)).to.eql(false);
        });

        describe('Clicking next without filling in all required fields', function() {
          before(async function() {
            await helpers.findAndClickElement(driver, sels.createWsRadio);
            await helpers.waitForSelector(driver, sels.wsSettings.container);
          });

          it('Should display error messages', async function() {
            let numErrors = 2;
            await helpers.findAndClickElement(driver, css.vmtImport.next);
            let errorBoxes = await helpers.waitForNElements(driver, css.general.errorBox, numErrors);
            expect(errorBoxes).to.have.lengthOf(numErrors);
          });
        });

        describe('Filling in ws details and proceeding', function() {
        let sels = css.vmtImport.wsOptions.wsSettings;

          let { name, owner, folderSet } = newWs;
          before(async function() {
            await helpers.findInputAndType(driver, sels.nameInput, name);

            // owner
            await helpers.findInputAndType(driver, sels.ownerInput, owner.username, true);

            // folder set
            await helpers.findInputAndType(driver, sels.folderSetInput, folderSet, true);

          });
          it('Should proceed to review step', async function() {
            await helpers.findAndClickElement(driver, css.vmtImport.next);
            await helpers.waitForSelector(driver, css.vmtImport.reviewStep.container);
            expect(await helpers.isElementVisible(driver, css.vmtImport.reviewStep.container)).to.eql(true);
          });

          // TODO: test that review summary details are accurate
        });
        // TODO: test going back between steps and making sure the progress is preserved
        describe('Clicking Create', function() {
          before(async function() {
            await helpers.findAndClickElement(driver, css.vmtImport.reviewStep.create);
            await helpers.waitForSelector(driver, css.workspace.name);
          });

          it('Should successfully create and redirect to new workspace', async function() {
            let wsName = await helpers.getWebElements(driver, css.workspace.name);
            expect(await wsName[0].getText()).to.equal(newWs.name);
          });

          it(`Should have ${newWs.submissionsCount} submissions`, async function() {
            expect(await helpers.findAndGetText(driver, css.workspace.submissionNav.count)).to.eql(newWs.submissionsCount.toString());
          });
        });

        xdescribe('Associated Problem', function() {
          
        });

      });
    });

  });
});
