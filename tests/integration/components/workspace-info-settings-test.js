import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor, find, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | workspace-info-settings', function (hooks) {
  setupRenderingTest(hooks);

  // Helper to find button by text
  function findButtonByText(text) {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find((btn) => btn.textContent.trim() === text);
  }

  hooks.beforeEach(function () {
    const store = this.owner.lookup('service:store');

    // Mock all required services
    class UtilityMethodsService extends Service {
      isNonEmptyObject(obj) {
        return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
      }
      isNonEmptyArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
      }
      getBelongsToId(record, key) {
        return record.get ? record.get(key)?.get('id') : null;
      }
    }

    class CurrentUserService extends Service {
      user = {
        id: 'current-user',
        username: 'currentuser',
        isAdmin: true,
        isStudent: false,
      };
    }

    class SweetAlertService extends Service {
      lastToast = null;
      showToast(type, message) {
        this.lastToast = { type, message };
        return Promise.resolve();
      }
      showModal() {
        return Promise.resolve({ value: true });
      }
    }

    class WorkspacePermissionsService extends Service {
      hasOwnerPrivileges() {
        return true;
      }
      isOwner() {
        return true;
      }
      canEdit() {
        return true;
      }
    }

    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:sweet-alert', SweetAlertService);
    this.owner.register(
      'service:workspace-permissions',
      WorkspacePermissionsService
    );

    // Create test data
    const assignment = store.createRecord('assignment', {
      id: 'assignment-1',
      name: 'Test Assignment',
    });

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      name: 'Test Workspace',
      workspaceType: 'individual',
      owner: store.createRecord('user', { id: 'owner-1', username: 'owner' }),
      permissions: [],
    });

    this.set('workspace', workspace);
    this.set('assignment', assignment);
    this.set('linkedAssignment', assignment);
    this.set('canEdit', true);
    this.set('childWorkspaces', []);
  });

  test('BEFORE FIX: passing belongsTo proxy to server causes "Invalid workspace" error', async function (assert) {
    const store = this.owner.lookup('service:store');

    let capturedLinkedAssignmentType = null;

    // Mock createRecord to capture what it receives
    const originalCreateRecord = store.createRecord.bind(store);
    store.createRecord = function (modelName, properties) {
      if (modelName === 'updateWorkspaceRequest') {
        const linkedAssignment = properties.linkedAssignment;
        capturedLinkedAssignmentType =
          linkedAssignment && linkedAssignment._belongsToState
            ? 'proxy'
            : 'record';

        // Simulate server error when receiving proxy
        return {
          save() {
            return Promise.resolve({
              get(key) {
                if (key === 'updateErrors')
                  return ['Invalid workspace or assignment.'];
                return null;
              },
              updateErrors: ['Invalid workspace or assignment.'],
            });
          },
        };
      }
      return originalCreateRecord(modelName, properties);
    };

    // Create a belongsTo proxy to simulate the bug
    const proxyLinkedAssignment = {
      content: this.assignment,
      _belongsToState: {},
      isFulfilled: true,
    };
    this.set('linkedAssignment', proxyLinkedAssignment);

    await render(hbs`
      <WorkspaceInfoSettings
        @workspace={{this.workspace}}
        @linkedAssignment={{this.linkedAssignment}}
        @canEdit={{this.canEdit}}
        @childWorkspaces={{this.childWorkspaces}}
      />
    `);

    const updateButton = findButtonByText('Update Workspace');
    await click(updateButton);
    await waitFor('.update-results', { timeout: 2000 });

    // Without the fix, a proxy would be passed
    assert.strictEqual(
      capturedLinkedAssignmentType,
      'record',
      'AFTER FIX: Should extract actual record from proxy, not pass proxy itself'
    );

    // Error should be visible in UI now that we added @tracked
    assert.dom('.update-results').exists('Error results section is visible');
  });

  test('AFTER FIX: extracts actual record from belongsTo proxy', async function (assert) {
    const store = this.owner.lookup('service:store');
    let capturedLinkedAssignmentId = null;

    store.createRecord = function (modelName, properties) {
      if (modelName === 'updateWorkspaceRequest') {
        capturedLinkedAssignmentId = properties.linkedAssignment?.id;
        return {
          save() {
            return Promise.resolve({
              get(key) {
                if (key === 'wereNoAnswersToUpdate') return true;
                return null;
              },
            });
          },
        };
      }
    };

    await render(hbs`
      <WorkspaceInfoSettings
        @workspace={{this.workspace}}
        @linkedAssignment={{this.linkedAssignment}}
        @canEdit={{this.canEdit}}
        @childWorkspaces={{this.childWorkspaces}}
      />
    `);

    const updateButton = findButtonByText('Update Workspace');
    await click(updateButton);

    assert.strictEqual(
      capturedLinkedAssignmentId,
      'assignment-1',
      'Extracted actual assignment record with correct ID'
    );
  });

  test('displays error messages in UI when @tracked properties are set', async function (assert) {
    const store = this.owner.lookup('service:store');

    store.createRecord = function (modelName) {
      if (modelName === 'updateWorkspaceRequest') {
        return {
          save() {
            return Promise.resolve({
              get(key) {
                if (key === 'updateErrors')
                  return ['Invalid workspace or assignment.'];
                return null;
              },
              updateErrors: ['Invalid workspace or assignment.'],
            });
          },
        };
      }
    };

    await render(hbs`
      <WorkspaceInfoSettings
        @workspace={{this.workspace}}
        @linkedAssignment={{this.linkedAssignment}}
        @canEdit={{this.canEdit}}
        @childWorkspaces={{this.childWorkspaces}}
      />
    `);

    const updateButton = findButtonByText('Update Workspace');
    await click(updateButton);
    await waitFor('.update-results', { timeout: 2000 });

    assert
      .dom('.update-results')
      .containsText(
        'Invalid workspace',
        'Error message appears in UI (requires @tracked)'
      );
  });

  test('shows success toast when submissions are added', async function (assert) {
    const store = this.owner.lookup('service:store');
    const sweetAlert = this.owner.lookup('service:sweet-alert');

    store.createRecord = function (modelName) {
      if (modelName === 'updateWorkspaceRequest') {
        return {
          save() {
            return Promise.resolve({
              get(key) {
                if (key === 'wereNoAnswersToUpdate') return false;
                if (key === 'updateErrors') return null;
                return null;
              },
              addedSubmissions: [{ id: 'sub-1' }, { id: 'sub-2' }],
            });
          },
        };
      }
    };

    await render(hbs`
      <WorkspaceInfoSettings
        @workspace={{this.workspace}}
        @linkedAssignment={{this.linkedAssignment}}
        @canEdit={{this.canEdit}}
        @childWorkspaces={{this.childWorkspaces}}
      />
    `);

    const updateButton = findButtonByText('Update Workspace');
    await click(updateButton);

    // Check toast was shown
    assert.strictEqual(
      sweetAlert.lastToast.type,
      'success',
      'Shows success toast'
    );
    assert.ok(
      sweetAlert.lastToast.message.includes('2 new submissions'),
      'Toast message mentions 2 submissions'
    );
  });

  test('shows info toast when workspace is up to date', async function (assert) {
    const store = this.owner.lookup('service:store');
    const sweetAlert = this.owner.lookup('service:sweet-alert');

    store.createRecord = function (modelName) {
      if (modelName === 'updateWorkspaceRequest') {
        return {
          save() {
            return Promise.resolve({
              get(key) {
                if (key === 'wereNoAnswersToUpdate') return true;
                return null;
              },
            });
          },
        };
      }
    };

    await render(hbs`
      <WorkspaceInfoSettings
        @workspace={{this.workspace}}
        @linkedAssignment={{this.linkedAssignment}}
        @canEdit={{this.canEdit}}
        @childWorkspaces={{this.childWorkspaces}}
      />
    `);

    const updateButton = findButtonByText('Update Workspace');
    await click(updateButton);

    assert.strictEqual(sweetAlert.lastToast.type, 'info', 'Shows info toast');
    assert.strictEqual(
      sweetAlert.lastToast.message,
      'Workspace Up to Date',
      'Toast says workspace is up to date'
    );
  });

  test('handles Ember Data assertion error from embedded objects in response', async function (assert) {
    const store = this.owner.lookup('service:store');
    const sweetAlert = this.owner.lookup('service:sweet-alert');

    // Track if workspace.reload() was called
    let workspaceReloadCalled = false;
    this.workspace.reload = function () {
      workspaceReloadCalled = true;
      return Promise.resolve(this);
    };

    store.createRecord = function (modelName) {
      if (modelName === 'updateWorkspaceRequest') {
        return {
          save() {
            // Simulate the Ember Data assertion error that occurs when
            // server returns full user objects instead of relationship identifiers
            const error = new Error(
              "Assertion Failed: Encountered a relationship identifier without a type for the belongsTo relationship 'owner' on <workspace:123>, expected an identifier with type 'user' but found full object"
            );
            return Promise.reject(error);
          },
        };
      }
    };

    await render(hbs`
      <WorkspaceInfoSettings
        @workspace={{this.workspace}}
        @linkedAssignment={{this.linkedAssignment}}
        @canEdit={{this.canEdit}}
        @childWorkspaces={{this.childWorkspaces}}
      />
    `);

    const updateButton = findButtonByText('Update Workspace');
    await click(updateButton);

    // Wait for all async operations (error catch, reload, toast)
    await settled();

    assert.ok(
      workspaceReloadCalled,
      'Workspace reload was called when embedded object error occurred'
    );
    assert.strictEqual(
      sweetAlert.lastToast.type,
      'success',
      'Shows success toast despite serialization error'
    );
    assert.ok(
      sweetAlert.lastToast.message.includes('updated'),
      'Toast message indicates successful update'
    );
  });
});
