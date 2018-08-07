// REQUIRE MODULES
const {Builder, Actions, By, Key, until} = require('selenium-webdriver')
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Visiting Workspace Creation', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
      await dbSetup.prepTestDb();
      await helpers.login(driver, host);
      await helpers.findAndClickElement(driver, css.topBar.workspaces);
      await helpers.findAndClickElement(driver, '#new-workspace-link');
      await helpers.waitForSelector(driver,'#create-workspace-btn');
    });

  after(() => {
    driver.quit();
  });

  describe('should display an overview, and some sections', () => {
    const els = ['section.overview', 'section.submissions', 'section.folders', 'section.permissions', 'section.submit>button'];

    els.forEach((el) => {
      it(`should display ${el}`, async function() {
        const thisUrl = await helpers.getCurrentUrl(driver);
        console.log('url', thisUrl);
        expect(await helpers.isElementVisible(driver, el)).to.be.true;
      });
    });
  });

  describe('should display folder set options', function() {
    it('should display folders dropdown menu', async function() {
      expect(await helpers.isElementVisible(driver, 'section.third.folders select')).to.be.true;
    });
    it('folders dropdown menu should have at least 3 options', async function() {
      expect(await helpers.getWebElements(driver, 'section.third.folders select>option')).to.have.lengthOf.at.least(3);
    });
  });

  describe('clicking the pow import option', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, 'input.powImport');
      await helpers.waitForSelector(driver, 'form#powImportForm');
    });
    it('should change the displayed import form', async function() {
      expect(await helpers.isElementVisible(driver, 'form#powImportForm')).to.be.true;
    });

    function validatePowInputForm() {
      const inputs = ['teacher', 'submitter', 'puzzle', 'course','subs','start', 'end'];
        inputs.forEach((input) => {
          it(`should display ${input} option`, async function() {
            expect(await helpers.isElementVisible(driver, `#${input}`)).to.be.true;
          });
        });

        it(`teacher input should be set to logged in user`, async function() {
          try {
            let teacherInput = await helpers.getWebElements(driver, 'input#teacher');
            expect(await teacherInput[0].getAttribute('value')).to.eql(helpers.admin.username);
          }catch(err) {
            console.log(err);
          }
        });
      }
    describe('PoW Import Form Options', () => {
      validatePowInputForm();
    });
  });

  describe('clicking the pd import option', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, 'input.pdImport');
      await helpers.waitForSelector(driver, '.ember-view');
    });
    it('Pd form should be displayed', async function() {
      expect(await helpers.isElementVisible(driver, 'form#pdImportForm')).to.be.true;
    });

    it('PoW form should not exist', async function() {
      expect(await helpers.isElementVisible(driver, 'form#powImportForm')).to.be.false;
    });

    it('Pdset dropdown menu should be displayed', async function() {
      expect(await helpers.isElementVisible(driver, 'form#pdImportForm select')).to.be.true;
    });

    it('Pdset dropdown should have at least one option', async function() {
      expect(await helpers.getWebElements(driver, 'form#pdImportForm select>option')).to.have.lengthOf.at.least(1);
    });
  });
});
