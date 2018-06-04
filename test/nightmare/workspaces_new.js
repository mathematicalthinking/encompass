const Nightmare = require('nightmare');
const chai = require('chai');
const _ = require('underscore');

const assert = chai.assert;
const expect = chai.expect;
const host = 'http://localhost:8080';

describe('Visiting Workspace Creation', function() {
  const username = 'steve';
  let nightmare = null;
  this.timeout('10s');
  before(() => {
    nightmare = new Nightmare();
    nightmare
    .goto(`${host}`)
    .wait('a[href="login"]')
    .click('a[href="login"]')
    .wait()
    .type('input[name="username"]', username)
    .click('input[type="submit"]')
    .wait('a[href="#/workspaces/new"')
    .click('a[href="#/workspaces/new"')
    .wait('section.newWorkspace.sanity');
  });

  after(() => {
    nightmare.end();
  });

  describe('should display an overview, and some sections', () => {
    const els = ['overview', 'third.submissions', 'third.folders', 'third.permissions', 'submit>button'];

    els.forEach((el) => {
      let name;
      let periodIndex = el.indexOf('.');
      if (periodIndex) {
        name = el.slice(periodIndex + 1) + ' section';
      }
      if (el === 'submit>button') {
        name = 'submit button';
      }
      it(`should display ${name}`, (done) => {
        nightmare
        .visible(`section.${el}`)
        .then((res) => {
          assert.equal(res, true);
          done();
        })
        .catch(done);
      });
    });
  });

  describe('should display folder set options', () => {
    it('should display folders dropdown menu', (done) => {
      nightmare
      .visible(`section.third.folders select`)
      .then((res) => {
        assert.equal(res, true);
        done();
      })
      .catch(done);
    });
    it('folders dropdown menu should have at least 3 options', (done) => {
      nightmare
      .evaluate(() => {
        return document.querySelector('section.third.folders select');
      })
      .then((res) => {
        let numOptions = _.keys(res).length;
        assert.isAbove(numOptions, 2);
        done();
      })
      .catch(done);
    });
  });

  describe('clicking the pow import option', function() {
    before(() => {
      nightmare
      .click('input.powImport')
      .wait('.ember-view');
    });
    it('should change the displayed import form', function(done) {
      nightmare
      .visible('form#powImportForm')
      .then((res) => {
        assert.equal(res, true);
        done();
      })
      .catch(done);
    });

    function validatePowInputForm() {
      const inputs = ['teacher', 'submitter', 'puzzle', 'course','subs','start', 'end'];
        inputs.forEach((input) => {
          it(`should display ${input} option`, (done) => {
            nightmare
            .visible(`input#${input}`)
            .then((res) => {
              assert.equal(res, true);
              done();
            })
            .catch(done);
          });
        });

        it(`teacher input should be set to logged in user`, (done) => {
          nightmare
            .evaluate(() => {
              return document.querySelector('input#teacher').value;
            })
            .then((val) => {
              assert.equal(val, username);
              done();
            })
            .catch(done);
          });
      }
    describe('PoW Import Form Options', () => {
      validatePowInputForm();
    });
  });

  describe('clicking the pd import option', function() {
    before(() => {
      nightmare
      .click('input.pdImport')
      .wait('.ember-view');
    });
    it('Pd form should be displayed', function(done) {
      nightmare
      .visible('form#pdImportForm')
      .then((res) => {
        assert.equal(res, true);
        done();
      })
      .catch(done);
    });

    it('PoW form should not exist', (done) => {
      nightmare
      .exists('form#powImportForm')
      .then((res) => {
        assert.equal(res, false);
        done();
      })
      .catch(done);
    });

    it('Pdset dropdown menu should be displayed', (done) => {
      nightmare
        .visible('form#pdImportForm select')
        .then((res) => {
          assert.equal(res, true);
          done();
        })
        .catch(done);
    });

    it('Pdset dropdown should have at least one option', (done) => {
      nightmare
      .evaluate(() => {
        return document.querySelector('form#pdImportForm select');
      })
      .then((res) => {
        let numOptions = _.keys(res).length;
        assert.isAbove(numOptions, 0);
        done();
      })
      .catch(done);
    });
  });
});
    