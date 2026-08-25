import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Route | problems/new', function (hooks) {
  setupTest(hooks);

  function registerStubs(owner, isStudent) {
    const calls = [];
    owner.register(
      'service:current-user',
      class extends Service {
        isStudent = isStudent;
      }
    );
    owner.register(
      'service:navigation',
      class extends Service {
        toHome() {
          calls.push('toHome');
        }
      }
    );
    return calls;
  }

  test('beforeModel redirects a student home', function (assert) {
    const calls = registerStubs(this.owner, true);
    const route = this.owner.lookup('route:problems/new');

    route.beforeModel();

    assert.deepEqual(calls, ['toHome'], 'a student is redirected home');
  });

  test('beforeModel lets a non-student proceed', function (assert) {
    const calls = registerStubs(this.owner, false);
    const route = this.owner.lookup('route:problems/new');

    route.beforeModel();

    assert.deepEqual(calls, [], 'a teacher/admin is not redirected');
  });
});
