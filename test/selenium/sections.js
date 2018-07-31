// REQUIRE MODULES
const {Builder} = require('selenium-webdriver');
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const host = helpers.host;

describe('Sections', function () {
  this.timeout('10s');
  let driver = null;
  const sectionId = '5b1e7b2aa5d2157ef4c91108';
  const sectionLink = `a[href='#/sections/${sectionId}`;

  const sectionDetails = {
    name: "Drexel University",
    teachers: 'drex'
  }

  before(async function () {
    driver = new Builder()
        .forBrowser('chrome')
        .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host);
    } catch (err) {
      console.log(err);
    }
  });
  after(() => {
    driver.quit();
  });

  describe('Visiting sections page', function () {
    before(async function () {
      await helpers.findAndClickElement(driver, css.topBar.sections);
    });
    it('should display list of sections', async function () {
      expect(await helpers.getWebElements(driver, 'ul.your-sections')).to.have.lengthOf.at.least(1);
    });
  });

  describe(`Visiting ${sectionDetails.name}`, function () {
    before(async function () {
      await helpers.findAndClickElement(driver, sectionLink);
    });
    it('should display the section details', async function () {
      expect(await helpers.isTextInDom(driver, sectionDetails.name)).to.be.true;
      expect(await helpers.isTextInDom(driver, sectionDetails.teachers)).to.be.true;
    });
  });

  describe('Create section', function () {
    const verifyForm = async function () {
      const inputs = css.newSection.inputs;

      //testing for inputs
      for (let input of Object.keys(inputs)) {
        it(`${input} field should be visible`, async function() {
          expect(await helpers.isElementVisible(driver, inputs[input])).to.be.true;
        });
      }
    }

    before(async function() {
      await helpers.findAndClickElement(driver, css.topBar.sections);
      await helpers.findAndClickElement(driver, '#newsection');
      await helpers.waitForSelector(driver, css.newSection.form);
     });

    describe('Verify form inputs', async function () {
      await verifyForm();
    });

    describe('Creating section', function() {
      const inputs = css.newSection.inputs;
      const section = helpers.newSection;

      const submitSection = async function(details) {
        for (let detail of Object.keys(details)) {
          try {
            await helpers.findInputAndType(driver, inputs[detail], details[detail]);
          }catch(err) {
            console.log(err);
          }
        }
        await helpers.findAndClickElement(driver, css.newSection.create);
      };

    it('should redirect to section-info page after creating', async function () {
      const section = helpers.newSection
      await submitSection(section.details, true);
      await helpers.waitForSelector(driver, '#editSection');
      expect(await helpers.isTextInDom(driver, section.details.name)).to.be.true;
      expect(await helpers.getCurrentUrl(driver)).to.match(/sections\/\w/);
      expect(await helpers.isTextInDom(driver, section.details.teachers)).to.be.true;
    });
  });
});

    // DROPDOWN MENU TO SELECT ORGANIZATION
    // describe('should display organization options', function() {
    //   it('should display organization dropdown menu', async function() {
    //     expect(await helpers.isElementVisible(driver, 'section.org.options select')).to.be.true;
    //   });
    //   it('organization dropdown menu should have at least three option', async function() {
    //     expect(await helpers.getWebElements(driver, 'section.org.options select>option')).to.have.lengthOf.at.least(3);
    //   });
    //   it('pick one organization from dropdwon menu', async function(){
    //     expect(await helpers.findAndClickElement(driver, 'section.org.options select > option:first-child'));
    //   });
 });