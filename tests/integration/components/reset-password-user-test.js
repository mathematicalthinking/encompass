import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | reset-password-user', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const test = this;

    this.originalFetch = window.fetch;
    this.fetchCalls = [];
    this.resetResponse = {
      ok: true,
      json: () => Promise.resolve({ _id: 'sso-1' }),
      text: () => Promise.resolve(''),
    };
    window.fetch = (url, options) => {
      test.fetchCalls.push({ url, options });
      return Promise.resolve(test.resetResponse);
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
  });

  hooks.afterEach(function () {
    window.fetch = this.originalFetch;
  });

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      user: { ssoId: 'sso-1' },
      resetSuccessArg: null,
      cancelled: false,
      handleResetSuccess: (res) => {
        context.resetSuccessArg = res;
      },
      cancelReset: () => {
        context.cancelled = true;
      },
      ...overrides,
    });

    await render(hbs`
      <ResetPasswordUser
        @user={{this.user}}
        @handleResetSuccess={{this.handleResetSuccess}}
        @cancelReset={{this.cancelReset}}
      />
    `);
  }

  test('a successful reset posts to /auth/resetuser, toasts, and calls handleResetSuccess', async function (assert) {
    await renderComponent(this);

    await fillIn('#password', 'new-pass');
    await fillIn('#confirmPassword', 'new-pass');
    await click('.action_button:not(.cancel-button)');

    const post = this.fetchCalls[0];
    assert.ok(post, 'a request was sent');
    assert.strictEqual(post.url, '/auth/resetuser', 'posts to the resetuser endpoint');
    assert.strictEqual(post.options.method, 'POST');
    assert.strictEqual(
      post.options.body.get('password'),
      'new-pass',
      'submits the typed password'
    );
    assert.strictEqual(
      post.options.body.get('ssoId'),
      'sso-1',
      'submits the target user ssoId'
    );
    assert.strictEqual(this.toastCalls[0].type, 'success', 'shows success toast');
    assert.deepEqual(
      this.resetSuccessArg,
      { _id: 'sso-1' },
      'forwards the response to handleResetSuccess'
    );
  });

  test('mismatched passwords show the match error and do not POST', async function (assert) {
    await renderComponent(this);

    await fillIn('#password', 'one');
    await fillIn('#confirmPassword', 'two');
    await click('.action_button:not(.cancel-button)');

    assert.dom('.error-message').hasText("Passwords don't match.");
    assert.strictEqual(this.fetchCalls.length, 0, 'no request is sent');
  });

  test('a server error renders postErrors and does not call handleResetSuccess', async function (assert) {
    this.resetResponse = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({ errors: [{ detail: 'SSO is down' }] }),
      text: () => Promise.resolve(''),
    };

    await renderComponent(this);

    await fillIn('#password', 'new-pass');
    await fillIn('#confirmPassword', 'new-pass');
    await click('.action_button:not(.cancel-button)');

    assert.dom('.error-message').hasText('SSO is down');
    assert.strictEqual(this.resetSuccessArg, null, 'success callback not called');
  });

  test('cancel calls cancelReset', async function (assert) {
    await renderComponent(this);

    await click('.cancel-button');

    assert.true(this.cancelled, 'cancelReset was invoked');
  });
});
