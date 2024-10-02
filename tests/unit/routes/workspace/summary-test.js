import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | workspace/summary', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:workspace/summary');
    assert.ok(route);
  });
});
