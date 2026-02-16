import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | workspace-permissions', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:workspace-permissions');
  });

  test('isFeedbackApprover returns true when user is in feedbackAuthorizers', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
      ],
    });

    // Stub current user to match one of the feedback authorizers
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = { id: 'user-1', isAdmin: false };

    const result = this.service.isFeedbackApprover(workspace);
    assert.true(result);
  });

  test('isFeedbackApprover returns false when user is not in feedbackAuthorizers', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
      ],
    });

    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = { id: 'user-99', isAdmin: false };

    const result = this.service.isFeedbackApprover(workspace);
    assert.false(result);
  });

  test('isFeedbackApprover returns false when workspace is null', function (assert) {
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = { id: 'user-1', isAdmin: false };

    const result = this.service.isFeedbackApprover(null);
    assert.false(result);
  });

  test('isFeedbackApprover returns false when workspace has no approvers', function (assert) {
    const store = this.owner.lookup('service:store');
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'none' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
      ],
    });

    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = { id: 'user-1', isAdmin: false };

    const result = this.service.isFeedbackApprover(workspace);
    assert.false(result);
  });

  test('isFeedbackApprover works with plain JS arrays from transform', function (assert) {
    const store = this.owner.lookup('service:store');

    // Create workspace with plain JS permissions array (no mapBy method)
    const workspace = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
      ],
    });

    // Can't test if mapBy exists because Ember Data may wrap it,
    // but we CAN verify the service works correctly with it
    const authorizers = workspace.feedbackAuthorizers;
    assert.ok(
      Array.isArray(authorizers),
      'feedbackAuthorizers returns an array'
    );

    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = { id: 'user-3', isAdmin: false };

    const result = this.service.isFeedbackApprover(workspace);
    assert.true(result);
  });

  test('canEdit finds user permissions with plain JS arrays', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = {
      id: 'user-1',
      isAdmin: false,
      isPdAdmin: false,
    };

    const workspace = store.createRecord('workspace', {
      workspaceType: 'student',
      permissions: [
        {
          user: 'user-1',
          global: 'editor',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
          submissions: { all: true },
        },
        {
          user: 'user-2',
          global: 'viewOnly',
          selections: 1,
          comments: 1,
          folders: 1,
          feedback: 'none',
          submissions: { all: false },
        },
      ],
    });

    // User-1 has editor privileges
    assert.true(this.service.canEdit(workspace, 'selections', 4));
    assert.true(this.service.canEdit(workspace, 'comments', 4));
    assert.true(this.service.canEdit(workspace, 'folders', 3));
  });

  test('canEdit returns false when user not in permissions', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = {
      id: 'user-99',
      isAdmin: false,
      isPdAdmin: false,
    };

    const workspace = store.createRecord('workspace', {
      workspaceType: 'student',
      permissions: [
        {
          user: 'user-1',
          global: 'editor',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
        },
      ],
    });

    assert.false(this.service.canEdit(workspace, 'selections', 1));
  });

  test('canEdit handles null permissions array', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = {
      id: 'user-1',
      isAdmin: false,
      isPdAdmin: false,
    };

    const workspace = store.createRecord('workspace', {
      workspaceType: 'student',
      permissions: null,
    });

    assert.false(this.service.canEdit(workspace, 'selections', 1));
  });

  test('canEdit respects global permission levels', function (assert) {
    const store = this.owner.lookup('service:store');
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user = {
      id: 'user-1',
      isAdmin: false,
      isPdAdmin: false,
    };

    const viewOnlyWorkspace = store.createRecord('workspace', {
      workspaceType: 'student',
      permissions: [
        {
          user: 'user-1',
          global: 'viewOnly',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
        },
      ],
    });

    // Even with custom permissions set, viewOnly global prevents editing
    assert.false(this.service.canEdit(viewOnlyWorkspace, 'selections', 1));
  });
});
