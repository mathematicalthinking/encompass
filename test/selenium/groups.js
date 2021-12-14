const { Builder } = require('selenium-webdriver');
const { expect } = require('chai');
const { it, describe, before, after } = require('mocha');
const users = require('./fixtures/users');
const helpers = require('./helpers');
const dbSetup = require('../data/restore');

const host = helpers.host;

describe('Groups', function () {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function () {
    driver = new Builder().forBrowser('chrome').build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, users.teacherMT);
    } catch (err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });
  describe('Navigating to section', function () {
    let url = `${host}/sections/${users.teacherMT.sections.testExample._id}`;
    before(async function () {
      await helpers.navigateAndWait(driver, url, { selector: 'div' });
    });
    it('should display section info', async function () {
      let info = await helpers.getWebElements(driver, '#section-info');
      expect(info).to.exist;
    });
    it('should show 5 students', async function () {
      let studentList = await helpers.getWebElements(
        driver,
        '.students .listing li'
      );
      expect(studentList).to.have.length(5);
    });
  });
  describe('Creating a new group', async function () {
    it('should show group form', async function () {
      await helpers.findAndClickElement(driver, '.groups i');
      expect(await helpers.isElementVisible(driver, '.save-group')).to.be.true;
    });
    it('should show an error when submitting an empty form', async function () {
      await helpers.findAndClickElement(driver, '.save-group');
      expect(await helpers.isTextInDom(driver, 'Please complete all fields')).to
        .be.true;
    });
    it('should submit when group is created', async function () {
      await helpers.findInputAndType(driver, '.new-group-name', 'Group 1');
      await helpers.findAndClickElement(driver, '.group-options li');
      await helpers.findAndClickElement(driver, '.save-group');
      await driver.sleep(100);
      expect(await helpers.isTextInDom(driver, 'group "Group 1" created')).to.be
        .true;
    });
  });
  describe('Updating a group', async function () {
    it('should update group name', async function () {
      await helpers.findAndClickElement(driver, '.edit-group');
      await helpers.findInputAndType(driver, '.groups-item-input', 'Updated');
      await helpers.findAndClickElement(driver, '.edit-group');
      await driver.sleep(100);
      expect(await helpers.isTextInDom(driver, 'Updated Successfully')).to.be
        .true;
    });
  });
  describe('Closing the form', async function () {
    it('should close the form when clicking Done', async function () {
      await helpers.findAndClickElement(driver, '.cancel-button');
      expect(await helpers.isElementVisible(driver, '.save-group')).to.be.false;
    });
  });
});
