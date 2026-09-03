import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

// Covers the whole path a dropped selection travels: folder-elem hands it to
// folder-list, which hands it to the @fileSelection action of the page.
module('Integration | Component | folder filing', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class UtilityMethodsService extends Service {
      getBelongsToId(record, key) {
        const value = record?.[key];
        if (!value) {
          return null;
        }
        return typeof value === 'object' ? value.id ?? null : value;
      }
      isNullOrUndefined(value) {
        return value === null || value === undefined;
      }
    }

    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register(
      'service:current-user',
      class extends Service {
        user = { id: 'u1' };
      }
    );
    this.owner.register(
      'service:current-selection',
      class extends Service {
        isCurrentSelection() {
          return false;
        }
      }
    );
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showToast() {}
      }
    );
    this.owner.register(
      'service:error-handling',
      class extends Service {
        getErrors() {
          return [];
        }
        handleErrors() {}
      }
    );
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return true;
        }
      }
    );

    this.filed = [];
    this.set('fileSelection', (selectionId, folder) => {
      this.filed.push([selectionId, folder]);
    });

    this.folder = {
      id: 'f1',
      name: 'Interesting Strategies',
      weight: 1,
      isExpanded: false,
      sortedChildren: [],
      childSelections: [],
      submissions: [],
      _submissions: [],
      _selections: [],
      taggedSelections: [],
      hasSelection: () => false,
    };
    this.set('folders', [this.folder]);
    this.set('workspace', { id: 'w1' });
  });

  test('a selection dropped on a folder reaches the fileSelection action', async function (assert) {
    await render(hbs`<FolderList
      @folders={{this.folders}}
      @workspace={{this.workspace}}
      @fileSelection={{this.fileSelection}}
    />`);

    await triggerEvent('.folder', 'drop', {
      dataTransfer: {
        getData(key) {
          if (key === 'text/plain') {
            return 'selection';
          }
          return key === 'application/json'
            ? JSON.stringify({ id: 'sel1' })
            : '';
        },
      },
    });

    assert.deepEqual(
      this.filed,
      [['sel1', this.folder]],
      'the selection id and the folder are passed to the page action'
    );
  });
});
