import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Route | assignments/assignment', function (hooks) {
  setupTest(hooks);

  // The API only sends back records the current user may see, so asking for a
  // classmate's workspace rejects. Simulate that with a getter so the test can
  // also assert the relationship was never touched.
  function buildAssignment(reads) {
    return {
      id: 'a1',
      section: Promise.resolve({ id: 's1' }),
      problem: Promise.resolve({ id: 'p1' }),
      answers: Promise.resolve(['answer-1']),
      get students() {
        reads.push('students');
        return Promise.reject(new Error('403'));
      },
      get linkedWorkspaces() {
        reads.push('linkedWorkspaces');
        return Promise.reject(new Error('403'));
      },
      get parentWorkspace() {
        reads.push('parentWorkspace');
        return Promise.reject(new Error('403'));
      },
    };
  }

  function registerStubs(owner, { isStudent, assignment }) {
    const queries = [];

    owner.register(
      'service:current-user',
      class extends Service {
        isStudent = isStudent;
      }
    );

    owner.register(
      'service:store',
      class extends Service {
        findRecord() {
          return Promise.resolve(assignment);
        }
        query(modelName, params) {
          queries.push({ modelName, params });
          return Promise.resolve(['group-1']);
        }
      }
    );

    return queries;
  }

  test('a student gets the assignment without the teacher-only data', async function (assert) {
    const reads = [];
    const assignment = buildAssignment(reads);
    const queries = registerStubs(this.owner, {
      isStudent: true,
      assignment,
    });
    const route = this.owner.lookup('route:assignments/assignment');

    const model = await route.model({ assignment_id: 'a1' });

    assert.strictEqual(model.assignment, assignment, 'the assignment resolves');
    assert.deepEqual(model.answers, ['answer-1'], 'own answers are loaded');
    assert.deepEqual(model.currentSection, { id: 's1' }, 'section is loaded');
    assert.deepEqual(model.currentProblem, { id: 'p1' }, 'problem is loaded');
    assert.deepEqual(
      reads,
      [],
      'the workspaces and roster a student cannot read are never requested'
    );
    assert.deepEqual(queries, [], 'groups are not queried for a student');
    assert.deepEqual(model.linkedWorkspaces, []);
    assert.deepEqual(model.students, []);
    assert.strictEqual(model.parentWorkspace, null);
    assert.true(model.isStudent);
  });

  test('a teacher still gets the teacher-only data', async function (assert) {
    const assignment = {
      id: 'a1',
      section: Promise.resolve({ id: 's1' }),
      problem: Promise.resolve({ id: 'p1' }),
      answers: Promise.resolve(['answer-1']),
      students: Promise.resolve(['student-1']),
      linkedWorkspaces: Promise.resolve(['workspace-1']),
      parentWorkspace: Promise.resolve({ id: 'w0' }),
    };
    const queries = registerStubs(this.owner, {
      isStudent: false,
      assignment,
    });
    const route = this.owner.lookup('route:assignments/assignment');

    const model = await route.model({ assignment_id: 'a1' });

    assert.deepEqual(model.students, ['student-1']);
    assert.deepEqual(model.linkedWorkspaces, ['workspace-1']);
    assert.deepEqual(model.parentWorkspace, { id: 'w0' });
    assert.deepEqual(model.groups, ['group-1']);
    assert.deepEqual(
      queries,
      [{ modelName: 'group', params: { section: 's1', isTrashed: false } }],
      'groups are queried for the assignment section'
    );
    assert.false(model.isStudent);
  });

  test('an unreadable workspace does not take down the whole page', async function (assert) {
    const reads = [];
    const assignment = buildAssignment(reads);
    registerStubs(this.owner, { isStudent: false, assignment });
    const route = this.owner.lookup('route:assignments/assignment');

    const model = await route.model({ assignment_id: 'a1' });

    assert.strictEqual(model.assignment, assignment, 'the page still loads');
    assert.deepEqual(model.linkedWorkspaces, [], 'falls back to an empty list');
    assert.deepEqual(model.students, []);
    assert.strictEqual(model.parentWorkspace, null);
  });
});
