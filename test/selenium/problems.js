// REQUIRE MODULES
const { Builder, By, Key, until } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const config = require('../../server/config');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

describe('Problems', function() {
  this.timeout('10s');
  let driver = null;
  const problemId = '5b1e7a0ba5d2157ef4c91028';
  const problemLink = `a[href='#/problems/${problemId}`;
  const problemDetails = {
    name: 'Mr. W. Goes Across Australia',
    question: '',
    isPublic: 'false',
    creationDate: 'Mon Jul 02 2018 11:12:25 GMT-0400 (Eastern Daylight Time)'
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
  describe('Visiting problems page', function() {
    //const problemId = '5b1e7a0ba5d2157ef4c91028';
    //const problemLink = `a[href='#/problems/${problemId}`;
    before(async function() {
      await helpers.findAndClickElement(driver, css.topBar.problems);
    });
    it('should display a user\'s problems', async function() {
      let problems = await helpers.getWebElements(driver, 'ul.listing > li');
      expect(problems).to.have.lengthOf(1);
      expect(await helpers.isElementVisible(driver, problemLink)).to.be.true;
    });
  });

  describe('Visiting Mr. W. Goes Across Australia', function() {

    before(async function() {
      await helpers.findAndClickElement(driver, problemLink);
    });

    it('should display the problem details', async function() {
      expect(await helpers.isTextInDom(driver, problemDetails.name)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.isPublic)).to.be.true;
      expect(await helpers.isTextInDom(driver, problemDetails.creationDate)).to.be.true;
    });
  });
});