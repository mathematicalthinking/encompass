// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');

const host = helpers.host;

describe('Folders', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;

  let user = helpers.admin;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
      await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, user);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });
  describe('Visiting a ESI 2014 Wednesday Reflection', function() {
    before(async function() {
      let options = {
        selector: 'table#folder_contents'
      };

      await helpers.navigateAndWait(driver, `${host}/workspaces/53e36522b48b12793f000d3b/folders/53e36cdbb48b12793f000d43`, options);
    });

    it('should display the folder name', async function() {
      expect(await helpers.findAndGetText(driver, 'div#menubar>h1')).to.eql('Improve');
    });

    it('should announce that it has a bunch of submissions and selections', async function() {
      let text = await helpers.findAndGetText(driver, 'div#statusbar');
      expect(text).to.contain('6 submission(s)');
      expect(text).to.contain('9 selection(s)');
     });

    it('should display view controls', async function() {
      expect(await helpers.isElementVisible(driver, '#controls')).to.eql(true);
      expect(await helpers.isElementVisible(driver, '#subcontrols')).to.eql(true);
      expect(await helpers.getWebElements(driver, 'input[name="browser2"]')).to.have.lengthOf(2);
      expect(await helpers.isElementVisible(driver, 'label#showEvidence>input')).to.eql(true);
      // expect(await helpers.isElementVisible(driver, 'label#showSubmComments>input')).to.eql(true);
      expect(await helpers.isElementVisible(driver, 'label#showSubFolders>input')).to.eql(true);
      // expect(await helpers.isElementVisible(driver, 'label#showSubmFolders>input')).to.eql(true);
    });

    it('should have default view options selected', async function() {
      // Should discuss which view options we want pre-selected
      // currently should only be showing label#showSubFolders>input
      let isShowSubFoldersChecked;
      let isShowSubmFoldersChecked;
      try {
        let showSubFolders = await helpers.getWebElements(driver, 'label#showSubFolders>input');
        if (!_.isEmpty(showSubFolders)) {
          let checked = await showSubFolders[0].getAttribute('checked');
          isShowSubFoldersChecked = checked === 'true';
        } else {
          isShowSubFoldersChecked = false;
        }
        let showSubmFolders = await helpers.getWebElements(driver, 'label#showSubmFolders>input');
        if(!_.isEmpty(showSubmFolders)) {
          let checked = await showSubFolders[0].getAttribute('checked');
          isShowSubmFoldersChecked = checked === 'true';
        } else {
          isShowSubmFoldersChecked = false;
        }
      }catch(err) {
        console.log(err);
      }

      expect(isShowSubFoldersChecked).to.eql(true);
      expect(isShowSubmFoldersChecked).to.eql(false);

      // TODO?: Currently these inputs do not have ids
      // 'label#browseByStudent>input'.should.have.attribute('checked').and.contain('checked');
      //'label#showEvidence>input'.should.have.attribute('checked').and.contain('checked');

    });

    it('should display a table of submission/selection data', async function() {
      let isTableVisible;
      let tableLength;

      try{
        isTableVisible = await helpers.isElementVisible(driver, 'table#folder_contents');
        let tableRows = await helpers.getWebElements(driver, 'table#folder_contents>tbody>tr');
        tableLength = tableRows.length;
      }catch(err) {
        console.log(err);
      }

      expect(isTableVisible).to.eql(true);
      expect(tableLength).to.be.above(7);

      // Would these tests actually be useful?

      // 'table#folder_contents>tbody'.should.contain.text('Improve');
      // //'table#folder_contents>tbody'.should.contain.text('Peg C.');
      // 'table#folder_contents>tbody'.should.contain.text("think with Steve about the triangle problem");
    });
  });
});
