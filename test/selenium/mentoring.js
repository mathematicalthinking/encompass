// REQUIRE MODULES
const {Builder, By, until} = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;

let feedbackReceiver = {
  username: 'mtgstudent2',
  password: 'test',
  _id: "5c6eb4ac9852e5710311d635",
  name: 'Jamie Baker',
};

let workspaceInfo = {
  _id: "5c6ec5eba89be9751158ce06",
  name: 'mtgstudent 1 - MTG Congruent Rectangle',
  problem: 'Seven Congruent Rectangles',
  owner: 'mtgstudent1',
};

let mentorInfo = {
  displayName: 'Kerry Davis',
  username: 'mtgstudent1',
};

let responseInfo = {
  submission: {
    _id: '5c6ec5eba89be9751158ce08'
  },
  response: {
    _id: '5c6eca77a89be9751158ce0c',
  },
};

function checkSortBarDisplay(webDriver, hiddenSelectors=[]) {
  let defaults = Object.values(css.responsesList.sortBar);

  return Promise.all(defaults.map((sel) => {
    let shouldBeVisible = !hiddenSelectors.includes(sel);
    return helpers.isElementVisible(webDriver, sel)
      .then((isVisible) => {
        return expect(isVisible).to.eql(shouldBeVisible);
      });
  }));
}

function checkThreadValues(webDriver, values, excludedValues=[]) {
  let selectors = css.responsesList.threadItems;
  let valueKeys = Object.keys(values).filter((key) => {
    return !excludedValues.includes(key);
  });
  return Promise.all(valueKeys.map((key) => {
    let expectedText = values[key];
    let selector = selectors[key];
    return helpers.findAndGetText(webDriver, selector)
      .then((domText) => {
       return expect(domText).to.eql(expectedText);
      });
  }));
}

describe('Mentoring Interactions', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, feedbackReceiver);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    driver.quit();
  });

  describe('On Home page', function() {
    it('should have 1 visible response notification', async function() {
      expect(await helpers.findAndGetText(driver, css.topBar.responseNtf)).to.eql('1');
    });
  });

  describe('Visting Responses List', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, css.topBar.responses);
      await helpers.waitForUrlMatch(driver, /\/#\/responses/);
    });

    it('should display solver tab and display count', async function() {
      let submitterTabs = await helpers.getWebElements(driver, css.responsesList.submitterTab);

      expect(submitterTabs).to.have.lengthOf(1);
      expect(await submitterTabs[0].getText()).to.eql('Solver (1)');
    });

    it('should not display mentoring tab', async function() {
      expect(await helpers.isElementVisible(driver, css.responsesList.mentoringTab)).to.eql(false);
    });
    it('should not display approving tab', async function() {
      expect(await helpers.isElementVisible(driver, css.responsesList.approvingTab)).to.eql(false);
    });

    it('should have one response thread in list', async function() {
      let responseThreads = await helpers.getWebElements(driver, css.responsesList.responseThreads);
      expect(responseThreads).to.have.lengthOf(1);
    });

    it('should dispaly correct sort-bar items', async function() {
     await checkSortBarDisplay(driver, [css.responsesList.sortBar.student]);
    });

    it('should display correct information about thread', async function() {
      let values = {
        workspace: workspaceInfo.name,
        submissionDate: '02/21/2019',
        replyDate: '02/21/2019',
        mentors: mentorInfo.displayName,
        problem: workspaceInfo.problem
      };
      let excludedValues = ['statusText'];
      await checkThreadValues(driver, values,  excludedValues);
    });

    it('should indicate that thread has unread reply', async function() {
      let itemContainer = await helpers.getWebElements(driver, css.responsesList.threadItemContainer);
      expect(await itemContainer[0].getCssValue('font-weight')).to.eql(css.general.boldFontWeight);

      let statusCircle = await helpers.getWebElements(driver, css.responsesList.threadItems.statusCircle);
      expect(statusCircle).to.have.lengthOf(1);
      expect(await statusCircle[0].getCssValue('fill')).to.eql(css.general.unreadReplyFill);

      let ntfBell = await helpers.getWebElements(driver, css.responsesList.threadItems.ntfBell);
      expect(await ntfBell[0].getAttribute('title')).to.eql('1 New Notification');
    });

  });

  describe('Viewing response in paneled view', function() {
    before(async function() {
      await helpers.findAndClickElement(driver, css.responsesList.threadItemContainer);
      let subId = responseInfo.submission._id;
      let responseId = responseInfo.response._id;
      let expectedUrl = `/responses/submission/${subId}?responseId=${responseId}`;

      await driver.wait(until.urlContains(expectedUrl), 5000);
    });

    it('should display submission view', async function() {
      expect(await helpers.findAndGetText(driver, css.responseInfo.submissionView.studentIndicator)).to.eql(feedbackReceiver.username);
    });

    it('should display mentor reply view', async function() {
      expect(await helpers.findAndGetText(driver, css.responseInfo.mentorReplyView.recipient)).to.eql(feedbackReceiver.username);

      expect( await helpers.findAndGetText(driver, css.responseInfo.mentorReplyView.sender)).to.eql(mentorInfo.username);
    });
  });

});