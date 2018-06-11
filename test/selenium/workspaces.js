const config = require('../../app/config');
const nconf = config.nconf;
const port = nconf.get('testPort');

const {Builder, By, Key, until} = require('selenium-webdriver')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const _ = require('underscore');

const host = `http://localhost:${port}`
const user = 'steve';

describe('Visiting Workspaces', function() {
  this.timeout('10s');
  let driver = null;
  before(() => {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
  });

  after(() => {
    driver.quit();
  });

  it('should land us at /workspaces', async function() {
    let url;
    try {
      await driver.get(`${host}/devonly/fakelogin/${user}`);
      let button = await driver.wait(until.elementLocated(By.css('a[href="#/workspaces"]')), 3000);
      await button.click();
      //sendKeys('webdriver', Key.RETURN);
      await driver.wait(until.elementLocated(By.id('workspace_listing')), 5000);
      url = await driver.getCurrentUrl();
    }catch(err) {
      console.log(err);
    }
    expect(url).to.equal(`${host}/#/workspaces`);

  });

  it('should display a bunch of workspaces', async function() {
    let workspaces;
    let names;
    try {
      workspaces = await driver.findElements(By.css('span.workspace_info'));
      names = await Promise.all(workspaces.map((el) => {
        return el.getText();
      }));
      await driver.sleep(2000);
    }catch(err) {
      console.log(err);
    }
    expect(names.length).to.be.above(2);

  });

  describe('visiting Frog Farming / Grade 4', function() {
    it('should render workspace', async function() {
      let url;
      let workspaceId = '53df8c4c3491b46d73000211';
      try {
      let frogFarming = await driver.findElement(By.css(`a[href="#/workspaces/${workspaceId}/work"]`));
      await frogFarming.click();
      await driver.wait(until.elementLocated(By.id('rightArrow')), 3000);
      url = await driver.getCurrentUrl();
      }catch(err) {
        console.log(err);
      }
      expect(url).to.equal(`${host}/#/workspaces/${workspaceId}/submissions/53df8c4c3491b46d73000201`);
    });

    it('should display submission navigation arrows, and revision links', async function() {
      let isRightArrow;
      let isLeftArrow;
      let breadcrumbs;
      try {
        isRightArrow = await driver.findElement(By.id('rightArrow')).isDisplayed();
        isLeftArrow = await driver.findElement(By.id('leftArrow')).isDisplayed();
        breadcrumbs = await driver.findElement(By.css('ul.breadcrumbs')).getText();
      } catch(err) {
        console.log(err);
      }
      expect(isRightArrow).to.eql(true);
      expect(isLeftArrow).to.eql(true);
      expect(breadcrumbs).to.contain('1');
    });

    it('should display a select box for students', async function() {
      let studentItem;
      let studentList;
      let firstItem;
      try {
        studentItem = await driver.wait(until.elementLocated(By.css('div.selectBox')), 3000).isDisplayed();
        firstItem = await driver.wait(until.elementLocated(By.css('div.studentItem')), 3000).getText();
        studentList = await driver.wait(until.elementLocated(By.id('studentList')), 3000);

      } catch(err) {
        console.log(err);
      }
      expect(studentItem).to.eql(true);
      expect(studentList).to.not.exist;
      expect(firstItem).to.contain('Adelina S.');
    });



      // it('should be on first submission', function() {
      //   'span.submission_index'.should.have.text(/^\W+1\W+$/);
      // });

      it('should show the short answer', async function() {
        let shortText;
        let isVisible;
        try {
          let shortAnswer = await driver.wait(until.elementLocated(By.id('node-1')), 3000);
          if (shortAnswer) {
            isVisible = await shortAnswer.isDisplayed();
            shortText = await shortAnswer.getText();
          }
        } catch(err) {
          console.log(err);
        }
        expect(isVisible).to.eql(true);
        expect(shortText).to.contain('LOL');
      });

      it('should show the long answer', async function() {
        let longText;
        let isVisible;
        try {
          let longAnswer = await driver.wait(until.elementLocated(By.id('node-2')), 3000);
          if (longAnswer) {
            isVisible = await longAnswer.isDisplayed();
            longText = await longAnswer.getText();
          }
        } catch(err) {
          console.log(err);
        }
        expect(isVisible).to.eql(true);
        expect(longText).to.contain('Well, first I narrowed 36 meters down to 12 meters I got these 2 pens:');
      });

      it('should have selecting enabled by default', async function() {
        let checkbox;
        let isEnabled;
        try {
          let checkbox = await driver.wait(until.elementLocated(By.css('label.makingSelection>input')), 3000);
          if (checkbox) {
            isVisible = await checkbox.isDisplayed();
            isEnabled = await checkbox.getAttribute('checked');
          }
        } catch(err) {
          console.log(err);
        }
        expect(isVisible).to.eql(true);
        expect(isEnabled).to.eql('true');
      });
    });

    describe('clicking on the student dropdown', function() {
      let selectBox;
      let names;
      let studentList;
      before(async function() {
        try {
          selectBox = await driver.findElement(By.css('div.selectBox span.selector'));
          await selectBox.click();
          studentList = await driver.wait(until.elementLocated(By.id('studentList')), 3000);
        }catch(err) {
          console.log(err);
        }
      });

      it('should display a bunch of students', async function() {
        let students;
        try {
          students = await studentList.findElements(By.css('li.studentItem'));
          names = await Promise.all(students.map((el) => {
            return el.getText();
          }));
        }catch(err) {
          console.log(err);
        }
        expect(students.length).to.be.above(8);
      });

      it('should display the students in order', function() {
        expect(names[0]).to.equal('Adelina S.');
        expect(names[names.length - 1]).to.equal('Zach W.');
      });

      it('should hide the list of students if clicked', async function() {
        let studentList;
        try{
          await selectBox.click();
          studentList = await driver.wait(until.elementLocated(By.id('studentList')), 3000);
        }catch(err) {
          console.log(err);
        }
        expect(studentList).to.not.exist;
      });
    });

    xdescribe('clicking the prev/next arrows', function() {
      // The arrow clicks only seem to work once each way?
      let afterLeftClick;
      let afterRightClick;

      it('should change the current student', async function() {
        try {
          let leftArrow = await driver.wait(until.elementLocated(By.id('leftArrow')), 3000);
          await leftArrow.click();
          afterLeftClick = await driver.wait(until.elementLocated(By.css('div.studentItem')), 3000).getText();

          let rightArrow = await driver.wait(until.elementLocated(By.id('rightArrow')), 3000);
          await rightArrow.click();
          afterRightClick = await driver.wait(until.elementLocated(By.css('div.studentItem')), 3000).getText();
        }catch(err) {
          console.log(err);
        }
        expect(afterLeftClick).to.eql('Zach W.');
        expect(afterRightClick).to.eql('Adelina S.');
      });
    });

    describe('Visiting a Selection in Frog Farming', function() {
      before(async function() {
        let workspaceId = '53df8c4c3491b46d73000211';
        let submissionId = '53df8c4c3491b46d73000201';
        let selectionId = '5af1d80af7af8705db2ce83e';
        try{
          let link = await driver.wait(until.elementLocated(By.css(`a[href="#/workspaces/${workspaceId}/submissions/${submissionId}/selections/${selectionId}`)), 3000);
          if(link) {
            await link.click();
          }
          await driver.wait(until.elementLocated(By.css('div#al_feedback_display')), 3000);
        }catch(err) {
          console.log(err);
        }
      });

      it('should display a bunch of submissions', async function() {
        let currentUrl;
        try {
          currentUrl = await driver.getCurrentUrl();
        }catch(err) {
          console.log(err);
        }
        expect(currentUrl).to.match(/workspaces\/.*\/submissions\/.*\/selections\//);
        // 'span.submission_count'.should.contain.text('500');
        // 'span.submission_index'.should.contain.text('256');
      });

      it('should display a bunch of comments', async function() {
        let comments;
        let commentsText;
        try {
          comments = await driver.findElements(By.css('#al_feedback_display>ul>li'));
          commentsText = await Promise.all(comments.map((el) => {
            return el.getText();
          }))
        }catch(err) {
          console.log(err);
        }
        expect(comments.length).to.be.above(4);
        expect(commentsText[0]).to.contain('Interesting parallel');
      });

      it('should display a bunch of folders', async function() {
        let folders;
        let folderNames;
        try {
          folders = await driver.wait(until.elementsLocated(By.css('#al_folders>li')), 3000);
          if(!_.isEmpty(folders)) {
            folderNames = await Promise.all(folders.map((el) => {
              return el.getText();
            }));
          }
        }catch(err) {
          console.log(err);
        }
        expect(folders.length).to.be.above(5);
        expect(folderNames[0]).to.contain('for feedback');
      });
    });

    // Consider moving into folders.js
    // Should there be popup functionality?
  describe('Visiting a Folder from Frog Farming', function() {
    before(function() {
      // casper.start(host + '/devonly/fakelogin/casper');
      // casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/work');
      // casper.waitForSelector('span.submission_count');
    });

    // function validateFolderPopup(button) {
    //   it('should popup a seperate window', function() {
    //     casper.click(button);

    //     casper.waitForPopup(/workspaces\/.*\/folders\//, function() {
    //       expect(casper.popups.length).to.equal(1);
    //     });

    //     casper.withPopup(/workspaces\/.*\/folders\//, function() {
    //       'h1'.should.contain.text('Quotable!');
    //     });
    //   });
    // }

    // describe('clicking the submission count', function() {
    //   var button = 'li.folderItem:last-of-type aside>div.al_indicator:first-child';
    //   validateFolderPopup(button);
    // });

    // describe('clicking the selection count', function() {
    //   var button = 'li.folderItem:last-of-type aside>div.al_indicator:last-child';
    //   validateFolderPopup(button);
    // });

    describe('clicking the folder icon', function() {
      it('should display sub-folders (if any)', async function() {
        let folders;
        let interpretationFolder;
        let subFolderList;
        let subFolders;

        try {
          subFolderList = await driver.wait(until.elementsLocated(By.css('li>ul.subfolders')), 1000);
        }catch(err) {
          console.log(err);
        }
        expect(subFolderList).to.not.exist;

        try {
          let links = await driver.wait(until.elementsLocated(By.css('span.toggle-icon.branch')), 3000);
          if (links) {
            await links[0].click();
            await driver.sleep(3000);
            subFolderList = await driver.wait(until.elementLocated(By.css('ul.subfolders')))
            if (subFolderList) {
              subFolders = await subFolderList.findElements(By.css('.folderItem'));
            }
          }
        }catch(err) {
          console.log(err);
        }
        expect(subFolderList).to.exist;
        expect(subFolders.length).to.eql(4);
      });
    });
  });
});


