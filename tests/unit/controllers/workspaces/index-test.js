import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Controller | workspaces/index', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    // record where the controller tries to navigate
    this.transitions = [];
    const transitions = this.transitions;
    this.owner.register(
      'service:router',
      class extends Service {
        transitionTo(...args) {
          transitions.push(args);
        }
      }
    );
  });

  test('it exists', function (assert) {
    assert.ok(this.owner.lookup('controller:workspaces/index'));
  });

  test('toCopyWorkspace transitions to the copy route with the workspace id as a query param', function (assert) {
    let controller = this.owner.lookup('controller:workspaces/index');
    // the action reads the id off the record via .get('id')
    let workspace = { get: (key) => (key === 'id' ? 'ws-42' : undefined) };

    controller.toCopyWorkspace(workspace);

    assert.deepEqual(
      this.transitions,
      [['workspaces.copy', { queryParams: { workspace: 'ws-42' } }]],
      'navigates to workspaces.copy carrying the workspace id'
    );
  });
});
