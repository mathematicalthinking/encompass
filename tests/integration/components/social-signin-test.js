import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | social-signin', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:mt-auth',
      class extends Service {
        getSsoGoogleUrl() {
          return 'https://sso.example.test/oauth/google';
        }
      }
    );
  });

  test('renders the Google sign-in button', async function (assert) {
    await render(hbs`<SocialSignin />`);

    assert.dom('#google-text').hasText('Sign in with Google');
    assert.dom('.social-signin button').exists();
  });

  test('links the button to the SSO Google url from the auth service', async function (assert) {
    await render(hbs`<SocialSignin />`);

    assert
      .dom('.social-signin a')
      .hasAttribute('href', 'https://sso.example.test/oauth/google');
  });
});
