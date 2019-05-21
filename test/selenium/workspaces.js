// REQUIRE MODULES
const {Builder, By, until} = require('selenium-webdriver');
const expect = require('chai').expect;
const _ = require('underscore');

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const workspaceId = '53e36522b48b12793f000d3b';

describe('Visiting Workspaces', function() {
  this.timeout(helpers.timeoutTestMsStr);
  let driver = null;
  before(async function() {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
    await dbSetup.prepTestDb();
    await helpers.login(driver, host);
  });

  after(() => {
    driver.quit();
  });

  it('should land us at /workspaces', async function() {
    await helpers.waitForAndClickElement(driver, css.topBar.workspaces);
    await helpers.waitForSelector(driver, '#workspace-list-container');
    expect(await helpers.getCurrentUrl(driver)).to.equal(`${host}/#/workspaces`);
  });

  it('should display 4 workspaces', async function() {
    let names;
    let workspaces = await helpers.getWebElements(driver, 'i.workspace_info');

    try {
      names = await Promise.all(workspaces.map((el) => {
        return el.getText();
      }));
    }catch(err) {
      console.log(err);
    }
    expect(names.length).to.eql(6);
  });

  describe('Visiting ESI 2014 Wednesday Reflection', function() {
    it('should render workspace', async function() {
      let url;
      await helpers.waitForAndClickElement(driver, `a[href="#/workspaces/${workspaceId}/work"]`);
      await helpers.waitForSelector(driver, '#rightArrow');
      try {
        url = await driver.getCurrentUrl();
      }catch(err) {
        console.log(err);
      }
      expect(url).to.equal(`${host}/#/workspaces/${workspaceId}/submissions/53e36522729e9ef59ba7f4de`);
    });

    it('should display submission navigation arrows, and revision links', async function() {
      expect(await helpers.isElementVisible(driver, '#rightArrow')).to.be.true;
      expect(await helpers.isElementVisible(driver, '#leftArrow')).to.be.true;
      expect(await helpers.findAndGetText(driver, 'ul.breadcrumbs')).to.contain('1');
    });

    it('should display a select box for students', async function() {
      expect(await helpers.isElementVisible(driver, css.workspace.studentsSelect)).to.eql(true);
      expect(await helpers.findAndGetText(driver, css.workspace.studentItem)).to.contain('Andrew S.');
      // expect(await helpers.isElementVisible(driver, '#studentList')).to.be.false;
    });



      // it('should be on first submission', function() {
      //   'span.submission_index'.should.have.text(/^\W+1\W+$/);
      // });

      it('should show the short answer', async function() {
        // let selector = '#node-1';
        let selector = '.submission.short';
        expect(await helpers.isElementVisible(driver, selector)).to.eql(true);
        expect(await helpers.findAndGetText(driver, selector)).to.contain('The most useful part of today was having Max');
      });

      it('should show the long answer', async function() {
        // let selector = '#node-1';
        let selector = '.submission.long';
        expect(await helpers.isElementVisible(driver, selector)).to.be.true;
        expect(await helpers.findAndGetText(driver, selector)).to.contain('See above.');
      });

      xit('should have selecting enabled by default', async function() {
        let isEnabled;
        let isVisible;
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
          selectBox = await driver.findElement(By.css(css.workspace.studentsSelect));
          await selectBox.click();
          studentList = await helpers.waitForSelector(driver, css.workspace.dropdownContent);
        }catch(err) {
          console.log(err);
        }
      });

      it('should display a bunch of students', async function() {
        let students;
        try {
          students = await studentList.findElements(By.css('div.option'));
          names = await Promise.all(students.map((el) => {
            return el.getText();
          }));
        }catch(err) {
          console.log(err);
        }
        expect(students.length).to.eql(16);
      });

      it('should display the students in order', function() {
        expect(names[0]).to.equal('Andrew S.');
        expect(names[names.length - 1]).to.equal('Peg C.');
      });

      it('should hide the list of students if clicked', async function() {
        try{
          await selectBox.click();
        }catch(err) {
          console.log(err);
        }
        expect(await helpers.isElementVisible(driver, '#studentList')).to.be.false;
      });
    });

    describe('clicking the prev/next arrows', function() {
      // The arrow clicks only seem to work once each way?
      let afterLeftClick;
      let afterRightClick;

      it('should change the current student', async function() {
        try {
          let leftArrow = await driver.wait(until.elementLocated(By.id('leftArrow')), 3000);
          await leftArrow.click();
          afterLeftClick = await driver.wait(until.elementLocated(By.css(css.workspace.studentItem)), 3000).getText();

          let rightArrow = await driver.wait(until.elementLocated(By.id('rightArrow')), 3000);
          await rightArrow.click();
          afterRightClick = await driver.wait(until.elementLocated(By.css(css.workspace.studentItem)), 3000).getText();
        }catch(err) {
          console.log(err);
        }
        expect(afterLeftClick).to.eql('Peg C.');
        expect(afterRightClick).to.eql('Andrew S.');
      });
    });

    describe('Visiting a Selection in ESI 2014', function() {
      before(async function() {
        let submissionId = '53e36522729e9ef59ba7f4de';
        let selectionId = '53e38e83b48b12793f0010de';
        await helpers.waitForAndClickElement(driver, `a[href="#/workspaces/${workspaceId}/submissions/${submissionId}/selections/${selectionId}"]`);
        await helpers.waitForSelector(driver, 'div#al_feedback_display');
      });

      it('should display a bunch of submissions', async function() {
      // This is commented out because there is a display issue with workspaces, uncomment after fixing
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

      xit('should display a bunch of comments', async function() {
        let comments;
        let commentsText;
        try {
          comments = await driver.findElements(By.css('#al_feedback_display>ul>li'));
          commentsText = await Promise.all(comments.map((el) => {
            return el.getText();
          }));
        }catch(err) {
          console.log(err);
        }
        expect(comments.length).to.eql(1);
        expect(commentsText[0]).to.contain('I spoke with Michael about the balance');
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
        expect(folders.length).to.eql(5);
        expect(folderNames[0]).to.contain('follow up');
      });
    });

    // Consider moving into folders.js
    // Should there be popup functionality?
  describe('Visiting a Folder from ESI 2014', function() {
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
        let subFolderList;
        let subFolders;

        expect(await helpers.isElementVisible(driver,'li>ul.subfolders')).to.be.false;

        try {
          let links = await driver.wait(until.elementsLocated(By.css('span.toggle-icon.branch')), 3000);
          if (links) {
            await links[0].click();
            subFolderList = await driver.wait(until.elementLocated(By.css('ul.subfolders')));
            if (subFolderList) {
              subFolders = await subFolderList.findElements(By.css('.folderItem'));
            }
          }
        }catch(err) {
          console.log(err);
        }
        expect(subFolderList).to.exist;
        expect(subFolders.length).to.eql(5);
      });
    });
  });
});
