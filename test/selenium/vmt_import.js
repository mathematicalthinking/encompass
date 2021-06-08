// 1) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     searching for nonexistant room name should yield no results:
// TimeoutError: Waiting for element to be located By(css selector, .vmt-room-list)
// Wait timed out after 8157ms
// at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 2) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     should return both own and public rooms
//       "before all" hook for "Should return 7 rooms":
// TimeoutError: Waiting for element to be located By(css selector, .vmt-room-list-item)
// Wait timed out after 8140ms
// at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 3) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     Selecting 2 rooms 
//       Clicking next should move on to next step:

// AssertionError: expected false to deeply equal true
// + expected - actual

// -false
// +true

// at Context.<anonymous> (test/selenium/vmt_import.js:177:96)
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 4) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     Selecting 2 rooms 
//       Should display 2 Selected Rooms:

// AssertionError: expected 'No Rooms' to deeply equal '2'
// + expected - actual

// -No Rooms
// +2

// at Context.<anonymous> (test/selenium/vmt_import.js:183:28)
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 5) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     Creating Workspace
//       Clicking yes radio btn should bring up workspace settings menu:

// AssertionError: expected false to deeply equal true
// + expected - actual

// -false
// +true

// at Context.<anonymous> (test/selenium/vmt_import.js:192:88)
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 6) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     Creating Workspace
//       Clicking next without filling in all required fields
//         "before all" hook for "Should display error messages":
// TimeoutError: Waiting for element to be located By(css selector, .create-ws-content)
// Wait timed out after 8189ms
// at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 7) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     Creating Workspace
//       Filling in ws details and proceeding
//         Should proceed to review step:
// TimeoutError: Waiting for element to be located By(css selector, #vmt-import-step4)
// Wait timed out after 8158ms
// at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// 8) Importing VMT Work
// Visiting VMT Import Page
//   Searching for Rooms / Activities
//     Creating Workspace
//       Clicking Create
//         "before all" hook for "Should successfully create and redirect to new workspace":
// TimeoutError: Waiting for element to be located By(css selector, .ws-meta .workspace-name)
// Wait timed out after 8180ms
// at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

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

describe('Importing VMT Work', function() {

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
    driver.quit();
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

      it('searching for nonexistant room name should yield no results', async function() {
        await helpers.findInputAndType(driver, searchInput, 'bogusname');
        console.log('ater type');
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
          let problemLink;
        });

      });
    });

  });
});
