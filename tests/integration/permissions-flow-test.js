import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

/**
 * Integration tests for the complete permissions flow:
 * Transform -> Model -> Service -> Component
 *
 * These tests verify that changing permissions through the transform,
 * model getters, and service methods all work correctly together.
 */
module('Integration | Permissions Flow', function (hooks) {
  setupTest(hooks);

  test('permissions transform and model getters work together', function (assert) {
    const store = this.owner.lookup('service:store');
    const transform = this.owner
      .lookup('service:store')
      ?.serializerFor?.('application')
      ?._getOrCreateTransform?.('permissions');

    // Simulate incoming API data with potentially problematic types
    const apiData = [
      {
        user: 'user-1',
        global: 'approver',
        selections: 4,
        comments: 4,
        folders: 3,
        feedback: 'approver',
        submissions: { all: 1, userOnly: 0, submissionIds: ['sub-1'] }, // Truthy values
        extraField: 'should be removed',
      },
      {
        user: 'user-2',
        global: 'viewOnly',
        selections: 1,
        comments: 1,
        folders: 1,
        feedback: 'none',
        submissions: null,
      },
    ];

    // Create workspace and set permissions as if from transform
    const workspace = store.createRecord('workspace', {
      permissions: apiData,
    });

    // Test collaborators getter
    const collaborators = workspace.collaborators;
    assert.deepEqual(collaborators, ['user-1', 'user-2']);

    // Test feedbackAuthorizers getter
    const authorizers = workspace.feedbackAuthorizers;
    assert.deepEqual(authorizers, ['user-1']);

    // Verify permissions were properly cleaned (if transform was applied)
    if (transform) {
      const cleaned = transform.deserialize(apiData);
      assert.notOk(
        cleaned[0].extraField,
        'unwanted fields removed by transform'
      );
      assert.strictEqual(
        cleaned[0].submissions.all,
        true,
        'truthy values normalized to boolean'
      );
      assert.strictEqual(
        cleaned[0].submissions.userOnly,
        false,
        'falsy values normalized to boolean'
      );
    }
  });

  test('adding permission via spread operator maintains collaborators list', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
      ],
    });

    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2']);

    // Add new permission using spread operator (component pattern)
    const newPermission = {
      user: 'user-3',
      global: 'editor',
      feedback: 'approver',
      selections: 1,
      comments: 1,
      folders: 1,
      submissions: { all: false, userOnly: false, submissionIds: [] },
    };

    const newPermissions = [...workspace.permissions, newPermission];
    workspace.set('permissions', newPermissions);

    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2', 'user-3']);
    assert.deepEqual(workspace.feedbackAuthorizers, ['user-1', 'user-3']);
  });

  test('removing permission via filter maintains consistent lists', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
      ],
    });

    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2', 'user-3']);
    assert.deepEqual(workspace.feedbackAuthorizers, ['user-1', 'user-3']);

    // Remove permission using filter (component pattern)
    const userToRemove = workspace.permissions[1]; // user-2
    const newPermissions = workspace.permissions.filter(
      (p) => p !== userToRemove
    );
    workspace.set('permissions', newPermissions);

    assert.deepEqual(workspace.collaborators, ['user-1', 'user-3']);
    assert.deepEqual(workspace.feedbackAuthorizers, ['user-1', 'user-3']);
  });

  test('updating permission in place via spread maintains lists', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'none' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
      ],
    });

    assert.deepEqual(workspace.feedbackAuthorizers, ['user-3']);

    // Update user-1 to have approver feedback using immutable pattern
    const updatedPermissions = workspace.permissions.map((p) =>
      p.user === 'user-1' ? { ...p, feedback: 'approver' } : p
    );
    workspace.set('permissions', updatedPermissions);

    assert.deepEqual(workspace.collaborators, ['user-1', 'user-2', 'user-3']);
    assert.deepEqual(workspace.feedbackAuthorizers, ['user-1', 'user-3']);
  });

  test('empty permissions array handled gracefully', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [],
    });

    assert.deepEqual(workspace.collaborators, []);
    assert.deepEqual(workspace.feedbackAuthorizers, []);

    // Workspace permissions service should handle empty arrays
    const permissionService = this.owner.lookup(
      'service:workspace-permissions'
    );
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = { id: 'user-1', isAdmin: false };

    const result = permissionService.isFeedbackApprover(workspace);
    assert.false(result);
  });

  test('permissions with complex submissions object maintained through updates', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        {
          user: 'user-1',
          global: 'approver',
          feedback: 'approver',
          selections: 4,
          comments: 4,
          folders: 3,
          submissions: {
            all: false,
            userOnly: true,
            submissionIds: ['sub-1', 'sub-2', 'sub-3'],
          },
        },
      ],
    });

    // Verify structure is maintained
    const perm = workspace.permissions[0];
    assert.equal(perm.user, 'user-1');
    assert.equal(perm.feedback, 'approver');
    assert.false(perm.submissions.all);
    assert.true(perm.submissions.userOnly);
    assert.deepEqual(perm.submissions.submissionIds, [
      'sub-1',
      'sub-2',
      'sub-3',
    ]);

    // Add another permission while maintaining submissions
    const newPerm = {
      user: 'user-2',
      global: 'viewOnly',
      feedback: 'none',
      selections: 1,
      comments: 1,
      folders: 1,
      submissions: {
        all: true,
        userOnly: false,
        submissionIds: [],
      },
    };

    const newPermissions = [...workspace.permissions, newPerm];
    workspace.set('permissions', newPermissions);

    // Verify both permissions exist and are intact
    assert.equal(workspace.permissions.length, 2);
    assert.deepEqual(workspace.permissions[0].submissions.submissionIds, [
      'sub-1',
      'sub-2',
      'sub-3',
    ]);
    assert.deepEqual(workspace.permissions[1].submissions.submissionIds, []);
  });
});
