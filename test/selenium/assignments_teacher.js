// REQUIRE MODULES
const { Builder, } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

let teacherInfo = {
  username: 'mtgteacher',
  password: 'test',
  _id: "5c6eb45d9852e5710311d633",
  name: 'Alex Smith',
};

let assignmentInfo = {
  _id: "5c6eb5199852e5710311d638",
  name: 'MTG Period 1 SCR',
  problemName: 'Seven Congruent Rectangles',
  className: 'MTG Period! SCR',
};

describe('Assignment Info as Teacher', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, teacherInfo);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    driver.quit();
  });

  // TODO more robust testing

  describe('Navigating to assignment info', function() {
    let assignmentId = assignmentInfo._id;
    let url = `${host}/#/assignments/${assignmentId}`;
    before(async function() {
      await helpers.navigateAndWait(driver, url, css.assignmentsTeacher.editAssignment);
    });

    it('should display Edit Assignment Button', async function() {
      let btn = await helpers.getWebElements(driver, css.assignmentsTeacher.editAssignment);
      expect(btn[0]).to.exist;

    });

    it('should display trashcan button/icon after clicking edit', async function() {

      await helpers.findAndClickElement(driver, css.assignmentsTeacher.editAssignment);
      await helpers.waitForSelector(driver, css.assignmentsTeacher.trashBtn);

      expect(await helpers.isElementVisible(driver, css.assignmentsTeacher.trashBtn)).to.eql(true);

    });

    it('confirm modal should be displayed after clicking trash icon', async function() {
      let confirmTrash = css.assignmentsTeacher.confirmTrash;
      await helpers.findAndClickElement(driver, css.assignmentsTeacher.trashBtn);
      await helpers.waitForSelector(driver, confirmTrash);
      expect(await helpers.isElementVisible(driver, confirmTrash)).to.eql(true);
    });

    it('clicking confirm delete should remove assignment from the list', async function() {
      await helpers.findAndClickElement(driver, css.assignmentsTeacher.confirmTrash);

      let linkSelector = `a[href="${url}"]`;
      await helpers.waitForRemoval(driver, linkSelector);
      await driver.sleep(5000);
      expect(await helpers.isElementVisible(driver, linkSelector)).to.eql(false);
    });
  });


});