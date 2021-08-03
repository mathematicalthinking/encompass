import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | metrics', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:metrics');
    assert.ok(route);
  });
});
