import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | metrics/submission', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:metrics/submission');
    assert.ok(route);
  });
});
