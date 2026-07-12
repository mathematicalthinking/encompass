import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Route | workspaces/copy', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    // model() calls store.findAll('folderSet'); stub it so the route resolves
    // without a backend
    this.owner.register(
      'service:store',
      class extends Service {
        findAll(type) {
          return Promise.resolve([`${type}-a`, `${type}-b`]);
        }
      }
    );
  });

  test('it exists', function (assert) {
    assert.ok(this.owner.lookup('route:workspaces/copy'));
  });

  test('beforeModel captures the workspace id from the query params', function (assert) {
    let route = this.owner.lookup('route:workspaces/copy');

    route.beforeModel({ intent: { queryParams: { workspace: 'ws-9' } } });

    assert.strictEqual(route.workspaceId, 'ws-9', 'stashes the id to copy');
  });

  test('beforeModel is safe when there are no query params', function (assert) {
    let route = this.owner.lookup('route:workspaces/copy');

    route.beforeModel({ intent: {} });

    assert.strictEqual(route.workspaceId, null, 'leaves the id unset');
  });

  test('model resolves the folder sets and the workspace-to-copy id', async function (assert) {
    let route = this.owner.lookup('route:workspaces/copy');
    route.beforeModel({ intent: { queryParams: { workspace: 'ws-3' } } });

    let model = await route.model();

    assert.deepEqual(
      model.folderSets,
      ['folderSet-a', 'folderSet-b'],
      'loads the folder sets for the owner step'
    );
    assert.strictEqual(
      model.workspaceToCopy,
      'ws-3',
      'passes the id of the workspace being copied through to the component'
    );
  });
});
