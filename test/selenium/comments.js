const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const _ = require('underscore');
const helpers = require('./helpers');

const host = 'http://localhost:8080';
const user = 'casper';

describe('Comments', function() {
  this.timeout('10s');
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    try {
      await driver.get(`${host}/devonly/fakelogin/${user}`);
    }catch(err) {
      console.log(err);
    }
  });
  
  after(() => {
    driver.quit();
  });

  describe('Visiting a Selection in ESI 2014 Wednesday Reflection', function() {
    const comment = 'new comment from casper ' + new Date().getTime();
    let saveButton;
    before(async function() {
      try {
        await driver.get(`${host}#/workspaces/53e36522b48b12793f000d3b/submissions/53e36522729e9ef59ba7f4de/selections/53e38e83b48b12793f0010de`);
        saveButton = await driver.wait(until.elementLocated(By.css('button.comment.save')), 3000);
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
          await driver.wait(until.elementLocated(By.css('#commentTextarea:empty')), 3000);
          await driver.sleep(5000);
        }
      }catch(err) {
        console.log(err);
      }
    });
  
    it('should clear out the comment field', async function() {
      let text;
      try{
        let textArea = await helpers.getWebElements(driver, '#commentTextarea');
        if (!_.isEmpty(textArea)) {
          let el = textArea[0];
          text = await el.getText();
        }
      }catch(err) {
        console.log(err);
      }
      //"$('#commentTextarea').text().length".should.evaluate.to.equal(0);
      expect(text.length).to.eql(0);
    });

    it('should show the comment', async function() {
      let text;
      let newComment;
      try{
        let paragraphs = await helpers.getWebElements(driver, 'li.notice>p>a.newWindow');
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