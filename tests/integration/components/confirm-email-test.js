import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | confirm-email', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Each test sets this.response; the stub resolves a fetch-like object from it.
    this.fetchCalls = [];
    this.response = { ok: true, payload: { isValid: true } };
    const self = this;
    this.originalFetch = window.fetch;
    window.fetch = function (url) {
      self.fetchCalls.push(url);
      const r = self.response;
      return Promise.resolve({
        ok: r.ok !== false,
        status: r.ok === false ? r.status || 400 : 200,
        json: () => Promise.resolve(r.payload || {}),
      });
    };
  });

  hooks.afterEach(function () {
    window.fetch = this.originalFetch;
  });

  test('a valid token confirms the email and shows the success message', async function (assert) {
    this.response = { ok: true, payload: { isValid: true } };

    await render(hbs`<ConfirmEmail @token='good-token' />`);
    await settled();

    assert.strictEqual(
      this.fetchCalls[0],
      '/auth/confirm/good-token',
      'requests the confirm endpoint with the token'
    );
    assert.dom('.success-message').exists('shows the confirmation success');
    assert.dom('.error-message').doesNotExist();
  });

  test('an already-confirmed token shows the already-confirmed notice', async function (assert) {
    this.response = {
      ok: true,
      payload: { isValid: false, info: 'Email has already been confirmed' },
    };

    await render(hbs`<ConfirmEmail @token='dupe' />`);
    await settled();

    assert.dom('[data-test="already-confirmed"]').exists();
    assert.dom('.success-message').doesNotExist();
  });

  test('an invalid token surfaces the server info as an error', async function (assert) {
    this.response = {
      ok: true,
      payload: { isValid: false, info: 'This confirmation link is invalid' },
    };

    await render(hbs`<ConfirmEmail @token='bad' />`);
    await settled();

    assert.dom('.error-message').hasText('This confirmation link is invalid');
  });

  test('a failed request now displays an error instead of nothing', async function (assert) {
    // Regression guard: the pre-fix catch assigned to the wrong place and showed nothing.
    this.response = { ok: false, status: 500 };

    await render(hbs`<ConfirmEmail @token='boom' />`);
    await settled();

    assert.dom('.error-message').exists('a fetch failure surfaces a message');
  });

  test('with no token, no request is made', async function (assert) {
    await render(hbs`<ConfirmEmail />`);
    await settled();

    assert.strictEqual(this.fetchCalls.length, 0, 'no token means no request');
    assert.dom('.success-message').doesNotExist();
  });
});
