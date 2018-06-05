const Nightmare = require('nightmare');
const assert = require('assert');

const host = 'http://localhost:8080';
const username = 'casper';

describe('Base', function() {
  this.timeout('10s');
  let nightmare = null;
  
  before(() => {
    nightmare = new Nightmare({show: true});
    nightmare.viewport(1024, 768);
  });

  after(() => {
    nightmare.end();
  })

  describe('/ (Home Page)', () => {
    it('should load without error', (done) => {
      nightmare.goto(host)
        .then(function (result) { done(); })
        .catch(done);
    });

    it('login button should be visible', (done) => {
      nightmare
        .wait('a[href="login"]')
        .visible('a[href="login"]')
        .then((res) => {
          assert.equal(res, true);
          done();
        })
        .catch(done);
    });
  });

  describe('Visiting the EnCoMPASS Homepage', () => {
    it('should land us at the root', (done) => {
      nightmare.goto(`${host}/devonly/fakelogin/${username}`)
        .then((res) => {
          assert.equal(res.url, `${host}/`);
          done();
        })
        .catch(done);
    });

    it('should welcome the user to Encompass', (done) => {
      nightmare
        .wait('#al_welcome')
        .evaluate(() => {
          return document.querySelector('#al_welcome').innerText;
        })
        .then((text) => {
          assert.equal(text, `Welcome, ${username}`);
          done();
        })
        .catch(done);
    });
  });

  describe('Navbar', () => {
    const elements = ['workspaces', 'responses', 'users', 'logout'];
    function verifyNavElement(navElement) {
      describe(navElement, () => {
        it('link should exist', (done) => {
          nightmare
            .visible(`a[href="#/${navElement}"]`)
            .then((res) => {
              assert.equal(res, true);
              done();
            })
            .catch(done);
        });
      });
    }

    elements.forEach((el) => {
      verifyNavElement(el);
    });
  });
});