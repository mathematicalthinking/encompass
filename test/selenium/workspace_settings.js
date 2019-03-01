// REQUIRE MODULES
const {Builder, By, Key} = require('selenium-webdriver');
const expect = require('chai').expect;
const moment = require('moment');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

let owner = {
  username: 'mtgstudent1',
  password: 'test',
  _id: '5c6eb49c9852e5710311d634',
  name: 'Kerry Davis',
};

let workspaceInfo = {
  _id: "5c6ec5eba89be9751158ce06",
  name: 'mtgstudent 1 - MTG Congruent Rectangle',
  problem: 'Seven Congruent Rectangles',
  owner: 'mtgstudent1',
  privacySetting: 'private',
  linkedAssignment: 'N/A',
  allowAutoUpdates: 'Yes',
};

let assignmentToLink = {
  id: '5c6eb5199852e5710311d638',
  name: 'MTG Period 1 SCR'
};

let wsInfoUrl = `${host}/#/workspaces/${workspaceInfo._id}/info`;

describe('Workspace info / settings interactions', function() {
  let selectors = css.wsInfo;

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
    driver.quit();
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

  describe('Navigating to workspace info page', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, wsInfoUrl, selectors.container);
    });

    it('should show workspace settings container', async function() {
      expect(await helpers.isElementVisible(driver, selectors.settings.container)).to.eql(true);
    });

    it('should show workspace collabs container', async function() {
      expect(await helpers.isElementVisible(driver, selectors.collabs.container)).to.eql(true);
    });

    it('should show workspace stats container', async function() {
      expect(await helpers.isElementVisible(driver, selectors.stats.container)).to.eql(true);
    });
  });

  describe('Changing workspace name', function() {
    let newText = 'revised';
    let newName = workspaceInfo.name + newText;
    before(async function() {
      await openEditMenu();
      await helpers.findInputAndType(driver, selectors.settings.editName, newText);
      await saveSettings();
    });

    it('should display success toast message', async function() {
      expect(await helpers.isTextInDom(driver, selectors.settings.updateSuccessText)).to.eql(true);
    });

    it('should display new name', async function() {
      expect(await helpers.findAndGetText(driver, selectors.settings.nameText)).to.eql(newName);
    });

    it('should display new name after page refresh', async function() {
      await helpers.navigateAndWait(driver, wsInfoUrl, selectors.settings.container);
      expect(await helpers.findAndGetText(driver, selectors.settings.nameText)).to.eql(newName);
    });
  });

  describe('Toggling allow automatic updates', function() {
    describe('Toggling from yes to no', function() {
      before(async function() {
        await openEditMenu();
        await helpers.selectOption(driver, selectors.settings.autoUpdateSelect, 'No', true);

        await saveSettings();
      });

      it('should display success toast message', async function() {
        expect(await helpers.isTextInDom(driver, selectors.settings.updateSuccessText)).to.eql(true);
      });

      it('should display No for automatic updates', async function() {
         expect(await helpers.findAndGetText(driver, selectors.settings.autoUpdateText)).to.eql('No');
      });

      it('should display no after page refresh', async function() {
        await helpers.navigateAndWait(driver, wsInfoUrl, selectors.settings.container);
        expect(await helpers.findAndGetText(driver, selectors.settings.autoUpdateText)).to.eql('No');
      });
    });

    describe('Toggling from no to yes', function() {
      before(async function() {
        await openEditMenu();
        await helpers.selectOption(driver, selectors.settings.autoUpdateSelect, 'Yes', true);

        await saveSettings();
      });

      it('should display success toast message', async function() {
        expect(await helpers.isTextInDom(driver, selectors.settings.updateSuccessText)).to.eql(true);
      });

      it('should display No for automatic updates', async function() {
         expect(await helpers.findAndGetText(driver, selectors.settings.autoUpdateText)).to.eql('Yes');
      });

      it('should display no after page refresh', async function() {
        await helpers.navigateAndWait(driver, wsInfoUrl, selectors.settings.container);
        expect(await helpers.findAndGetText(driver, selectors.settings.autoUpdateText)).to.eql('Yes');
      });
    });
  });

  describe('Setting Linked Assignment', function() {
    before(async function() {
      await openEditMenu();
      let input = await helpers.getWebElements(driver, selectors.settings.linkedAssnInput);
      await input[0].sendKeys('MTG');
      await driver.sleep(1000);
      let active = await helpers.waitForAndClickElement(driver, 'div.option.active');

      expect(await helpers.findAndGetText(driver, selectors.settings.linkedAssnText)).to.contain(assignmentToLink.name);
      await saveSettings();
    });

    it('should display success toast message', async function() {
      expect(await helpers.isTextInDom(driver, selectors.settings.updateSuccessText)).to.eql(true);
    });

    it('should display Linked Assignment name ', async function() {
      expect(await helpers.findAndGetText(driver, selectors.settings.linkedAssnText)).to.contain(assignmentToLink.name);

    });

    it('should display no after page refresh', async function() {
      await helpers.navigateAndWait(driver, wsInfoUrl, selectors.settings.container);
      expect(await helpers.findAndGetText(driver, selectors.settings.linkedAssnText)).to.contain(assignmentToLink.name);

    });
  });

  describe('Adding / removing collaborators', function() {
    before(async function() {

    });
  });

});