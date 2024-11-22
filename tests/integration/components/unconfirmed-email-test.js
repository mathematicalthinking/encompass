import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

// Mock CurrentUser service
class MockCurrentUserService extends Service {
  user = {
    displayName: 'Test User',
    email: 'test@example.com',
  };
}

// Mock SweetAlert service
class MockSweetAlertService extends Service {
  showToast(type, message, position, duration, showConfirmButton, callback) {
    // Mock implementation of showToast
    console.log(
      `MockSweetAlertService: showToast called with type=${type}, message=${message}`
    );
  }
}

// Stub jQuery GET request
function mockJQueryGet(url) {
  if (url === '/auth/resend/confirm') {
    return Promise.reject({
      errors: [{ detail: 'Email not found' }, { detail: 'Invalid request' }],
    });
  }
  return Promise.resolve();
}

module('Integration | Component | unconfirmed-email', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register mock CurrentUser service
    this.owner.register('service:current-user', MockCurrentUserService);

    // Stub jQuery
    this.originalJQueryGet = window.$.get;
    window.$.get = mockJQueryGet;

    // Register mock SweetAlert service
    this.owner.register('service:sweet-alert', MockSweetAlertService);
  });

  hooks.afterEach(function () {
    // Restore original jQuery
    window.$.get = this.originalJQueryGet;
  });

  test('it uses the real ErrorHandlingService and displays errors correctly', async function (assert) {
    // Render the component
    await render(hbs`<UnconfirmedEmail />`);

    // Verify initial state
    assert
      .dom('.error-message')
      .doesNotExist('No errors are displayed initially');

    // Trigger the resend email action
    await click('.action_button');

    // Verify the number of error messages
    assert
      .dom('.error-message')
      .exists(
        { count: 2 },
        'Two error messages are displayed after the email fails to send'
      );

    // Verify the text of each error message
    const errorMessages = this.element.querySelectorAll('.error-message');
    assert.strictEqual(
      errorMessages[0].textContent.trim(),
      'Email not found',
      'First error message is displayed correctly'
    );
    assert.strictEqual(
      errorMessages[1].textContent.trim(),
      'Invalid request',
      'Second error message is displayed correctly'
    );
  });
});
