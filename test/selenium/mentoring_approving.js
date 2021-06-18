// REQUIRE MODULES
const {Builder } = require('selenium-webdriver');
const expect = require('chai').expect;
const moment = require('moment');
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
  _id: "5c6ebc4a9852e5710311d641",
  name: 'MTG Congruent Rectangles',
  problem: 'Seven Congruent Rectangles',
  owner: 'mtgteacher',
};

let mentorInfo = {
  displayName: 'Pat Jones',
  username: 'mentort1',
  password: 'test',
};

let submissionInfo = {
   _id: '5c6ebc4a9852e5710311d63f',
   createDate: '2019-02-21 14:57:14.691Z',

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

describe('Mentoring / Approving Interactions', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, mentorInfo);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  // TODO add test to expect that going to workspaces should default to collab tab

  describe('Navigating to workspace submission', function() {
    let wsId = workspaceInfo._id;
    let subId = submissionInfo._id;
    let url = `${host}/#/workspaces/${wsId}/submissions/${subId}`;
    before(async function() {
      // await driver.get(url);
      await helpers.navigateAndWait(driver, url, {selector: css.workspace.newResponse});
    });

    it('should display Respond Button', async function() {
      let btn = await helpers.getWebElements(driver, css.workspace.newResponse);
      expect(btn[0]).to.exist;

      await btn[0].click();
      await helpers.waitForUrlMatch(driver, /responses\/new\/submission\/[0-9a-f]{24}/);
    });

     it('should display submission view', async function() {
        expect(await helpers.findAndGetText(driver, css.responseInfo.submissionView.studentIndicator)).to.eql(feedbackReceiver.username);
      });

      it('should display mentor reply view', async function() {
      expect(await helpers.findAndGetText(driver, css.responseInfo.mentorReplyView.recipient)).to.eql(feedbackReceiver.username);

      expect( await helpers.findAndGetText(driver, css.responseInfo.mentorReplyView.sender)).to.eql(mentorInfo.username);
    });

    it('should display proper buttons', async function() {
      let sendBtn = await helpers.getWebElements(driver, css.responseInfo.mentorReplyView.saveButton);

      expect(await sendBtn[0].getText()).to.eql('Submit for Approval');

      let saveDraftBtn = await helpers.getWebElements(driver,
      css.responseInfo.mentorReplyView.saveAsDraft);
      expect(await saveDraftBtn[0].getText()).to.eql('Save as Draft');

    });

    //TODO test saving as draft and checking if response item updated
  });

  describe('Submitting response for approval', function() {
    before(async function() {
      let sendBtn = await helpers.getWebElements(driver, css.responseInfo.mentorReplyView.saveButton);

      await sendBtn[0].click();
      await helpers.waitForUrlMatch(driver, /responses\/submission\/[0-9a-f]{24}\?responseId=[0-9a-f]{24}/);
    });
    it('should display new reply with pending approval status', async function() {
      let statusText = await helpers.getWebElements(driver, css.responseInfo.mentorReplyView.statusText);
      expect(await statusText[0].getText()).to.eql('Pending Approval');
    });

    // approver panel should display but be empty


  });

  describe('Visting Responses List', function() {
    before(async function() {
      await helpers.navigateAndWait(driver, `${host}/#/responses`, {selector: 'a'});
      await helpers.waitForSelector(driver, css.responsesList.mentoringTab);
    });

    it('should display mentoring tab and display count', async function() {
      let mentoringTabs = await helpers.getWebElements(driver, css.responsesList.mentoringTab);

      expect(mentoringTabs).to.have.lengthOf(1);
      expect(await mentoringTabs[0].getText()).to.eql('Mentoring');
    });

    it('should not display submitter tab', async function() {
      expect(await helpers.isElementVisible(driver, css.responsesList.submitterTab)).to.eql(false);
    });
    it('should not display approving tab', async function() {
      expect(await helpers.isElementVisible(driver, css.responsesList.approvingTab)).to.eql(false);
    });

    it('should have one response thread in list', async function() {
      let responseThreads = await helpers.getWebElements(driver, css.responsesList.responseThreads);
      expect(responseThreads).to.have.lengthOf(1);
    });

    it('should display correct sort-bar items', async function() {
     await checkSortBarDisplay(driver, [css.responsesList.sortBar.mentor]);
    });

    it('should display correct information about thread', async function() {
      let values = {
        workspace: workspaceInfo.name,
        submissionDate: moment(submissionInfo.createDate).fromNow(),
        replyDate: moment().fromNow(),
        problem: workspaceInfo.problem,
        student: feedbackReceiver.username,
      };
      let excludedValues = ['statusText'];
      await checkThreadValues(driver, values,  excludedValues);
    });

    it('should indicate that thread has pending reply', async function() {
      let itemContainer = await helpers.getWebElements(driver, css.responsesList.threadItemContainer);
      expect(await itemContainer[0].getCssValue('font-weight')).to.not.eql(css.general.boldFontWeight);

      let statusCircle = await helpers.getWebElements(driver, css.responsesList.threadItems.statusCircle);
      expect(statusCircle).to.have.lengthOf(1);
      expect(await statusCircle[0].getCssValue('fill')).to.eql(css.general.pendingFill);

      expect(await helpers.isElementVisible(driver, css.responsesList.threadItems.ntfBell)).to.eql(false);
    });

  });

  // TODO: login in as approver and test approving functions
  // TODO: login in as feedback receiver and check that they have not recieved the feedback yet

});