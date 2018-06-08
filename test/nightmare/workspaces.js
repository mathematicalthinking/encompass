const Nightmare = require('nightmare');
const chai = require('chai');
const _ = require('underscore');

const assert = chai.assert;
const expect = chai.expect;
const host = 'http://localhost:8080';

describe('Visiting Workspaces', function() {
  let nightmare = null;
  this.timeout('30s');
  before(() => {
    console.log('1');
    nightmare = new Nightmare({openDevTools: {
      mode: 'detach'
    },show: true});
    nightmare
    .viewport(1024,768)
    // .goto(`${host}`)
    // .wait('a[href="login"]')
    // .click('a[href="login"]')
    // .wait('input[name="username"]')
    // .type('input[name="username"]', 'steve')
    // .type('input[name="password"', 'mf3210')
    // .click('input[type="submit"]')
    // .wait('a[href="#/workspaces"')
    // .click('a[href="#/workspaces"')
    // .wait('table#workspace_listing');
    .goto(`${host}/devonly/fakelogin/casper`)
    .wait('a[href="#/workspaces"')
    .click('a[href="#/workspaces"')
    .wait('table#workspace_listing');
  });

  after(() => {
    nightmare.end();
  });

  it('should land us at /workspaces', (done) => {
    console.log('2');
    nightmare
      .url()
      .then((url) => {
        assert.equal(url, `${host}/#/workspaces`);
        done();
      })
      .catch(done);
    });

  it('should display several workspaces', function(done) {
    console.log('3');
    nightmare
    .evaluate(() => {
      return [...document.querySelectorAll('.workspace_name')]
        .map(el => el.innerText.trim());
    })
    .then((els) => {
      expect(els.length).to.be.above(3);
      assert.equal(_.contains(els, 'Frog Farming / Grade 4 (2013-2014)'), true);
      assert.equal(_.contains(els, 'A Fake Workspace'), false);
      done();
    })
    .catch(done);
  });

  // describe('Visiting Frog Farming', () => {
    it('should work', (done) => {
      console.log('4');
      nightmare
      .goto('http://localhost:8080/#/workspaces/53df8c4c3491b46d73000211/submissions/53df8c4c3491b46d73000201')
      .then((url) => {
        console.log(url);
        done();
      })
      .catch(done);
    });
  // });
});