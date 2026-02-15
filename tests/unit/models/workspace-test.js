import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | workspace', function (hooks) {
  setupTest(hooks);

  test('collaborators getter returns array of user IDs', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
      ],
    });

    const collaborators = model.collaborators;
    assert.deepEqual(collaborators, ['user-1', 'user-2', 'user-3']);
  });

  test('collaborators getter returns empty array when permissions is null', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: null,
    });

    const collaborators = model.collaborators;
    assert.deepEqual(collaborators, []);
  });

  test('collaborators getter returns empty array when permissions is undefined', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {});

    const collaborators = model.collaborators;
    assert.deepEqual(collaborators, []);
  });

  test('collaborators getter filters out null/undefined user IDs', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: null, global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
        { user: undefined, global: 'editor', feedback: 'none' },
      ],
    });

    const collaborators = model.collaborators;
    assert.deepEqual(collaborators, ['user-1', 'user-3']);
  });

  test('collaborators getter returns empty array when permissions is empty array', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [],
    });

    const collaborators = model.collaborators;
    assert.deepEqual(collaborators, []);
  });

  test('feedbackAuthorizers getter returns user IDs with feedback=approver', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
      ],
    });

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, ['user-1', 'user-3']);
  });

  test('feedbackAuthorizers getter returns empty array when no approvers', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'none' },
        { user: 'user-2', global: 'viewOnly', feedback: 'none' },
      ],
    });

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, []);
  });

  test('feedbackAuthorizers getter returns empty array when permissions is null', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: null,
    });

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, []);
  });

  test('feedbackAuthorizers getter returns empty array when permissions is undefined', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {});

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, []);
  });

  test('feedbackAuthorizers getter returns empty array when permissions is empty array', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [],
    });

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, []);
  });

  test('feedbackAuthorizers getter filters out null/undefined user IDs', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: null, global: 'viewOnly', feedback: 'approver' },
        { user: 'user-3', global: 'editor', feedback: 'approver' },
        { user: undefined, global: 'editor', feedback: 'approver' },
      ],
    });

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, ['user-1', 'user-3']);
  });

  test('feedback value is case-sensitive (must be exactly "approver")', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
        { user: 'user-2', global: 'viewOnly', feedback: 'Approver' }, // Wrong case
        { user: 'user-3', global: 'editor', feedback: 'APPROVER' }, // Wrong case
      ],
    });

    const authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, ['user-1']);
  });

  test('collaborators is a live computed property', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
      ],
    });

    let collaborators = model.collaborators;
    assert.deepEqual(collaborators, ['user-1']);

    // Modify permissions
    model.permissions = [
      { user: 'user-1', global: 'approver', feedback: 'approver' },
      { user: 'user-2', global: 'viewOnly', feedback: 'none' },
    ];

    collaborators = model.collaborators;
    assert.deepEqual(collaborators, ['user-1', 'user-2']);
  });

  test('feedbackAuthorizers is a live computed property', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('workspace', {
      permissions: [
        { user: 'user-1', global: 'approver', feedback: 'approver' },
      ],
    });

    let authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, ['user-1']);

    // Modify permissions
    model.permissions = [
      { user: 'user-1', global: 'approver', feedback: 'none' },
      { user: 'user-2', global: 'viewOnly', feedback: 'approver' },
    ];

    authorizers = model.feedbackAuthorizers;
    assert.deepEqual(authorizers, ['user-2']);
  });

  test('collaborators and feedbackAuthorizers work with plain JS arrays', function (assert) {
    let store = this.owner.lookup('service:store');

    // Simulate what the transform returns - plain JS arrays, not Ember Arrays
    const plainPermissions = [
      { user: 'user-1', global: 'approver', feedback: 'approver' },
      { user: 'user-2', global: 'viewOnly', feedback: 'none' },
      { user: 'user-3', global: 'editor', feedback: 'approver' },
    ];

    let model = store.createRecord('workspace', {
      permissions: plainPermissions,
    });

    const collaborators = model.collaborators;
    const authorizers = model.feedbackAuthorizers;

    assert.ok(Array.isArray(collaborators), 'collaborators is an array');
    assert.ok(Array.isArray(authorizers), 'feedbackAuthorizers is an array');
    assert.deepEqual(collaborators, ['user-1', 'user-2', 'user-3']);
    assert.deepEqual(authorizers, ['user-1', 'user-3']);
  });
});
