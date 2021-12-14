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
      let form = await helpers.getWebElements(driver, '#assignment-new');
      expect(form).to.have.lengthOf(1);
    });
    for (let selector of assnSels.formInputs) {
      it(`should display selector with id ${selector}`, async function () {
        let input = await helpers.getWebElements(driver, selector);
        expect(input[0]).to.exist;
      });
    }
  });
  describe('Setting up a new assignment', function () {
    it('should display validation errors when submitting an empty form', async function () {
      await helpers.findAndClickElement(driver, 'button');
      expect(await helpers.isTextInDom(driver, "Section can't be blank")).to.be
        .true;
      expect(await helpers.isTextInDom(driver, "Problem can't be blank")).to.be
        .true;
    });
    it('should remove errors when section and problem added', async function () {
      await helpers.findAndClickElement(
        driver,
        '#assn-new-section-select-selectized'
      );
      await helpers.findAndClickElement(driver, '.option');
      await helpers.findInputAndType(
        driver,
        '#assn-new-problem-select-selectized',
        'prob',
        true
      );
      expect(await helpers.isTextInDom(driver, "Section can't be blank")).to.be
        .false;
      expect(await helpers.isTextInDom(driver, "Problem can't be blank")).to.be
        .false;
    });
    it('should display correct info in inputs', async function () {
      expect(await helpers.isTextInDom(driver, 'MTG Period 1'));
      expect(await helpers.isTextInDom(driver, 'Alphabet Problem'));
    });
    it('should show error for invalid date ranges', async function () {
      await helpers.findInputAndType(driver, '#assignedDate', '01062020');
      await helpers.findInputAndType(driver, '#dueDate', '01052020');
      await helpers.findAndClickElement(driver, 'button');
      expect(await helpers.isTextInDom(driver, 'Invalid Date Range')).to.be
        .true;
    });
    it('should remove error on date change', async function () {
      await helpers.findInputAndType(driver, '#assignedDate', '01012020');
      expect(await helpers.isTextInDom(driver, 'Invalid Date Range')).to.be
        .false;
    });
    it('should show linked workspaces menu when clicking "yes"', async function () {
      await helpers.findAndClickElement(
        driver,
        '.linked-ws .radio-group input[value="true"]'
      );
      expect(await helpers.isTextInDom(driver, 'Workspace Name Format')).to.be
        .true;
    });
    it('should display three options', async function () {
      expect(await helpers.isTextInDom(driver, 'By Group')).to.be.true;
      expect(await helpers.isTextInDom(driver, 'By Student')).to.be.true;
      expect(await helpers.isTextInDom(driver, 'Student and Group')).to.be.true;
    });
    it('should show parent workspace form when clicking "yes"', async function () {
      await helpers.findAndClickElement(
        driver,
        '.parent-ws .radio-group input[value="true"]'
      );
      expect(await helpers.isTextInDom(driver, 'Share')).to.be.true;
    });
  });
  describe('Creating an assignment', async function () {
    it('should create a new assignment and display assignment info', async function () {
      await helpers.findAndClickElement(driver, 'button[data-test="create"]');
      await helpers.waitForSelector(driver, '#assignment-info-teacher');
    });
    it('should display correct title', async function () {
      expect(
        await helpers.isTextInDom(driver, 'Alphabetical Problem / Jan 1st 2020')
      ).to.be.true;
    });
    it('should display 4 linked workspaces', async function () {
      const linkedWsList = await helpers.getWebElements(
        driver,
        '.linked-ws-link'
      );
      expect(linkedWsList).to.have.lengthOf(4);
    });
    it('should display 1 parent workspace', async function () {
      expect(
        await helpers.getWebElements(driver, '.parent-ws-link')
      ).to.have.lengthOf(1);
    });
  });
});
