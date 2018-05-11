/* jshint expr: true */
/* global casper */
/* global before */

var system = require('system');
var _      = require('underscore');
var host   = require('./host');
casper.options.viewportSize = {width: 1024, height: 768};
casper.options.waitTimeout = 90000;
casper.options.timeout = 90000;

casper.on('timeout', function(){
  casper.echo('timeout'); //why are we timing out and having the tests pass?
  casper.captureSelector('workspace.png', 'body');
});


describe('Workspaces', function() {
  describe('Visiting Workspace Creation', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
      casper.thenOpen(host + '/#/workspaces/new');
      casper.waitForSelector('section.newWorkspace.sanity');
    });
/*
    function validateImport(alertMsg) {
      casper.echo(alertMsg);
      expect(alertMsg).to.equal('');
    }
*/
    function validatePowImportForm() {
      var teacher = 'amir';
      var course = 26916;
      var puzzle = 3087;

      it('should display pow import options', function() {
        'input#powPd'.should.be.inDOM;
        'input#teacher'.should.be.inDOM;
        'input#teacher'.should.have.attribute('value').and.contain('casper');
        'input#submitter'.should.be.inDOM;
        'input#puzzle'.should.be.inDOM;
        'input#course'.should.be.inDOM;
        'input#subs'.should.be.inDOM;
        'input#start'.should.be.inDOM;
        'input#end'.should.be.inDOM;
      });
      /*
      it('should let us import', function() {
        casper.sendKeys('input#teacher', teacher);
        casper.sendKeys('input#course', course);
        casper.sendKeys('input#puzzle', puzzle);
      
        casper.click('section.submit>button'); 
        casper.then(function() {
          casper.removeListener('remote.alert', validateImport);
        });
      });
      */
    } 
  
    function validatePdImportForm() {
      it('should display pd import options', function() {
        'form#pdImportForm'.should.be.inDOM;
        'form#powImportForm'.should.not.be.inDOM;
        'form#pdImportForm select'.should.be.inDOM;
        "$('form#pdImportForm select>option').length".should.evaluate.to.be.at.least(1);
      });
    } 

    it('should display an overview, and some sections', function() {
      'section.overview'.should.be.inDOM;
      'section.third.submissions'.should.be.inDOM;
      'section.third.folders'.should.be.inDOM;
      'section.third.permissions'.should.be.inDOM;
      'section.submit>button'.should.be.inDOM;
    });

    it('should have pd import selected by default', function() {
      'input.pdImport'.should.be.inDOM;
      'input.pdImport'.should.have.attribute('checked').and.contain('checked');
      'input.powImport'.should.be.inDOM;
       
    });

    validatePdImportForm();

    it('should display folder set options', function() {
      'section.third.folders>select'.should.be.inDOM;
      "$('section.third.folders>select>option').length".should.evaluate.to.be.at.least(3);
    });

    describe('clicking the pow import option', function() {
      before(function() {
        casper.click('input.powImport');
        casper.waitForSelector('form#powImportForm');
      });

      it('should change the displayed import form', function() {
        'form#pdImportForm'.should.not.be.inDOM;
        'form#powImportForm'.should.be.inDOM;
      });

      validatePowImportForm();
    });

    describe('clicking the pd import option', function() {
      before(function() {
        casper.click('input.pdImport');
        casper.waitForSelector('form#pdImportForm');
      });

      it('should change the displayed import form', function() {
        'form#pdImportForm'.should.be.inDOM;
        'form#powImportForm'.should.not.be.inDOM;
      });

      validatePdImportForm();
    });
  });

  describe('Visiting Workspaces', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
      casper.then(function() {
        this.click('a.menu.workspaces');
      });
    });
  
    it('should land us at /workspaces', function() {
      expect(/workspaces/).to.matchCurrentUrl;
    });
  
    it('should display a bunch of workspaces', function() {
      casper.waitForSelector('span.workspace_name', function() {
        '#welcome>h1'.should.not.contain.text('Welcome to the EnCoMPASS Project');
        '$("span.workspace_name").length'.should.evaluate.to.be.at.least(2);
        'Boxes of Stationery / My Copy'.should.be.textInDOM;
        'How Old is Dad? / Grade 4 (2013-2014)'.should.be.textInDOM;
        'maxray'.should.be.textInDOM;
        'lmarinucci'.should.be.textinDOM;
      });
    });
  });

  describe('Visiting Baffling Brothers', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
      casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/work');
      casper.waitForSelector('span.submission_count');
    });
  
    it('should display a bunch of submissions', function() {
      expect(/workspaces\/.*\/submissions\//).to.matchCurrentUrl;
      'span.submission_count'.should.contain.text('500');
    });

    it('should display submission navigation arrows, and revision links', function() {
      'span#rightArrow'.should.be.inDOM;
      'span#leftArrow'.should.be.inDOM;
      '.breadcrumbs'.should.contain.text('1');
    });

    it('should display a select box for students', function() {
      '$("div.selectBox .studentItem").length'.should.evaluate.to.be.at.least(1);
      '#studentList'.should.not.be.inDOM;
    });

    it('should be on the first student', function() {
      'div.selectBox>.selected>.studentItem'.should.contain.text('Aaron A.');
    });

    it('should be on first submission', function() {
      'span.submission_index'.should.have.text(/^\W+1\W+$/);
    });

    it('should show the short answer', function() {
      '#al_submission div.short'.should.contain.text('Brandon had created an equation where "x" would always be equal to 5, no matter what the input was.');
    });

    it('should show the long answer', function() {
      '#al_submission div.long'.should.contain.text('3(t-2)+21');
    });

    it('should have selecting enabled by default', function() {
      'label.makingSelection>input'.should.have.attribute('checked').and.contain('checked');
    });

    describe('clicking on the student dropdown', function() {
      before(function() {
        casper.click('div.selectBox span.selector');
        casper.waitForSelector('ul#studentList');
      });

      it('should display a bunch of students', function() {
        '$("#studentList li.studentItem").length'.should.evaluate.to.be.above(10);
      });

      it('should display the students in order', function() {
        '#studentList>li:first-of-type'.should.contain.text('Aaron A.');
        '#studentList>li:last-of-type'.should.contain.text('Zoe B.');
      });

      it('should hide the list of students if displayed', function() {
        casper.click('div.selectBox span.selector', function() {
          '#studentList'.should.not.be.inDOM;
        });
      });
    });

    describe('clicking the prev/next arrows', function() {
      it('should change the current student', function() {
        casper.click('span#leftArrow', function() {
          'div.selectBox>.selected>.studentItem'.should.contain.text('Zoe B.');
        });

        casper.click('span#rightArrow', function() {
          'div.selectBox>.selected>.studentItem'.should.contain.text('Aaron A.');
        });    
      });
    });
  });

  describe('Visiting a Selection in Baffling Brother', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
      casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/submissions/543e9644729e9ef59ba812f3/selections/5440401851b327412d00002f');
      casper.waitForSelector('li.notice.relevance-3');
    });
  
    it('should display a bunch of submissions', function() {
      expect(/workspaces\/.*\/submissions\/.*\/selections\//).to.matchCurrentUrl;
      'span.submission_count'.should.contain.text('500');
      'span.submission_index'.should.contain.text('256');
    });
  
    it('should display a bunch of comments', function() {
      'Good example of using Alg to solve the Extra'.should.be.textInDom;
      'li.notice.relevance-3'.should.contain.text('Good example of using Alg to solve the Extra');
      "$('#al_feedback_display>ul>li').length".should.evaluate.to.be.above(10);
    });
  
    it('should display a bunch of folders', function() {
      "Doesn't Explain Original Eqn".should.be.textInDom;
      "$('li.folderItem').length".should.evaluate.to.be.above(4);
    });
  });

  // Consider moving into test/casper/folders
  describe('Visiting a Folder from Baffling Brother', function() {
    before(function() {
      casper.start(host + '/devonly/fakelogin/casper');
      casper.thenOpen(host + '/#/workspaces/543e96757112056b290001fa/work');
      casper.waitForSelector('span.submission_count');
    });

    function validateFolderPopup(button) { 
      it('should popup a seperate window', function() {
        casper.click(button);

        casper.waitForPopup(/workspaces\/.*\/folders\//, function() {
          expect(casper.popups.length).to.equal(1);
        });

        casper.withPopup(/workspaces\/.*\/folders\//, function() {
          'h1'.should.contain.text('Quotable!');
        });
      });
    }

    describe('clicking the submission count', function() {
      var button = 'li.folderItem:last-of-type aside>div.al_indicator:first-child';
      validateFolderPopup(button);
    });

    describe('clicking the selection count', function() {
      var button = 'li.folderItem:last-of-type aside>div.al_indicator:last-child';
      validateFolderPopup(button);
    });

    describe('clicking the folder icon', function() {
      it('should display sub-folders (if any)', function() {
        'Simplify as you go'.should.not.be.textInDOM;
        'li>ul.subfolders'.should.not.be.inDOM;

        casper.click('span.toggle-icon.branch');
        casper.waitForSelector('li>ul.subfolders');

        'Simplify as you go'.should.be.textInDOM;
        "$('li>ul.subfolders').length".should.evaluate.to.equal(1);
        "$('li>ul.subfolders>li.folderItem').length".should.evaluate.to.equal(3);
      });
    });

  });
});
