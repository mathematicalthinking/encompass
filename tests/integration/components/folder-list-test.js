import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | folder-list', function (hooks) {
  setupRenderingTest(hooks);

  function registerPermissions(owner, canManage) {
    owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return canManage;
        }
      }
    );
  }

  hooks.beforeEach(function () {
    this.owner.register(
      'service:utility-methods',
      class extends Service {
        getBelongsToId(record) {
          return record.parentId ?? null;
        }
        isNullOrUndefined(v) {
          return v === null || v === undefined;
        }
      }
    );
    this.owner.register('service:current-user', class extends Service {});
    this.owner.register('service:sweet-alert', class extends Service {});
    this.owner.register('service:store', class extends Service {});
    this.owner.register(
      'service:error-handling',
      class extends Service {
        getErrors() {
          return [];
        }
      }
    );

    // Child components -> no-op stubs (FolderElem/WorkspaceFolderDrop render folders).
    this.owner.register('template:components/workspace-folder-drop', hbs`<div class='drop-stub'>{{yield}}</div>`);
    this.owner.register('component:workspace-folder-drop', templateOnly());
    this.owner.register('template:components/folder-elem', hbs`<li class='folder-elem-stub'>{{@model.name}}</li>`);
    this.owner.register('component:folder-elem', templateOnly());

    this.folders = [
      { id: 'f1', name: 'Beta', weight: 2, parentId: null },
      { id: 'f2', name: 'Alpha', weight: 1, parentId: null },
      { id: 'f3', name: 'Child', weight: 1, parentId: 'f1' },
    ];
    this.workspace = { id: 'w1' };
  });

  test('renders a folder element per top-level folder, sorted by weight then name', async function (assert) {
    registerPermissions(this.owner, false);
    this.set('folders', this.folders);
    this.set('workspace', this.workspace);

    await render(hbs`<FolderList @folders={{this.folders}} @workspace={{this.workspace}} />`);

    // only the two top-level folders (child excluded)
    assert.dom('.folder-elem-stub').exists({ count: 2 });
    const text = this.element.querySelectorAll('.folder-elem-stub');
    assert.strictEqual(text[0].textContent.trim(), 'Alpha', 'weight 1 sorts first');
    assert.strictEqual(text[1].textContent.trim(), 'Beta');
  });

  test('hides the manage-folders controls without permission', async function (assert) {
    registerPermissions(this.owner, false);
    this.set('folders', this.folders);
    this.set('workspace', this.workspace);

    await render(hbs`<FolderList @folders={{this.folders}} @workspace={{this.workspace}} />`);

    assert.dom('.folders-modify').doesNotExist('no controls without permission');
  });

  test('shows the manage-folders controls with permission', async function (assert) {
    registerPermissions(this.owner, true);
    this.set('folders', this.folders);
    this.set('workspace', this.workspace);

    await render(hbs`<FolderList @folders={{this.folders}} @workspace={{this.workspace}} />`);

    assert.dom('.folders-modify').exists('controls shown with permission');
  });
});
