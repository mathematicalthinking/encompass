import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

/**
 * Integration tests for workspace collaborators in real component/service/model scenarios
 *
 * Verifies that:
 * 1. Adding collaborators works end-to-end
 * 2. Removing collaborators works end-to-end
 * 3. Editing collaborators maintains data integrity
 * 4. Service methods work with modified permissions
 * 5. Model getters compute correctly after changes
 * 6. Routes can load and work with permissions
 */
module('Integration | Real-World Collaborators Workflows', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    // Register a mock current-user service
    const currentUserService = this.owner.lookup('service:current-user');
    if (!currentUserService) {
      class CurrentUserStub extends Service {
        user = { id: 'admin-user', isAdmin: false, isPdAdmin: false };
      }
      this.owner.register('service:current-user', CurrentUserStub);
    }
  });

  test('complete workflow: add collaborator → verify list → remove collaborator', function (assert) {
    const store = this.owner.lookup('service:store');

    // Create a workspace with initial collaborator
    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      name: 'Test Workspace',
      permissions: [
        {
          user: 'user-1',
          global: 'owner',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
          submissions: { all: true, userOnly: false, submissionIds: [] },
        },
      ],
    });

    // Initial state: 1 collaborator
    assert.equal(workspace.collaborators.length, 1);
    assert.equal(workspace.collaborators[0], 'user-1');

    // Add a new collaborator
    const newPermission = {
      user: 'user-2',
      global: 'editor',
      selections: 4,
      comments: 4,
      folders: 3,
      feedback: 'none',
      submissions: { all: true, userOnly: false, submissionIds: [] },
    };
    const newPermissions = [...workspace.permissions, newPermission];
    workspace.set('permissions', newPermissions);

    // Verify new collaborator was added
    assert.equal(workspace.collaborators.length, 2);
    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2']);

    // Remove the first collaborator
    const userToRemove = workspace.permissions[0];
    const updatedPermissions = workspace.permissions.filter(
      (p) => p !== userToRemove
    );
    workspace.set('permissions', updatedPermissions);

    // Verify collaborator was removed
    assert.equal(workspace.collaborators.length, 1);
    assert.equal(workspace.collaborators[0], 'user-2');
  });

  test('adding collaborator with custom submissions permissions', function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions: [],
    });

    assert.equal(workspace.collaborators.length, 0);

    const newPermission = {
      user: 'user-1',
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
    };

    workspace.set('permissions', [newPermission]);

    assert.equal(workspace.collaborators.length, 1);
    const perms = workspace.permissions[0];
    assert.false(perms.submissions.all);
    assert.true(perms.submissions.userOnly);
    assert.deepEqual(perms.submissions.submissionIds, [
      'sub-1',
      'sub-2',
      'sub-3',
    ]);
  });

  test('feedback authorizers correctly identified after permission changes', function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions: [
        {
          user: 'user-1',
          global: 'editor',
          feedback: 'none',
          selections: 4,
          comments: 4,
          folders: 3,
          submissions: { all: true },
        },
        {
          user: 'user-2',
          global: 'approver',
          feedback: 'approver',
          selections: 4,
          comments: 4,
          folders: 3,
          submissions: { all: true },
        },
      ],
    });

    // Initial: only user-2 is feedback approver
    assert.deepEqual(workspace.feedbackAuthorizers, ['user-2']);

    // Update user-1 to be feedback approver
    const updatedPerms = workspace.permissions.map((p) =>
      p.user === 'user-1' ? { ...p, feedback: 'approver' } : p
    );
    workspace.set('permissions', updatedPerms);

    // Now both should be feedback authorizers
    assert.deepEqual(workspace.feedbackAuthorizers.sort(), [
      'user-1',
      'user-2',
    ]);
  });

  test('workspace-permissions service canEdit method with permission updates', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = {
      id: 'editor-user',
      isAdmin: false,
      isPdAdmin: false,
    };

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      workspaceType: 'student',
      permissions: [
        {
          user: 'editor-user',
          global: 'editor',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'none',
          submissions: { all: true },
        },
      ],
    });

    const permissionService = this.owner.lookup(
      'service:workspace-permissions'
    );

    // Initially can edit
    assert.true(permissionService.canEdit(workspace, 'selections', 4));

    // Downgrade to viewOnly
    const downgradedPerms = workspace.permissions.map((p) =>
      p.user === 'editor-user' ? { ...p, global: 'viewOnly' } : p
    );
    workspace.set('permissions', downgradedPerms);

    // Now cannot edit
    assert.false(permissionService.canEdit(workspace, 'selections', 1));
  });

  test('permissions survive add-edit-edit-remove cycle', function (assert) {
    const store = this.owner.lookup('service:store');

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions: [
        {
          user: 'user-1',
          global: 'owner',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
          submissions: { all: true, userOnly: false, submissionIds: [] },
        },
      ],
    });

    // Add user-2
    let perms = [
      ...workspace.permissions,
      {
        user: 'user-2',
        global: 'editor',
        selections: 4,
        comments: 4,
        folders: 3,
        feedback: 'none',
        submissions: { all: true, userOnly: false, submissionIds: [] },
      },
    ];
    workspace.set('permissions', perms);
    assert.equal(workspace.collaborators.length, 2);

    // Edit user-2 to have custom selections
    perms = workspace.permissions.map((p) =>
      p.user === 'user-2' ? { ...p, global: 'custom', selections: 2 } : p
    );
    workspace.set('permissions', perms);
    assert.equal(workspace.permissions[1].selections, 2);
    assert.equal(workspace.collaborators.length, 2);

    // Edit user-1 to have different feedback
    perms = workspace.permissions.map((p) =>
      p.user === 'user-1' ? { ...p, feedback: 'none' } : p
    );
    workspace.set('permissions', perms);
    assert.deepEqual(workspace.feedbackAuthorizers, []);

    // Remove user-2
    perms = workspace.permissions.filter((p) => p.user !== 'user-2');
    workspace.set('permissions', perms);
    assert.equal(workspace.collaborators.length, 1);
    assert.equal(workspace.collaborators[0], 'user-1');
  });

  test('multiple collaborators with mixed submission permissions', function (assert) {
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
        {
          user: 'user-2',
          global: 'custom',
          selections: 2,
          comments: 2,
          folders: 1,
          feedback: 'none',
          submissions: {
            all: false,
            userOnly: true,
            submissionIds: ['sub-1', 'sub-2'],
          },
        },
        {
          user: 'user-3',
          global: 'custom',
          selections: 1,
          comments: 1,
          folders: 1,
          feedback: 'none',
          submissions: {
            all: false,
            userOnly: false,
            submissionIds: ['sub-3', 'sub-4', 'sub-5'],
          },
        },
      ],
    });

    // Verify all collaborators
    assert.deepEqual(workspace.collaborators.sort(), [
      'user-1',
      'user-2',
      'user-3',
    ]);

    // Verify only one feedback approver
    assert.deepEqual(workspace.feedbackAuthorizers, ['user-1']);

    // Verify submissions configuration per user
    assert.true(workspace.permissions[0].submissions.all);
    assert.true(workspace.permissions[1].submissions.userOnly);
    assert.equal(workspace.permissions[2].submissions.submissionIds.length, 3);

    // Update user-3 to have custom submissions
    const updated = workspace.permissions.map((p) =>
      p.user === 'user-3'
        ? {
            ...p,
            submissions: { all: true, userOnly: false, submissionIds: [] },
          }
        : p
    );
    workspace.set('permissions', updated);

    assert.true(workspace.permissions[2].submissions.all);
  });

  test('service isFeedbackApprover with dynamic permission updates', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    const permissionService = this.owner.lookup(
      'service:workspace-permissions'
    );

    currentUserService.user = { id: 'mentor-user', isAdmin: false };

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions: [
        {
          user: 'mentor-user',
          global: 'custom',
          feedback: 'none',
          selections: 4,
          comments: 4,
          folders: 3,
          submissions: { all: true },
        },
      ],
    });

    // Initially not an approver
    assert.false(permissionService.isFeedbackApprover(workspace));

    // Promote to approver
    workspace.set('permissions', [
      {
        user: 'mentor-user',
        global: 'custom',
        feedback: 'approver',
        selections: 4,
        comments: 4,
        folders: 3,
        submissions: { all: true },
      },
    ]);

    // Now should be approver
    assert.true(permissionService.isFeedbackApprover(workspace));
  });

  test('large collaborator lists maintain data integrity', function (assert) {
    const store = this.owner.lookup('service:store');

    const permissions = [];
    for (let i = 1; i <= 50; i++) {
      permissions.push({
        user: `user-${i}`,
        global: i % 5 === 0 ? 'approver' : 'editor',
        selections: 4,
        comments: 4,
        folders: 3,
        feedback: i % 5 === 0 ? 'approver' : 'none',
        submissions: { all: true, userOnly: false, submissionIds: [] },
      });
    }

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      permissions,
    });

    // Verify all 50 collaborators
    assert.equal(workspace.collaborators.length, 50);

    // Verify approvers (every 5th user)
    const approverCount = workspace.feedbackAuthorizers.length;
    assert.equal(approverCount, 10); // 50 / 5 = 10

    // Remove user-25 (should be an approver)
    const updated = workspace.permissions.filter((p) => p.user !== 'user-25');
    workspace.set('permissions', updated);

    assert.equal(workspace.collaborators.length, 49);
    assert.equal(workspace.feedbackAuthorizers.length, 9);

    // Add a new approver
    updated.push({
      user: 'user-new-approver',
      global: 'approver',
      selections: 4,
      comments: 4,
      folders: 3,
      feedback: 'approver',
      submissions: { all: true, userOnly: false, submissionIds: [] },
    });
    workspace.set('permissions', updated);

    assert.equal(workspace.collaborators.length, 50);
    assert.equal(workspace.feedbackAuthorizers.length, 10);
  });

  test('permissions update propagates through service permission checks', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    const permissionService = this.owner.lookup(
      'service:workspace-permissions'
    );

    currentUserService.user = {
      id: 'test-user',
      isAdmin: false,
      isPdAdmin: false,
    };

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      workspaceType: 'student',
      permissions: [],
    });

    // No permissions initially
    assert.false(permissionService.canEdit(workspace, 'selections', 1));
    assert.false(permissionService.isFeedbackApprover(workspace));

    // Add permissions for test-user
    workspace.set('permissions', [
      {
        user: 'test-user',
        global: 'custom',
        selections: 4,
        comments: 4,
        folders: 3,
        feedback: 'approver',
        submissions: { all: true },
      },
    ]);

    // Now should have permissions
    assert.true(permissionService.canEdit(workspace, 'selections', 4));
    assert.true(permissionService.isFeedbackApprover(workspace));

    // Downgrade feedback permissions
    workspace.set('permissions', [
      {
        user: 'test-user',
        global: 'custom',
        selections: 4,
        comments: 4,
        folders: 3,
        feedback: 'none',
        submissions: { all: true },
      },
    ]);

    // Edit still works but not feedback approver
    assert.true(permissionService.canEdit(workspace, 'selections', 4));
    assert.false(permissionService.isFeedbackApprover(workspace));
  });

  test('permissions with null/missing submissions are handled correctly', function (assert) {
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
          submissions: null,
        },
        {
          user: 'user-2',
          global: 'editor',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'none',
          // Missing submissions property entirely
        },
      ],
    });

    // Both collaborators should still be accessible
    assert.equal(workspace.collaborators.length, 2);
    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2']);

    // Operations should not fail
    const updated = [
      ...workspace.permissions,
      {
        user: 'user-3',
        global: 'viewOnly',
        selections: 1,
        comments: 1,
        folders: 1,
        feedback: 'none',
        submissions: { all: true },
      },
    ];
    workspace.set('permissions', updated);

    assert.equal(workspace.collaborators.length, 3);
  });
});
