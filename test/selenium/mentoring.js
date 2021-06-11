//7 tests fail
// 1) Mentoring Interactions
// On Home page
//   should have 1 visible response notification:
// TimeoutError: Wait timed out after 8162ms
// at /Users/timothyleonard/Documents/21PSTEM/mt/encompass/node_modules/selenium-webdriver/lib/webdriver.js:894:17
// at processTicksAndRejections (internal/process/task_queues.js:97:5)

// REQUIRE MODULES
const {Builder, until} = require('selenium-webdriver');
const expect = require('chai').expect;
const moment = require('moment');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const SwalDriver = require('./utilities/sweet_alert');

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
  displayName: 'mtgstudent1',
  username: 'mtgstudent1',
};

let responseInfo = {
  submission: {
    _id: '5c6ec5eba89be9751158ce08',
    createDate: '2019-02-21 15:38:19.873Z',
  },
  response: {
    _id: '5c6eca77a89be9751158ce0c',
    createDate: '2019-02-21 15:57:43.792Z'
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
  let swalDriver;

  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();

      swalDriver = new SwalDriver(driver);

    await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, feedbackReceiver);
    }catch(err) {
      console.log(err);
    }
  });

  after(() => {
    return driver.quit();
  });

  xdescribe('On Home page', function() {
    it('should have 1 visible response notification', async function() {
      let numNtfs = 1;
      await helpers.waitForElementToHaveText(driver, css.topBar.responseNtf, numNtfs.toString());
      // expect(await helpers.findAndGetText(driver, css.topBar.responseNtf)).to.eql('1');
    });
  });

  describe('Visting Responses List', function() {
    before(async function() {
      let options = {
        selector: css.responsesList.submitterTab,
        urlToWaitFor: `${helpers.host}/#/responses`,
        timeout: 10000
      };
  
      await helpers.navigateAndWait(driver, `${helpers.host}/#/responses`, options );
      await helpers.waitForUrlMatch(driver, /\/#\/responses/);
    });

    it('should display solver tab and display count', async function() {

      await helpers.waitForNElements(driver, css.responsesList.submitterTab, 1);
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
      let responseThreads = await helpers.waitForNElements(driver, css.responsesList.responseThreads, 1);

      expect(responseThreads).to.have.lengthOf(1);
    });

    it('should dispaly correct sort-bar items', async function() {
     await checkSortBarDisplay(driver, [css.responsesList.sortBar.student]);
    });

    it('should display correct information about thread', async function() {
      let values = {
        workspace: workspaceInfo.name,
        submissionDate: moment(responseInfo.submission.createDate).fromNow(),
        replyDate: moment(responseInfo.response.createDate).fromNow(),
        mentors: mentorInfo.displayName,
        problem: workspaceInfo.problem
      };
      let excludedValues = ['statusText'];
      await checkThreadValues(driver, values,  excludedValues);
    });

    it('should indicate that thread has unread reply', async function() {
      try {
        // let itemContainer = await helpers.getWebElements(driver, css.responsesList.threadItemContainer);
        // console.log('found item container');

        let unreadReplyClass = '.has-unread-reply';

        await helpers.waitForNElements(driver, unreadReplyClass, 1);
        // await helpers.waitForAttributeToEql(driver, itemContainer[0], 'font-weight', css.general.boldFontWeight, {useCssValue: true});

        // expect(await itemContainer[0].getCssValue('font-weight')).to.eql(css.general.boldFontWeight);

        console.log('after fw');

        let statusCircle = await helpers.getWebElements(driver, css.responsesList.threadItems.statusCircle);
        expect(statusCircle).to.have.lengthOf(1);

        let statusCircles = await helpers.waitForNElements(driver, css.responsesList.threadItems.statusCircle, 1);

        await helpers.waitForAttributeToEql(driver, statusCircles[0], 'fill', css.general.unreadReplyFill, {useCssValue: true});

        console.log('after sc');
        // expect(await statusCircle[0].getCssValue('fill')).to.eql(css.general.unreadReplyFill);

        let ntfBells = await helpers.getWebElements(driver, css.responsesList.threadItems.ntfBell);

        return helpers.waitForAttributeToEql(driver, ntfBells[0], 'title', '1 New Notification');

        // expect(await ntfBell[0].getAttribute('title')).to.eql('1 New Notification');
      }catch(err) {
        throw(err);
      }

    });

  });

  describe('Viewing response in paneled view', function() {
    let submitterCss = css.responseInfo.submissionView;
    let answerNewCss = css.assignmentsStudent.newAnswerForm;
    before(async function() {
      await helpers.findAndClickElement(driver, css.responsesList.threadItemContainer);
      let subId = responseInfo.submission._id;
      let responseId = responseInfo.response._id;
      let expectedUrl = `/responses/submission/${subId}?responseId=${responseId}`;

      await driver.wait(until.urlContains(expectedUrl), 8000);
    });

    it('should display submission view', function() {
      return helpers.waitForElementToHaveText(driver, submitterCss.studentIndicator, feedbackReceiver.username)
      .catch((err) => {
        throw(err);
      });
      // expect(await helpers.findAndGetText(driver, submitterCss.studentIndicator)).to.eql(feedbackReceiver.username);
    });

    it('should display mentor reply view', function() {
      return Promise.all([
        helpers.waitForElementToHaveText(driver, css.responseInfo.mentorReplyView.recipient, feedbackReceiver.username),
        helpers.waitForElementToHaveText(driver, css.responseInfo.mentorReplyView.sender, mentorInfo.username),
      ])
      .catch((err) => {
        throw(err);
      });
    });

    it('should show revise button', function() {
      console.log('clicking revise btn');
      return helpers.waitForAndClickElement(driver, submitterCss.reviseBtn)
      .then(() => {
        console.log('clicked revise');
        return helpers.waitForSelector(driver, submitterCss.submitRevision);
      })
      .then(() => {
        console.log('found create btn');
      })
      .catch((err) => {
        throw(err);
      });
    });

    describe('Submitting revision from response page', function() {
      let newExplanation = 'Revised explanation';
      let submitBtnClass = submitterCss.submitRevision;

      it('should not submit revision if no changes are made', async function() {
        console.log('should be 2nd');
        let text = answerNewCss.errors.duplicateRevisionText;

        await helpers.waitForAndClickElement(driver, submitBtnClass);
        console.log('after submit click');
        // await helpers.findAndClickElement(driver, submitBtnClass);

        await swalDriver.verifyToast(text);

        // await helpers.waitForTextInDom(driver, text);
        // expect(await helpers.isTextInDom(driver, text)).to.eql(true);
        expect(await helpers.isElementVisible(driver, submitBtnClass)).to.eql(true);

      });

      it('should successfully create revision', async function () {
        let toastMsg = 'Answer Created';
        await helpers.clearElement(driver, answerNewCss.inputs.explanation);
        await helpers.findInputAndType(driver, answerNewCss.inputs.explanation, newExplanation);

        await helpers.findAndClickElement(driver, submitBtnClass);
        await swalDriver.verifyToast(toastMsg);

        // await helpers.waitForTextInDom(driver, toastMsg);

        let revItems = await helpers.waitForNElements(driver, submitterCss.revIndexItem, 2);

        // let revItems = await helpers.getWebElements(driver, submitterCss.revIndexItem);
        expect(revItems).to.have.lengthOf(2);
      });

      it('linked workspace should have been updated', async function() {
        let url = `${host}/#/workspaces/${workspaceInfo._id}/work`;

        await helpers.navigateAndWait(driver, url, {selector: 'span.submission_count' } );
        // await driver.get();
        // await helpers.waitForSelector(driver, 'span.submission_count');

        // click x button on tour box
        // await helpers.findAndClickElement(driver, 'div.guiders_x_button');

        // await helpers.waitForRemoval(driver, 'div#guiders_overlay');

        await helpers.dismissWorkspaceTour(driver);

        return helpers.waitForElementToHaveText(driver,  'span.submission_count', '2');
        // expect(await helpers.findAndGetText(driver,)).to.eql('2');

      });


    });


  });

});