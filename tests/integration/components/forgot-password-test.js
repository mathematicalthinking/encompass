import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | forgot-password', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // ErrorHandling superclass injects sweet-alert.
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showToast() {}
      }
    );

    // Stub fetch; each test sets fetchPayload.
    this.fetchCalls = [];
    this.fetchPayload = { isSuccess: true };
    const self = this;
    this.originalFetch = window.fetch;
    window.fetch = function (url, opts) {
      self.fetchCalls.push({ url, opts });
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(self.fetchPayload),
      });
    };
  });

  hooks.afterEach(function () {
    window.fetch = this.originalFetch;
  });

  test('submitting with neither email nor username shows the missing-fields error', async function (assert) {
    await render(hbs`<ForgotPassword />`);
    await click('#request-reset-link');
    await settled();

    assert.dom('.error-message').hasText('Missing Required Fields');
    assert.strictEqual(this.fetchCalls.length, 0, 'no request was made');
  });

  test('submitting both an email and a username shows the too-much-data error', async function (assert) {
    await render(hbs`<ForgotPassword />`);
    await fillIn('#email', 'teacher@school.edu');
    await fillIn('#username', 'someuser');
    await click('#request-reset-link');
    await settled();

    assert.dom('.error-message').includesText('only one');
    assert.strictEqual(this.fetchCalls.length, 0, 'no request was made');
  });

  test('a successful request shows the confirmation and clears the fields', async function (assert) {
    this.fetchPayload = { isSuccess: true };

    await render(hbs`<ForgotPassword />`);
    await fillIn('#email', 'teacher@school.edu');
    await click('#request-reset-link');
    await settled();

    assert.strictEqual(this.fetchCalls[0].url, '/auth/forgot', 'posts to /auth/forgot');
    assert.dom('.success-message').exists();
    assert.dom('#email').hasValue('', 'the email field is cleared');
  });

  test('an unsuccessful request surfaces the server info message', async function (assert) {
    this.fetchPayload = { isSuccess: false, info: 'No account matches that email' };

    await render(hbs`<ForgotPassword />`);
    await fillIn('#email', 'nobody@nowhere.com');
    await click('#request-reset-link');
    await settled();

    assert.dom('.error-message').hasText('No account matches that email');
  });
});
