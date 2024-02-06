import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | responses/workspace-history', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:responses/workspace-history');
    assert.ok(route);
  });
});
