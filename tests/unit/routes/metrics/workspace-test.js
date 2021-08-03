import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | metrics/workspace', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:metrics/workspace');
    assert.ok(route);
  });
});
