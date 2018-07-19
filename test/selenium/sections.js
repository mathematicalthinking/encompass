// REQUIRE MODULES
const {Builder, By, Key, until} = require('selenium-webdriver')
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');
const host = helpers.host;

describe('Sections', function()  {
  this.timeout('10s');
  let driver = null;
  const sectionId = '5b4e5492a6aa6528b09753d4';
  const sectionLink = `a[href='#/sections/${sectionId}`;

  //may not be necessary
  const sectionDetails = {
    name: "guna",
    teachers: 'rick'
  };

    before(async function () {
        driver = new Builder()
        .forBrowser('chrome')
        .build();
        await dbSetup.prepTestDb();
        try {
          await helpers.login(driver, host);
        }catch(err) {
          console.log(err);
        }
      });
    after(() => {
        driver.quit();
    });

    describe('Visiting sections page', function() {
        before(async function() {
          await helpers.findAndClickElement(driver, css.topBar.sections);
        });
        it('should display a user\'s sections', async function() {
          let sections = await helpers.getWebElements(driver, 'ul.your-sections > li');
          expect(sections).to.have.lengthOf(2);   //lengthOf(HOW MANY?)//
          expect(await helpers.isElementVisible(driver, sectionLink)).to.be.true;
        });
      });

      describe(`Visiting ${sectionDetails.name}`, function() {
        before(async function() {
          await helpers.findAndClickElement(driver, sectionLink);
        });
        it('should display the section details', async function() {
          expect(await helpers.isTextInDom(driver, sectionDetails.name)).to.be.true;
          expect(await helpers.isTextInDom(driver, sectionDetails.teachers)).to.be.true;
        });
      });

      describe('Verify form inputs', async function() {
        await verifyForm();
      });

      describe('Create section', function() {
        const inputs = css.newSection.inputs;
        const section = helpers.newSection;

        const createSection = async function(details, isPublic) {
          for (let detail of Object.keys(details)) {
            try {
              await helpers.findInputAndType(driver, inputs[detail], details[detail]);
            }catch(err) {
              console.log(err);
            }
          }
          await helpers.findAndClickElement(driver, css.newSection.create);
        };

        it('should have a list of sections', async function() {
          expect(await helpers.getWebElements(driver, `a.${sectionId}`)).to.have.lengthOf.at.least(3);
        });

        it ('should display success message after creating', async function() {
          await submitSection(section.details, true);
          await driver.sleep(1000);
          expect(await helpers.isTextInDom(driver, `Successfully created section`)).to.be.true;
        });

        it('should display link to newly created section', async function() {
          await helpers.waitForSelector(driver, 'a.section-new');
          expect(await helpers.findAndGetText(driver, 'a.section-new')).to.eql(section.details.name);
        });

        it('should display newly created section details after clicking link', async function() {
          await helpers.findAndClickElement(driver, 'a.section-new');
          expect(await helpers.isTextInDom(driver, section.details.name)).to.be.true;
          expect(await helpers.isTextInDom(driver, section.details.teachers)).to.be.true;
        });
      }
}