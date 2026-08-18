import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | auth/reset', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:auth/reset');
    assert.ok(route);
  });

  test('model returns the token from the url params', function (assert) {
    let route = this.owner.lookup('route:auth/reset');

    let model = route.model({ token: 'reset-token-abc' });

    assert.strictEqual(
      model,
      'reset-token-abc',
      'passes the :token param straight through to the template/component'
    );
  });

  test('model returns undefined when no token is present', function (assert) {
    let route = this.owner.lookup('route:auth/reset');

    assert.strictEqual(
      route.model({}),
      undefined,
      'no token param yields no model (component then skips validation)'
    );
  });
});
