import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | folder-elem', function (hooks) {
  setupRenderingTest(hooks);

  function buildDataTransfer(type, payload) {
    return {
      getData(key) {
        if (key === 'text/plain') {
          return type;
        }
        if (key === 'application/json') {
          return JSON.stringify(payload);
        }
        return '';
      },
    };
  }

  hooks.beforeEach(function () {
    class UtilityMethodsService extends Service {
      getBelongsToId(record, key) {
        const value = record?.[key];
        if (!value) {
          return null;
        }
        return typeof value === 'object' ? value.id ?? null : value;
      }
    }

    class CurrentUserService extends Service {
      user = { id: 'u1' };
    }

    class CurrentSelectionService extends Service {
      isCurrentSelection() {
        return false;
      }
    }

    class AlertService extends Service {
      toastCalls = [];
      showToast(...args) {
        this.toastCalls.push(args);
      }
    }

    class ErrorHandlingService extends Service {
      handleErrors() {}
    }

    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:current-selection', CurrentSelectionService);
    this.owner.register('service:sweet-alert', AlertService);
    this.owner.register('service:error-handling', ErrorHandlingService);

    this.alert = this.owner.lookup('service:sweet-alert');

    this.dropped = [];
    this.set('handleDropped', (selectionId, folder) => {
      this.dropped.push([selectionId, folder]);
    });

    this.filedSelectionIds = [];
    this.set('folder', {
      id: 'f1',
      name: 'Interesting Strategies',
      isExpanded: false,
      sortedChildren: [],
      childSelections: [],
      submissions: [],
      _submissions: [],
      _selections: [],
      taggedSelections: [],
      hasSelection: (id) => this.filedSelectionIds.includes(id),
    });
  });

  test('dropping a selection hands it up to be filed', async function (assert) {
    await render(
      hbs`<FolderElem @model={{this.folder}} @dropped={{this.handleDropped}} />`
    );

    await triggerEvent('.folder', 'drop', {
      dataTransfer: buildDataTransfer('selection', { id: 'sel1' }),
    });

    assert.strictEqual(this.dropped.length, 1, 'the drop is handed up once');
    assert.strictEqual(this.dropped[0][0], 'sel1', 'with the selection id');
    assert.strictEqual(
      this.dropped[0][1],
      this.folder,
      'and the folder it was dropped on'
    );
  });

  test('a selection already in the folder is not filed twice', async function (assert) {
    this.filedSelectionIds.push('sel1');

    await render(
      hbs`<FolderElem @model={{this.folder}} @dropped={{this.handleDropped}} />`
    );

    await triggerEvent('.folder', 'drop', {
      dataTransfer: buildDataTransfer('selection', { id: 'sel1' }),
    });

    assert.deepEqual(this.dropped, [], 'the selection is not filed again');
    assert.strictEqual(this.alert.toastCalls.length, 1, 'the user is told why');
  });

  test('dropping a folder is not treated as a selection', async function (assert) {
    await render(
      hbs`<FolderElem @model={{this.folder}} @dropped={{this.handleDropped}} @folderList={{this.folderList}} />`
    );

    await triggerEvent('.folder', 'drop', {
      dataTransfer: buildDataTransfer('folder', { id: 'f2' }),
    });

    assert.deepEqual(this.dropped, [], 'no selection is filed');
  });
});
