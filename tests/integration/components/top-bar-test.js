import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | top-bar', function (hooks) {
  setupRenderingTest(hooks);

  // Mirrors the user model's acting-aware isStudent getter.
  function registerUser(owner, { accountType, actingRole = 'teacher' }) {
    owner.register(
      'service:current-user',
      class extends Service {
        user = {
          isAuthenticated: true,
          accountType,
          actingRole,
          actingRoleName: actingRole,
          id: '1',
        };
        get isStudent() {
          return (
            this.user.accountType === 'S' || this.user.actingRole === 'student'
          );
        }
      }
    );
  }

  hooks.beforeEach(function () {
    this.owner.register(
      'service:error-handling',
      class extends Service {
        getErrors() {
          return [];
        }
      }
    );
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showModal() {
          return Promise.resolve({});
        }
        showToast() {}
      }
    );
    this.owner.register('service:store', class extends Service {});
  });

  test('a real student sees neither the Users tab nor the Switch Role control', async function (assert) {
    registerUser(this.owner, { accountType: 'S', actingRole: 'student' });

    await render(hbs`<TopBar />`);

    assert.dom('.fa-user-circle').doesNotExist('Users tab is hidden for a student');
    assert.dom('#role-toggle').doesNotExist('Switch Role is hidden for a student');
  });

  test('a teacher acting as a student loses the Users tab but keeps Switch Role', async function (assert) {
    registerUser(this.owner, { accountType: 'T', actingRole: 'student' });

    await render(hbs`<TopBar />`);

    assert
      .dom('.fa-user-circle')
      .doesNotExist('Users tab hides based on effective role, not raw account type');
    assert
      .dom('#role-toggle')
      .exists('Switch Role stays so they can switch back to teacher');
  });

  test('a teacher sees both the Users tab and Switch Role', async function (assert) {
    registerUser(this.owner, { accountType: 'T', actingRole: 'teacher' });

    await render(hbs`<TopBar />`);

    assert.dom('.fa-user-circle').exists('Users tab is visible for a teacher');
    assert.dom('#role-toggle').exists('Switch Role is visible for a teacher');
  });
});
