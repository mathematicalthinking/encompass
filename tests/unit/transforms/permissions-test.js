import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import PermissionsTransform from 'encompass/transforms/permissions';

module('Unit | Transform | permissions', function (hooks) {
  setupTest(hooks);

  let transform;

  hooks.beforeEach(function () {
    transform = new PermissionsTransform();
  });

  module('deserialize', function () {
    test('returns empty array for null', function (assert) {
      const result = transform.deserialize(null);
      assert.deepEqual(result, [], 'returns empty array for null');
    });

    test('returns empty array for non-array', function (assert) {
      const result = transform.deserialize({});
      assert.deepEqual(result, [], 'returns empty array for object');
    });

    test('cleans permission objects', function (assert) {
      const input = [
        {
          user: 'user-1',
          global: 'approver',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'approver',
          submissions: { all: true, userOnly: false, submissionIds: [] },
          unwantedProp: 'should be removed',
        },
      ];

      const result = transform.deserialize(input);

      assert.equal(result.length, 1, 'returns array with one object');
      assert.deepEqual(result[0], {
        user: 'user-1',
        global: 'approver',
        selections: 4,
        comments: 4,
        folders: 3,
        feedback: 'approver',
        submissions: { all: true, userOnly: false, submissionIds: [] },
      });
      assert.notOk(result[0].unwantedProp, 'unwanted properties removed');
    });

    test('cleans submissions sub-objects', function (assert) {
      const input = [
        {
          user: 'user-1',
          global: 'viewOnly',
          selections: 1,
          comments: 1,
          folders: 1,
          feedback: 'none',
          submissions: {
            all: false,
            userOnly: true,
            submissionIds: ['sub-1', 'sub-2'],
            embeddedStore: {}, // Should be removed
          },
        },
      ];

      const result = transform.deserialize(input);

      assert.deepEqual(result[0].submissions, {
        all: false,
        userOnly: true,
        submissionIds: ['sub-1', 'sub-2'],
      });
      assert.notOk(
        result[0].submissions.embeddedStore,
        'embedded store removed'
      );
    });

    test('handles missing submissions object', function (assert) {
      const input = [
        {
          user: 'user-1',
          global: 'viewOnly',
          selections: 1,
          comments: 1,
          folders: 1,
          feedback: 'none',
        },
      ];

      const result = transform.deserialize(input);

      assert.deepEqual(result[0].submissions, {
        all: false,
        userOnly: false,
        submissionIds: [],
      });
    });

    test('converts array submission IDs to plain array', function (assert) {
      // Simulate an Ember Array
      const emberArray = ['sub-1', 'sub-2'];
      emberArray.isArray = true; // Ember Array marker

      const input = [
        {
          user: 'user-1',
          global: 'viewOnly',
          selections: 1,
          comments: 1,
          folders: 1,
          feedback: 'none',
          submissions: {
            all: false,
            userOnly: false,
            submissionIds: emberArray,
          },
        },
      ];

      const result = transform.deserialize(input);

      assert.deepEqual(result[0].submissions.submissionIds, ['sub-1', 'sub-2']);
      assert.notOk(
        result[0].submissions.submissionIds.isArray,
        'isArray marker removed'
      );
    });
  });

  module('serialize', function () {
    test('returns empty array for null', function (assert) {
      const result = transform.serialize(null);
      assert.deepEqual(result, [], 'returns empty array for null');
    });

    test('cleans permission objects same as deserialize', function (assert) {
      const input = [
        {
          user: 'user-1',
          global: 'editor',
          selections: 4,
          comments: 4,
          folders: 3,
          feedback: 'none',
          submissions: { all: true, userOnly: false, submissionIds: [] },
          emberInternalProp: { circular: 'reference' },
        },
      ];

      const result = transform.serialize(input);

      assert.equal(result.length, 1);
      assert.notOk(result[0].emberInternalProp, 'internal props removed');
    });

    test('boolean values are normalized', function (assert) {
      const input = [
        {
          user: 'user-1',
          global: 'viewOnly',
          selections: 1,
          comments: 1,
          folders: 1,
          feedback: 'none',
          submissions: {
            all: 1, // Truthy but not boolean
            userOnly: 0, // Falsy but not boolean
            submissionIds: [],
          },
        },
      ];

      const result = transform.serialize(input);

      assert.strictEqual(
        result[0].submissions.all,
        true,
        'converts truthy to boolean'
      );
      assert.strictEqual(
        result[0].submissions.userOnly,
        false,
        'converts falsy to boolean'
      );
    });
  });
});
