const Nightmare = require('nightmare');
const assert = require('assert');

const host = 'http://localhost:8080';

describe('Load a Page', function () {
  // Recommended: 5s locally, 10s to remote server, 30s from airplane ¯\_(ツ)_/¯
  this.timeout('10s');

  let nightmare = null;
  beforeEach(() => {
    nightmare = new Nightmare();
  });

  describe('/ (Home Page)', () => {
    it('should load without error', done => {
      // your actual testing urls will likely be `http://localhost:port/path`
      nightmare.goto('http://localhost:8080')
        .end()
        .then(function (result) { done(); })
        .catch(done);
    });

    it('login button should exist', done => {
      nightmare.goto('http://localhost:8080/#login')
        .wait('.ember-view')
        .exists('a[href="login"')
        .end()
        .then((res) => {
          assert.equal(res, true);
          done();
        })
        .catch(done);
    });

    it('login button should be visible', done => {
      nightmare.goto('http://localhost:8080/#login')
        .wait('.ember-view')
        .visible('a[href="login"]')
        .end()
        .then((res) => {
          assert.equal(res, true);
          done();
        })
        .catch(done);
    });

  });

  describe('Visiting the EnCoMPASS Homepage', () => {
    it('should land us at the root', (done) => {
      nightmare.goto(`${host}/devonly/fakelogin/nightmare`)
        .end()
        .then((res) => {
          assert.equal(res.url, `${host}/`);
          done();
        })
        .catch(done);
    });

    it('should welcome the user to Encompass', function (done) {
      nightmare.goto(`${host}/devonly/fakelogin/nightmare`)
        .wait('.ember-view')
        .evaluate(() => {
          return document.querySelector('#al_welcome').innerText;
        })
        .then((text) => {
          assert.equal(text, 'Welcome, nightmare');
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
          nightmare.goto(`${host}/devonly/fakelogin/nightmare`)
            .wait('.ember-view')
            .exists(`a[href="#/${navElement}"]`)
            .end()
            .then((res) => {
              assert.equal(res, true);
              done();
            })
            .catch(done);
        });

        it('link should be visible', (done) => {
          nightmare.goto(`${host}/devonly/fakelogin/nightmare`)
            .wait('.ember-view')
            .visible(`a[href="#/${navElement}"]`)
            .end()
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
