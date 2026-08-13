import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | log-in', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // SocialSignin needs the mtAuth service; stub it out so log-in renders alone.
    this.owner.register('template:components/social-signin', hbs``);
    this.owner.register('component:social-signin', templateOnly());

    // ErrorHandling superclass injects sweet-alert.
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showToast() {}
      }
    );

    // Spy on the navigation service so we can assert the redirect without reloading.
    this.homeCalls = [];
    const homeCalls = this.homeCalls;
    this.owner.register(
      'service:navigation',
      class extends Service {
        toHome(opts) {
          homeCalls.push(opts);
        }
      }
    );

    // Stub fetch; each test sets fetchOk / fetchPayload.
    this.fetchCalls = [];
    this.fetchOk = true;
    this.fetchPayload = {};
    const self = this;
    this.originalFetch = window.fetch;
    window.fetch = function (url, opts) {
      self.fetchCalls.push({ url, opts });
      return Promise.resolve({
        ok: self.fetchOk,
        status: self.fetchOk ? 200 : 401,
        json: () => Promise.resolve(self.fetchPayload),
      });
    };
  });

  hooks.afterEach(function () {
    window.fetch = this.originalFetch;
  });

  test('submitting with no credentials shows the error and never calls the server', async function (assert) {
    await render(hbs`<LogIn />`);
    await click('.auth-button');
    await settled();

    assert.dom('.error-text').hasText('Incorrect username or password');
    assert.strictEqual(this.fetchCalls.length, 0, 'no request was made');
    assert.strictEqual(this.homeCalls.length, 0, 'did not navigate');
  });

  test('an "Incorrect password" response shows the password error and stays put', async function (assert) {
    this.fetchOk = true;
    this.fetchPayload = { message: 'Incorrect password' };

    await render(hbs`<LogIn />`);
    await fillIn('#username', 'teacher1');
    await fillIn('#password', 'wrongpass');
    await click('.auth-button');
    await settled();

    assert.strictEqual(this.fetchCalls[0].url, '/auth/login', 'posts to /auth/login');
    assert.dom('.error-text').hasText('Incorrect Password');
    assert.strictEqual(this.homeCalls.length, 0, 'stays on the login page');
  });

  test('a successful login navigates home with a full reload', async function (assert) {
    this.fetchOk = true;
    this.fetchPayload = { user: { id: '1' } };

    await render(hbs`<LogIn />`);
    await fillIn('#username', 'teacher1');
    await fillIn('#password', 'correcthorse');
    await click('.auth-button');
    await settled();

    assert.strictEqual(this.homeCalls.length, 1, 'navigated home once');
    assert.deepEqual(this.homeCalls[0], { fullReload: true });
  });
});
