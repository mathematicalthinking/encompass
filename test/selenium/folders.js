const config = require('../../server/config');
const nconf = config.nconf;
const port = nconf.get('testPort');

const {Builder, By, Key, until} = require('selenium-webdriver')
const expect = require('chai').expect;
const _ = require('underscore');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');

const host = `http://localhost:${port}`
const user = 'steve';

describe('Folders', function() {
  this.timeout('10s');
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await driver.get(`${host}/devonly/fakelogin/${user}`);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    driver.quit();
  });
  describe('Visiting a ESI 2014 Wednesday Reflection', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, `${host}//#/workspaces/53e36522b48b12793f000d3b/folders/53e36cdbb48b12793f000d43`, 'table#folder_contents');
    });

    it('should display the folder name', async function() {
      let name;
      expect(await helpers.findAndGetText(driver, 'div#menubar>h1')).to.eql('Improve');
    });

    it('should announce that it has a bunch of submissions and selections', async function() {
      let text = await helpers.findAndGetText(driver, 'div#statusbar');
      expect(text).to.contain('9 submission(s)');
      expect(text).to.contain('0 selection(s)');
     });

    it('should display view controls', async function() {
      expect(await helpers.isElementVisible(driver, '#controls')).to.eql(true);
      expect(await helpers.isElementVisible(driver, '#subcontrols')).to.eql(true);
      expect(await helpers.getWebElements(driver, 'input[name="browser2"]')).to.have.lengthOf(2);
      expect(await helpers.isElementVisible(driver, 'label#showEvidence>input')).to.eql(true);
      expect(await helpers.isElementVisible(driver, 'label#showSubmComments>input')).to.eql(true);
      expect(await helpers.isElementVisible(driver, 'label#showSubFolders>input')).to.eql(true);
      expect(await helpers.isElementVisible(driver, 'label#showSubmFolders>input')).to.eql(true);
    });

    it('should have default view options selected', async function() {
      // Should discuss which view options we want pre-selected
      let isShowSubFoldersChecked;
      let isShowSubmFoldersChecked;
      try {
        let showSubFolders = await helpers.getWebElements(driver, 'label#showSubFolders>input');
        if (!_.isEmpty(showSubFolders)) {
          isShowSubFoldersChecked = await showSubFolders[0].getAttribute('checked');
        }
        let showSubmFolders = await helpers.getWebElements(driver, 'label#showSubmFolders>input');
        if(!_.isEmpty(showSubmFolders)) {
          isShowSubmFoldersChecked = await showSubFolders[0].getAttribute('checked');
        }
      }catch(err) {
        console.log(err);
      }

      expect(isShowSubFoldersChecked).to.eql('true');
      expect(isShowSubmFoldersChecked).to.eql('true');

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
