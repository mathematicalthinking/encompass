const Nightmare = require('nightmare');
const chai = require('chai');
const _ = require('underscore');

const assert = chai.assert;
const expect = chai.expect;
const host = 'http://localhost:8080';

describe('Visiting Workspaces', function() {
  let nightmare = null;
  this.timeout('10s');
  before(() => {
    nightmare = new Nightmare();
    nightmare
    .goto(`${host}`)
    .wait('a[href="login"]')
    .click('a[href="login"]')
    .wait()
    .type('input[name="username"]', 'steve')
    .click('input[type="submit"]')
    .wait('a[href="#/workspaces"')
    .click('a[href="#/workspaces"')
    .wait('table#workspace_listing');
  });

  it('should land us at /workspaces', (done) => {
    nightmare
      .url()
      .then((url) => {
        assert.equal(url, `${host}/#/workspaces`);
        done();
      })
      .catch(done);
    });

  it('should display several workspaces', function(done) {
    nightmare
    .evaluate(() => {
      return [...document.querySelectorAll('.workspace_name')]
        .map(el => el.innerText.trim());
    })
    .then((els) => {
      expect(els.length).to.be.above(3);
      expect(_.contains(els, 'Frog Farming / Grade 4 (2013-2014)')).to.be.true;
      expect(_.contains(els, 'A Fake Workspace')).to.be.false;
      done();
    })
    .catch(done);
  });

  // describe('Visiting Frog Farming', () => {
  //   before(() => {
  //     nightmare
  //     .screenshot('test2.png')
  //     .click('a[href="#/workspaces/53df8c4c3491b46d73000211/work"]')
  //     .wait('span.submission_count');
  //   });

  //   it('should display a bunch of submissions', (done) => {
  //     nightmare
  //     .url()
  //     .then((url) => {
  //       console.log(url);
  //       done();
  //     })
  //     .catch(done);
  //   });
  // });

  

  
});