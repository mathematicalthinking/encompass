const { Builder } = require('selenium-webdriver');
const { expect } = require('chai');
const _ = require('underscore');

const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const SwalDriver = require('./utilities/sweet_alert');
const { assignmentsTeacher: assnSels } = css;
const { cancelAssignment: cancelAssn, editAssignment: editAssn } = assnSels;
const host = helpers.host;

const fixtures = require('./fixtures/assignments_teacher');

let teacherInfo = {
  username: 'mtgteacher',
  password: 'test',
  _id: '5c6eb45d9852e5710311d633',
  name: 'Alex Smith',
};

let assignmentInfo = {
  _id: '5c6eb5199852e5710311d638',
  name: 'MTG Period 1 SCR',
  problemName: 'Seven Congruent Rectangles',
  className: 'MTG Period! SCR',
};

describe('Creating a new Assignment', function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  let swalDriver;
  before(async function () {
    driver = new Builder().forBrowser('chrome').build();
    await dbSetup.prepTestDb();
    swalDriver = new SwalDriver(driver);
    try {
      await helpers.login(driver, host, teacherInfo);
    } catch (err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });
  describe('Navigating to new assignment page', function () {
    let url = `${host}/assignments/new`;
    before(async function () {
      await helpers.navigateAndWait(driver, url, { selector: 'div' });
    });
    it('should display Create Assignment Form', async function () {
      let title = await helpers.getWebElements(driver, '#assignmentnewheader');
      expect(title[0]).to.exist;
    });
  });
});
