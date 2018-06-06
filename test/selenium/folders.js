const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const _ = require('underscore');
const helpers = require('./helpers');

const host = 'http://localhost:8080';
const user = 'casper';

describe('Folders', function() {
  this.timeout('10s');
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
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
      try {
        await driver.get(`${host}//#/workspaces/53e36522b48b12793f000d3b/folders/53e36cdbb48b12793f000d43`);
      await driver.wait(until.elementLocated(By.css('table#folder_contents')), 3000);
      await driver.sleep(3000);
      }catch(err) {
        console.log(err);
      }
    });

    it('should display the folder name', async function() {
      let name; 
      try {
        let header = await driver.findElements(By.css('div#menubar>h1'));
        if (!_.isEmpty(header)) {
          name = header[0].getText();
        }
      }catch(err) {
        console.log(err);
      }
      expect(name).to.eql('Improve');
    });

    it('should announce that it has a bunch of submissions and selections', async function() {
      let text;
      try {
        let statusBar = await driver.findElements(By.css('div#statusbar'));
        if (!_.isEmpty(statusBar)) {
          text = await statusBar[0].getText();
        }
      }catch(err) {
        console.log(err);
      }
      expect(text).to.contain('9 submission(s)');
      expect(text).to.contain('0 selection(s)');
    });

    it('should display view controls', async function() {
      let isViewControls;
      let isSubControls;
      let browserInputs;
      let isShowEvidence;
      let isShowComments;
      let isShowFolders;
      
      try {
      isViewControls = await helpers.isVisibleInDOM(driver, '#controls');
      isSubControls = await helpers.isVisibleInDOM(driver, '#subcontrols');
      browserInputs = await helpers.getWebElements(driver, 'input[name="browser2"]');
      isShowEvidence = await helpers.isVisibleInDOM(driver, '#showEvidence');
      isShowComments = await helpers.isVisibleInDOM(driver, '#showSubmComments');
      isShowFolders = await helpers.isVisibleInDOM(driver, '#showSubmFolders');
      }catch(err) {
        console.log(err);
      }
      expect(isViewControls).to.eql(true);
      expect(isSubControls).to.eql(true);
      expect(browserInputs.length).to.eql(2);
      expect(isShowComments).to.eql(true);
      expect(isShowEvidence).to.eql(true);
      expect(isShowFolders).to.eql(true);
    });
  
    xit('should have default view options selected', function() {
      'label#browseByStudent>input'.should.have.attribute('checked').and.contain('checked');
      'label#showSubFolders>input'.should.have.attribute('checked').and.contain('checked');
      'label#showEvidence>input'.should.have.attribute('checked').and.contain('checked');
      'label#showSubmFolders>input'.should.have.attribute('checked').and.contain('checked');
    });

    xit('should display a table of submission/selection data', function() {
      'table#folder_contents'.should.be.inDOM;
      "$('table#folder_contents>tbody>tr').length".should.evaluate.to.be.at.least('13');
      'table#folder_contents>tbody'.should.contain.text('Quotable!');
      //'table#folder_contents>tbody'.should.contain.text('Gabriella');
      'table#folder_contents>tbody'.should.contain.text("If it was a negative it wouldn't work.");
    });
  });
});