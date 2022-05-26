import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | landing-page', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:landing-page');
    assert.ok(route);
  });
});
