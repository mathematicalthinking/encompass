import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Controller | workspaces/copy', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
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
    assert.ok(this.owner.lookup('controller:workspaces/copy'));
  });

  test('toWorkspace transitions to workspace.work with the created workspace id', function (assert) {
    let controller = this.owner.lookup('controller:workspaces/copy');

    controller.toWorkspace('new-ws-7');

    assert.deepEqual(
      this.transitions,
      [['workspace.work', 'new-ws-7']],
      'drops the user into the newly created workspace'
    );
  });
});
