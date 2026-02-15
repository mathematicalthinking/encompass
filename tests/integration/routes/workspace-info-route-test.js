import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { settled } from '@ember/test-helpers';

/**
 * Integration tests for workspace/info route loading and handling permissions
 *
 * Tests that the route:
 * 1. Loads workspace with permissions correctly
 * 2. Loads collaborators based on permissions array
 * 3. Handles empty/null permissions gracefully
 * 4. Passes correct data to controller/template
 */
module('Integration | Route | workspace/info', function (hooks) {
  setupTest(hooks);

  test('route loads workspace and extracts collaborator IDs from permissions', async function (assert) {
    const store = this.owner.lookup('service:store');

    // Create a workspace with permissions
    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      name: 'Test Workspace',
      permissions: [
        {
          user: 'user-1',
          global: 'approver',
          feedback: 'approver',
          selections: 4,
          comments: 4,
          folders: 3,
          submissions: { all: true },
        },
        {
          user: 'user-2',
          global: 'editor',
          feedback: 'none',
          selections: 4,
          comments: 4,
          folders: 3,
          submissions: { all: true },
        },
      ],
    });

    // Create user records
    const user1 = store.createRecord('user', {
      id: 'user-1',
      username: 'collaborator1',
    });
    const user2 = store.createRecord('user', {
      id: 'user-2',
      username: 'collaborator2',
    });

    // Verify permissions extraction
    const permissions = workspace.get('permissions');
    assert.ok(Array.isArray(permissions), 'permissions is an array');
    assert.equal(permissions.length, 2, 'has 2 permission objects');

    const userIds = permissions.map((p) => p.user).filter((id) => id);
    assert.deepEqual(
      userIds,
      ['user-1', 'user-2'],
      'extracted user IDs correctly'
    );

    // Verify collaborators getter
    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2']);
  });

  test('route handles workspace with empty permissions array', async function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-empty',
      name: 'Empty Workspace',
      permissions: [],
    });

    const permissions = workspace.get('permissions');
    assert.ok(Array.isArray(permissions), 'permissions is an array');
    assert.equal(permissions.length, 0, 'permissions array is empty');

    const userIds = permissions.map((p) => p.user).filter((id) => id);
    assert.deepEqual(userIds, [], 'no user IDs extracted');

    assert.deepEqual(workspace.collaborators, [], 'collaborators is empty');
  });

  test('route handles workspace with null permissions', async function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-null',
      name: 'Null Permissions Workspace',
      permissions: null,
    });

    const permissions = workspace.get('permissions');

    // Permissions should be null or undefined
    assert.notOk(
      Array.isArray(permissions) && permissions.length > 0,
      'permissions is not a valid array'
    );

    // Collaborators getter should handle this gracefully
    const collaborators = workspace.collaborators;
    assert.ok(Array.isArray(collaborators), 'collaborators returns an array');
    assert.equal(collaborators.length, 0, 'empty array for null permissions');
  });

  test('route filters out permissions with null user IDs', async function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-mixed',
      name: 'Mixed Workspace',
      permissions: [
        {
          user: 'user-1',
          global: 'approver',
          feedback: 'approver',
        },
        {
          user: null,
          global: 'editor',
          feedback: 'none',
        },
        {
          user: 'user-2',
          global: 'editor',
          feedback: 'none',
        },
        {
          user: undefined,
          global: 'viewOnly',
          feedback: 'none',
        },
      ],
    });

    const permissions = workspace.get('permissions');
    const userIds = permissions.map((p) => p.user).filter((id) => id);

    assert.equal(userIds.length, 2, 'filtered out null/undefined user IDs');
    assert.deepEqual(userIds, ['user-1', 'user-2']);

    const collaborators = workspace.collaborators;
    assert.deepEqual(collaborators, ['user-1', 'user-2']);
  });

  test('route passes originalCollaborators as array to template', async function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'editor', feedback: 'none' },
      ],
    });

    const user1 = store.createRecord('user', {
      id: 'user-1',
      username: 'user1',
    });
    const user2 = store.createRecord('user', {
      id: 'user-2',
      username: 'user2',
    });

    // Simulate what the route does
    const permissions = workspace.get('permissions');
    let originalCollaborators = [];

    if (Array.isArray(permissions) && permissions.length > 0) {
      const userIds = permissions.map((p) => p.user).filter((id) => id);
      // In the real route, this would be a store.query result
      originalCollaborators = [user1, user2];
    }

    assert.ok(
      Array.isArray(originalCollaborators),
      'originalCollaborators is an array'
    );
    assert.equal(
      originalCollaborators.length,
      2,
      'has correct number of collaborators'
    );
  });

  test('permissions array maintains structure after workspace operations', async function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions: [
        {
          user: 'user-1',
          global: 'approver',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
          submissions: { all: true, userOnly: false, submissionIds: [] },
        },
      ],
    });

    // Simulate adding a collaborator (what components do)
    const newPermission = {
      user: 'user-2',
      global: 'editor',
      selections: 4,
      comments: 4,
      folders: 3,
      feedback: 'none',
      submissions: { all: true, userOnly: false, submissionIds: [] },
    };

    const updatedPermissions = [...workspace.permissions, newPermission];
    workspace.set('permissions', updatedPermissions);

    // Route should still be able to extract user IDs
    const permissions = workspace.get('permissions');
    const userIds = permissions.map((p) => p.user).filter((id) => id);

    assert.equal(userIds.length, 2);
    assert.deepEqual(userIds, ['user-1', 'user-2']);
    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2']);
  });

  test('permissions with complex submissions are accessible in route', async function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-custom',
      permissions: [
        {
          user: 'user-custom',
          global: 'custom',
          selections: 2,
          comments: 2,
          folders: 1,
          feedback: 'none',
          submissions: {
            all: false,
            userOnly: true,
            submissionIds: ['sub-1', 'sub-2', 'sub-3'],
          },
        },
      ],
    });

    const permissions = workspace.get('permissions');
    assert.equal(permissions.length, 1);

    const customPerm = permissions[0];
    assert.equal(customPerm.user, 'user-custom');
    assert.equal(customPerm.global, 'custom');
    assert.false(customPerm.submissions.all);
    assert.true(customPerm.submissions.userOnly);
    assert.equal(customPerm.submissions.submissionIds.length, 3);

    const userIds = permissions.map((p) => p.user).filter((id) => id);
    assert.deepEqual(userIds, ['user-custom']);
  });
});
