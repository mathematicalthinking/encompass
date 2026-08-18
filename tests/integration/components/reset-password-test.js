import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  triggerKeyEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | reset-password', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const test = this;

    // window.fetch dispatcher: GET = token validation, POST = reset submit.
    this.originalFetch = window.fetch;
    this.fetchCalls = [];
    this.tokenResponse = {
      ok: true,
      json: () => Promise.resolve({ isValid: true }),
      text: () => Promise.resolve(''),
    };
    this.resetResponse = {
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    };
    window.fetch = (url, options) => {
      test.fetchCalls.push({ url, options });
      if (options && options.method === 'POST') {
        return Promise.resolve(test.resetResponse);
      }
      return Promise.resolve(test.tokenResponse);
    };

    this.toastCalls = [];
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showToast(type, message) {
          test.toastCalls.push({ type, message });
        }
      }
    );

    this.handleErrorsCalls = [];
    this.owner.register(
      'service:error-handling',
      class extends Service {
        handleErrors(err, key) {
          test.handleErrorsCalls.push({ err, key });
        }
      }
    );

    this.toHomeCalls = [];
    this.owner.register(
      'service:navigation',
      class extends Service {
        toHome(opts) {
          test.toHomeCalls.push(opts);
        }
      }
    );
  });

  hooks.afterEach(function () {
    window.fetch = this.originalFetch;
  });

  async function renderComponent(context, token = 'tok-123') {
    context.set('token', token);
    await render(hbs`<ResetPassword @token={{this.token}} />`);
  }

  test('a valid token renders the reset form', async function (assert) {
    await renderComponent(this);

    assert
      .strictEqual(
        this.fetchCalls[0].url,
        '/auth/reset/tok-123',
        'validates the token on insert'
      );
    assert.dom('#form-reset-pass').exists('the password form is shown');
    assert.dom('#password').exists();
    assert.dom('#confirmPassword').exists();
  });

  test('an invalid token hides the form and shows the reason', async function (assert) {
    this.tokenResponse = {
      ok: true,
      json: () =>
        Promise.resolve({ isValid: false, info: 'This link has expired' }),
      text: () => Promise.resolve(''),
    };

    await renderComponent(this);

    assert.dom('#form-reset-pass').doesNotExist('no form for an invalid token');
    assert.dom('.error-message').hasText('This link has expired');
    assert
      .dom('.forgot-link')
      .exists('offers the back-to-forgot-password link');
  });

  test('a token-validation request failure surfaces an error', async function (assert) {
    this.tokenResponse = {
      ok: false,
      status: 500,
      text: () => Promise.resolve('boom'),
    };

    await renderComponent(this);

    assert.dom('#form-reset-pass').doesNotExist();
    assert.dom('.error-message').hasText('boom');
    assert.strictEqual(
      this.handleErrorsCalls[0].key,
      'getTokenErrors',
      'routes the error through errorHandling'
    );
  });

  test('no token means no validation request and no form', async function (assert) {
    await renderComponent(this, null);

    assert.strictEqual(this.fetchCalls.length, 0, 'no request without a token');
    assert.dom('#form-reset-pass').doesNotExist();
  });

  test('submitting with empty fields shows the required-fields error', async function (assert) {
    await renderComponent(this);

    await click('#reset-password');

    assert.dom('.error-message').hasText('Please fill in all required fields.');
    assert.strictEqual(
      this.fetchCalls.filter((c) => c.options?.method === 'POST').length,
      0,
      'no submit request is sent'
    );
  });

  test('mismatched passwords show the match error and do not submit', async function (assert) {
    await renderComponent(this);

    await fillIn('#password', 'secret-one');
    await fillIn('#confirmPassword', 'secret-two');
    await click('#reset-password');

    assert.dom('.error-message').hasText("Passwords don't match.");
    assert.strictEqual(
      this.fetchCalls.filter((c) => c.options?.method === 'POST').length,
      0,
      'no submit request is sent'
    );
  });

  test('typing in a field clears a visible validation error', async function (assert) {
    await renderComponent(this);

    await click('#reset-password');
    assert
      .dom('.error-message')
      .exists('required-fields error is showing first');

    await triggerKeyEvent('#password', 'keyup', 'A');

    assert
      .dom('.error-message')
      .doesNotExist('keydown resets the validation error');
  });

  test('a successful reset posts, toasts, and navigates home', async function (assert) {
    await renderComponent(this);

    await fillIn('#password', 'matching-pass');
    await fillIn('#confirmPassword', 'matching-pass');
    await click('#reset-password');

    let post = this.fetchCalls.find((c) => c.options?.method === 'POST');
    assert.ok(post, 'a POST submit was sent');
    assert.strictEqual(post.url, '/auth/reset/tok-123', 'posts to the token url');
    assert.strictEqual(
      post.options.body.get('password'),
      'matching-pass',
      'submits the password the user typed'
    );
    assert.strictEqual(this.toastCalls[0].type, 'success', 'shows success toast');
    assert.strictEqual(
      this.toHomeCalls.length,
      1,
      'navigates home (the previously-broken sendAction path)'
    );
    assert.deepEqual(
      this.toHomeCalls[0],
      { fullReload: true },
      'requests a full reload to home'
    );
  });

  test('a failed reset shows the server error and does not navigate', async function (assert) {
    this.resetResponse = {
      ok: false,
      status: 422,
      text: () =>
        Promise.resolve(
          JSON.stringify({ errors: [{ detail: 'Password too weak' }] })
        ),
    };

    await renderComponent(this);

    await fillIn('#password', 'matching-pass');
    await fillIn('#confirmPassword', 'matching-pass');
    await click('#reset-password');

    assert.dom('.error-message').hasText('Password too weak');
    assert.strictEqual(
      this.handleErrorsCalls[0].key,
      'resetPasswordErrors',
      'routes the error through errorHandling'
    );
    assert.strictEqual(this.toHomeCalls.length, 0, 'does not navigate on failure');
  });
});
