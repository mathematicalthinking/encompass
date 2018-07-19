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

  const name = '5b4e25c638a46a41edf1709a';
  const problemLink = `a[href='#/problems/${problemId}`;

  const sectionDetails = {
    name: "gena",
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
}