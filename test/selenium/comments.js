// REQUIRE MODULES
const {Builder, By, until} = require('selenium-webdriver');
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
let commentsCss = css.wsComments;

describe('Comments', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  let user = helpers.admin;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
      await dbSetup.prepTestDb();
    try {
      await helpers.login(driver, host, user);
    }catch(err) {
      console.log(err);
    }
  });

  after(function(){
    return driver.quit();
  });

  describe('Visiting a Selection in ESI 2014 Wednesday Reflection', function() {
    const comment = `new comment from ${helpers.admin.username} ${new Date().getTime()}`;
    let saveButton;
    before(async function() {
      try {
        await driver.get(`${host}#/workspaces/53e36522b48b12793f000d3b/submissions/53e36522729e9ef59ba7f4de/selections/53e38e83b48b12793f0010de`);
        saveButton = await driver.wait(until.elementLocated(By.css(commentsCss.save)), 5000);
      }catch(err) {
        console.log(err);
      }
    });

    it('should let us comment', async function() {
      try {
        let textArea = await helpers.getWebElements(driver, '#commentTextarea');
        if (!_.isEmpty(textArea)) {
          await textArea[0].sendKeys(comment);
          await saveButton.click();
        }
      }catch(err) {
        console.log(err);
      }
    });

    it('should clear out the comment field', async function() {
      expect(await helpers.findAndGetText(driver, '#commentTextarea')).to.have.lengthOf(0);
    });

    it('should show the comment', async function() {
      let text;
      let newComment;
      try{
        let paragraphs = await helpers.getWebElements(driver, commentsCss.commentText);
        if (!_.isEmpty(paragraphs)) {
          newComment = paragraphs[paragraphs.length - 1];
          text = await newComment.getText();
        }
      }catch(err) {
        console.log(err);
      }

      expect(text).to.contain(comment);
      //TODO: delete the comment that was added
    });
  });
});
