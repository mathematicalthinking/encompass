import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setOwner } from '@ember/application';

module('Unit | Component | submission-group', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:utility-methods',
      class {
        getHasManyIds() {
          return [];
        }
      }
    );

    this.owner.register(
      'service:navigation',
      class {
        toSubmission() {}
      }
    );
  });

  function createSubmission(id, student, createDate) {
    return {
      id,
      student,
      createDate: new Date(createDate),
      studentDisplayName: `Student ${student}`,
    };
  }

  function setupComponent(context, submissions, currentSubmission) {
    const SubmissionGroupComponent = context.owner.factoryFor(
      'component:submission-group'
    ).class;

    // Instantiate Glimmer component without constructor
    const component = Object.create(SubmissionGroupComponent.prototype);
    setOwner(component, context.owner);

    // Set component args for the getters to access
    component.args = {
      submissions,
      submission: currentSubmission,
    };

    return component;
  }

  module('prevThread getter', function () {
    test('returns undefined when currentThread is empty', function (assert) {
      const submissions = [];
      const current = createSubmission('1', 'maria', '2024-01-01');
      const component = setupComponent(this, submissions, current);

      assert.strictEqual(
        component.prevThread,
        undefined,
        'prevThread returns undefined when no submissions exist'
      );
    });

    test('navigates to previous student when at latest revision', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
        createSubmission('3', 'diego', '2024-01-03'),
      ];

      // Current is carlos's submission (at latest)
      const component = setupComponent(this, submissions, submissions[1]);

      assert.strictEqual(
        component.prevThread.id,
        '1',
        'prevThread returns maria (previous student)'
      );
    });

    test('wraps around to last student when at first student', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
        createSubmission('3', 'diego', '2024-01-03'),
      ];

      // Current is maria's submission
      const component = setupComponent(this, submissions, submissions[0]);

      assert.strictEqual(
        component.prevThread.id,
        '3',
        'prevThread wraps around to diego (last student)'
      );
    });

    test('navigates to next revision within same student thread', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
        createSubmission('4', 'carlos', '2024-01-04'),
      ];

      // Current is maria's first revision
      const component = setupComponent(this, submissions, submissions[0]);

      assert.strictEqual(
        component.prevThread.id,
        '2',
        'prevThread returns next revision (id 2) within maria thread'
      );
    });

    test('navigates to next revision from middle revision', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
        createSubmission('4', 'carlos', '2024-01-04'),
      ];

      // Current is maria's middle revision
      const component = setupComponent(this, submissions, submissions[1]);

      assert.strictEqual(
        component.prevThread.id,
        '3',
        'prevThread returns next revision (id 3) from middle revision'
      );
    });

    test('navigates to previous student when at latest of multi-revision thread', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
        createSubmission('4', 'carlos', '2024-01-04'),
      ];

      // Current is maria's latest revision
      const component = setupComponent(this, submissions, submissions[2]);

      assert.strictEqual(
        component.prevThread.id,
        '4',
        'prevThread navigates to carlos when at latest of maria thread'
      );
    });

    test('handles single submission for single student', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];

      const component = setupComponent(this, submissions, submissions[0]);

      assert.strictEqual(
        component.prevThread.id,
        '1',
        'prevThread returns same submission (wraparound with one student)'
      );
    });

    test('handles complex multi-student multi-revision scenario', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'carlos', '2024-01-03'),
        createSubmission('4', 'diego', '2024-01-04'),
        createSubmission('5', 'diego', '2024-01-05'),
        createSubmission('6', 'diego', '2024-01-06'),
      ];

      // Test from diego's first revision
      let component = setupComponent(this, submissions, submissions[3]);
      assert.strictEqual(
        component.prevThread.id,
        '5',
        'From diego rev 1, goes to rev 2'
      );

      // Test from diego's middle revision
      component = setupComponent(this, submissions, submissions[4]);
      assert.strictEqual(
        component.prevThread.id,
        '6',
        'From diego rev 1, goes to rev 2'
      );

      // Test from diego's latest revision
      component = setupComponent(this, submissions, submissions[5]);
      assert.strictEqual(
        component.prevThread.id,
        '3',
        'From diego latest, goes to carlos (prev student)'
      );

      // Test from carlos (single revision)
      component = setupComponent(this, submissions, submissions[2]);
      assert.strictEqual(
        component.prevThread.id,
        '2',
        'From carlos, goes to maria latest (prev student)'
      );

      // Test from maria's first revision
      component = setupComponent(this, submissions, submissions[0]);
      assert.strictEqual(
        component.prevThread.id,
        '2',
        'From maria rev 1, goes to rev 2'
      );

      // Test from maria's latest revision
      component = setupComponent(this, submissions, submissions[1]);
      assert.strictEqual(
        component.prevThread.id,
        '6',
        'From maria latest, wraps to diego latest (wraparound)'
      );
    });
  });

  module('nextThread getter', function () {
    test('returns undefined when currentThread is empty', function (assert) {
      const submissions = [];
      const current = createSubmission('1', 'maria', '2024-01-01');
      const component = setupComponent(this, submissions, current);

      assert.strictEqual(
        component.nextThread,
        undefined,
        'nextThread returns undefined when no submissions exist'
      );
    });

    test('navigates to next student when at first revision', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
        createSubmission('3', 'diego', '2024-01-03'),
      ];

      // Current is carlos's submission (single revision)
      const component = setupComponent(this, submissions, submissions[1]);

      assert.strictEqual(
        component.nextThread.id,
        '3',
        'nextThread returns diego (next student)'
      );
    });

    test('wraps around to first student when at last student', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
        createSubmission('3', 'diego', '2024-01-03'),
      ];

      // Current is diego's submission
      const component = setupComponent(this, submissions, submissions[2]);

      assert.strictEqual(
        component.nextThread.id,
        '1',
        'nextThread wraps around to maria (first student)'
      );
    });

    test('navigates to previous revision within same student thread', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
        createSubmission('4', 'carlos', '2024-01-04'),
      ];

      // Current is maria's latest revision
      const component = setupComponent(this, submissions, submissions[2]);

      assert.strictEqual(
        component.nextThread.id,
        '2',
        'nextThread returns previous revision (id 2) within maria thread'
      );
    });

    test('navigates to previous revision from middle revision', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
        createSubmission('4', 'carlos', '2024-01-04'),
      ];

      // Current is maria's middle revision
      const component = setupComponent(this, submissions, submissions[1]);

      assert.strictEqual(
        component.nextThread.id,
        '1',
        'nextThread returns previous revision (id 1) from middle revision'
      );
    });

    test('navigates to next student when at first of multi-revision thread', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
        createSubmission('4', 'carlos', '2024-01-04'),
      ];

      // Current is maria's first revision
      const component = setupComponent(this, submissions, submissions[0]);

      assert.strictEqual(
        component.nextThread.id,
        '4',
        'nextThread navigates to carlos when at first of maria thread'
      );
    });

    test('handles single submission for single student', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];

      const component = setupComponent(this, submissions, submissions[0]);

      assert.strictEqual(
        component.nextThread.id,
        '1',
        'nextThread returns same submission (wraparound with one student)'
      );
    });

    test('handles complex multi-student multi-revision scenario', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'carlos', '2024-01-03'),
        createSubmission('4', 'diego', '2024-01-04'),
        createSubmission('5', 'diego', '2024-01-05'),
        createSubmission('6', 'diego', '2024-01-06'),
      ];

      // Test from diego's latest revision
      let component = setupComponent(this, submissions, submissions[5]);
      assert.strictEqual(
        component.nextThread.id,
        '5',
        'From diego rev 1, goes to rev 2'
      );

      // Test from diego's middle revision
      component = setupComponent(this, submissions, submissions[4]);
      assert.strictEqual(
        component.nextThread.id,
        '4',
        'From diego rev 2, goes to rev 3'
      );

      // Test from diego's first revision
      component = setupComponent(this, submissions, submissions[3]);
      assert.strictEqual(
        component.nextThread.id,
        '2',
        'From diego first, wraps to maria latest'
      );

      // Test from carlos (single revision)
      component = setupComponent(this, submissions, submissions[2]);
      assert.strictEqual(
        component.nextThread.id,
        '6',
        'From carlos, goes to diego latest'
      );

      // Test from maria's latest revision
      component = setupComponent(this, submissions, submissions[1]);
      assert.strictEqual(
        component.nextThread.id,
        '1',
        'From maria latest, goes to maria first'
      );

      // Test from maria's first revision
      component = setupComponent(this, submissions, submissions[0]);
      assert.strictEqual(
        component.nextThread.id,
        '3',
        'From maria first, goes to carlos'
      );
    });
  });

  module('prevThread and nextThread symmetry', function () {
    test('navigating prev then next returns to original when both are within thread', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
      ];

      // From middle revision, prev then next should return
      const component = setupComponent(this, submissions, submissions[1]);
      const prev = component.prevThread; // Should go to submission 3 (newer)
      const componentAtPrev = setupComponent(this, submissions, prev);
      const backToOriginal = componentAtPrev.nextThread; // Should go back to submission 2

      assert.strictEqual(
        backToOriginal.id,
        '2',
        'prev->next returns to original within thread'
      );
    });

    test('navigating next then prev returns to original when both are within thread', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
      ];

      // From middle revision, next then prev should return
      const component = setupComponent(this, submissions, submissions[1]);
      const next = component.nextThread; // Should go to submission 1 (older)
      const componentAtNext = setupComponent(this, submissions, next);
      const backToOriginal = componentAtNext.prevThread; // Should go back to submission 2

      assert.strictEqual(
        backToOriginal.id,
        '2',
        'next->prev returns to original within thread'
      );
    });
  });

  module('edge cases', function () {
    test('handles undefined submission', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
      ];

      const component = setupComponent(this, submissions, undefined);

      assert.strictEqual(
        component.prevThread,
        undefined,
        'prevThread returns undefined when current submission is undefined'
      );

      assert.strictEqual(
        component.nextThread,
        undefined,
        'nextThread returns undefined when current submission is undefined'
      );
    });

    test('handles null submission', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
      ];

      const component = setupComponent(this, submissions, null);

      assert.strictEqual(
        component.prevThread,
        undefined,
        'prevThread returns undefined when current submission is null'
      );

      assert.strictEqual(
        component.nextThread,
        undefined,
        'nextThread returns undefined when current submission is null'
      );
    });

    test('handles submission not in array', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'carlos', '2024-01-02'),
      ];

      const orphanSubmission = createSubmission('99', 'orphan', '2024-01-03');
      const component = setupComponent(this, submissions, orphanSubmission);

      assert.strictEqual(
        component.prevThread,
        undefined,
        'prevThread returns undefined when submission not in array'
      );

      assert.strictEqual(
        component.nextThread,
        undefined,
        'nextThread returns undefined when submission not in array'
      );
    });

    test('handles empty submissions array', function (assert) {
      const submissions = [];
      const current = createSubmission('1', 'maria', '2024-01-01');
      const component = setupComponent(this, submissions, current);

      assert.strictEqual(
        component.prevThread,
        undefined,
        'prevThread returns undefined with empty submissions'
      );

      assert.strictEqual(
        component.nextThread,
        undefined,
        'nextThread returns undefined with empty submissions'
      );
    });

    test('handles large number of students and revisions', function (assert) {
      const submissions = [];
      // Create 10 students with 5 revisions each
      for (let student = 0; student < 10; student++) {
        for (let rev = 0; rev < 5; rev++) {
          submissions.push(
            createSubmission(
              `${student}-${rev}`,
              `student${student}`,
              `2024-01-${String(student * 5 + rev + 1).padStart(2, '0')}`
            )
          );
        }
      }

      // Test navigation from middle of a thread
      const middleSubmission = submissions[12]; // student2, revision 2
      const component = setupComponent(this, submissions, middleSubmission);

      assert.ok(component.prevThread, 'prevThread exists for large dataset');
      assert.ok(component.nextThread, 'nextThread exists for large dataset');

      // Verify it navigates within the thread
      assert.strictEqual(
        component.prevThread.student,
        'student2',
        'prevThread navigates within same student'
      );
      assert.strictEqual(
        component.nextThread.student,
        'student2',
        'nextThread navigates within same student'
      );
    });
  });

  module('layout getters', function () {
    test('isFirstChild returns true only for hsc layout', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      const component = setupComponent(this, submissions, submissions[0]);
      component.args.containerLayoutClass = 'hsc';

      assert.true(component.isFirstChild, 'hsc layout is first child');
      assert.false(component.isLastChild, 'hsc is not last child');
      assert.false(component.isOnlyChild, 'hsc is not only child');
    });

    test('isLastChild returns true only for fsh layout', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      const component = setupComponent(this, submissions, submissions[0]);
      component.args.containerLayoutClass = 'fsh';

      assert.true(component.isLastChild, 'fsh layout is last child');
      assert.false(component.isFirstChild, 'fsh is not first child');
      assert.false(component.isOnlyChild, 'fsh is not only child');
    });

    test('isOnlyChild returns true only for hsh layout', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      const component = setupComponent(this, submissions, submissions[0]);
      component.args.containerLayoutClass = 'hsh';

      assert.true(component.isOnlyChild, 'hsh layout is only child');
      assert.false(component.isFirstChild, 'hsh is not first child');
      assert.false(component.isLastChild, 'hsh is not last child');
    });

    test('isBipaneled returns true for first or last child', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      const component = setupComponent(this, submissions, submissions[0]);

      component.args.containerLayoutClass = 'hsc';
      assert.true(component.isBipaneled, 'hsc (first child) is bipaneled');

      component.args.containerLayoutClass = 'fsh';
      assert.true(component.isBipaneled, 'fsh (last child) is bipaneled');

      component.args.containerLayoutClass = 'other';
      assert.false(component.isBipaneled, 'other layout is not bipaneled');
    });

    test('isTripaneled returns true only for fsc layout', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      const component = setupComponent(this, submissions, submissions[0]);
      component.args.containerLayoutClass = 'fsc';

      assert.true(component.isTripaneled, 'fsc layout is tripaneled');
    });
  });

  module('student navigation', function () {
    test('studentSelectOptions returns all students with their latest submission IDs', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'carlos', '2024-01-03'),
        createSubmission('4', 'diego', '2024-01-04'),
      ];
      const component = setupComponent(this, submissions, submissions[0]);
      const options = component.studentSelectOptions;

      assert.strictEqual(options.length, 3, 'has 3 students');
      assert.deepEqual(
        options.map((o) => o.name),
        ['Student carlos', 'Student diego', 'Student maria'],
        'student names in order'
      );
      assert.deepEqual(
        options.map((o) => o.id),
        ['3', '4', '2'],
        'latest submission IDs for each student'
      );
    });

    test('initialStudentItem returns current student latest submission ID', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'carlos', '2024-01-03'),
      ];
      const component = setupComponent(this, submissions, submissions[0]);

      assert.deepEqual(
        component.initialStudentItem,
        ['2'],
        'returns maria latest submission ID when at maria'
      );
    });

    test('onStudentSelect finds and uses selected submission ID', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'carlos', '2024-01-03'),
      ];
      let navigatedTo = null;
      const component = setupComponent(this, submissions, submissions[0]);
      // Mock navigation on the component instance
      component.navigation = {
        toSubmission: (id) => {
          navigatedTo = id;
        },
      };

      component.onStudentSelect('3');

      assert.strictEqual(navigatedTo, '3', 'navigates to selected submission');
    });
  });

  module('revision data', function () {
    test('currentRevisions formats submissions with indices and labels', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
      ];
      const component = setupComponent(this, submissions, submissions[0]);
      const revisions = component.currentRevisions;

      assert.strictEqual(revisions.length, 3, 'has 3 revisions');
      assert.strictEqual(revisions[0].index, 1, 'first has index 1');
      assert.strictEqual(revisions[1].index, 2, 'second has index 2');
      assert.strictEqual(revisions[2].index, 3, 'third has index 3');
      assert.ok(revisions[0].label, 'revision has date label');
      assert.strictEqual(
        revisions[0].revision.id,
        '1',
        'revision object is correct'
      );
    });

    test('currentRevisionIndex returns index of current submission', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
        createSubmission('3', 'maria', '2024-01-03'),
      ];

      let component = setupComponent(this, submissions, submissions[0]);
      assert.strictEqual(
        component.currentRevisionIndex,
        1,
        'index 1 for first submission'
      );

      component = setupComponent(this, submissions, submissions[1]);
      assert.strictEqual(
        component.currentRevisionIndex,
        2,
        'index 2 for second submission'
      );

      component = setupComponent(this, submissions, submissions[2]);
      assert.strictEqual(
        component.currentRevisionIndex,
        3,
        'index 3 for third submission'
      );
    });

    test('currentRevision returns correct revision object', function (assert) {
      const submissions = [
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
      ];

      let component = setupComponent(this, submissions, submissions[0]);
      assert.strictEqual(
        component.currentRevision.revision.id,
        '1',
        'current revision is first submission'
      );

      component = setupComponent(this, submissions, submissions[1]);
      assert.strictEqual(
        component.currentRevision.revision.id,
        '2',
        'current revision is second submission'
      );
    });
  });

  module('sorting and indexing', function () {
    test('sortedSubmissions sorts by student then by date descending', function (assert) {
      const submissions = [
        createSubmission('3', 'carlos', '2024-01-03'),
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('4', 'carlos', '2024-01-04'),
        createSubmission('2', 'maria', '2024-01-02'),
      ];
      const component = setupComponent(this, submissions, submissions[0]);
      const sorted = component.sortedSubmissions;

      assert.deepEqual(
        sorted.map((s) => s.id),
        ['4', '3', '2', '1'],
        'sorted by student then by date descending'
      );
    });

    test('currentSubmissionIndex returns position in sorted submissions', function (assert) {
      const submissions = [
        createSubmission('3', 'carlos', '2024-01-03'),
        createSubmission('1', 'maria', '2024-01-01'),
        createSubmission('2', 'maria', '2024-01-02'),
      ];
      // Sorted by student then date desc: carlos3, maria2, maria1

      let component = setupComponent(this, submissions, submissions[0]);
      // submissions[0] is carlos3, at index 0 in sorted (1-indexed: 1)
      assert.strictEqual(
        component.currentSubmissionIndex,
        1,
        'carlos3 is at position 1'
      );

      component = setupComponent(this, submissions, submissions[1]);
      // submissions[1] is maria1, at index 2 in sorted (1-indexed: 3)
      assert.strictEqual(
        component.currentSubmissionIndex,
        3,
        'maria1 is at position 3'
      );

      component = setupComponent(this, submissions, submissions[2]);
      // submissions[2] is maria2, at index 1 in sorted (1-indexed: 2)
      assert.strictEqual(
        component.currentSubmissionIndex,
        2,
        'maria2 is at position 2'
      );
    });
  });

  module('tracked state and actions', function () {
    test('toggleStudentList toggles showStudents state', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      const component = setupComponent(this, submissions, submissions[0]);

      assert.false(component.showStudents, 'starts false');
      component.toggleStudentList();
      assert.true(component.showStudents, 'becomes true after toggle');
      component.toggleStudentList();
      assert.false(component.showStudents, 'becomes false after second toggle');
    });

    test('addSelection calls args callback with selection', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      let capturedArgs = null;
      const mockSelection = { text: 'selected text' };

      const component = setupComponent(this, submissions, submissions[0]);
      component.args.addSelection = function (selection, isUpdateOnly) {
        capturedArgs = { selection, isUpdateOnly };
      };

      component.addSelection(mockSelection, false);
      assert.deepEqual(
        capturedArgs,
        { selection: mockSelection, isUpdateOnly: false },
        'calls addSelection with correct args'
      );
    });

    test('deleteSelection calls args callback with selection', function (assert) {
      const submissions = [createSubmission('1', 'maria', '2024-01-01')];
      let capturedSelection = null;
      const mockSelection = { text: 'selected text' };

      const component = setupComponent(this, submissions, submissions[0]);
      component.args.deleteSelection = function (selection) {
        capturedSelection = selection;
      };

      component.deleteSelection(mockSelection);
      assert.deepEqual(
        capturedSelection,
        mockSelection,
        'calls deleteSelection with correct selection'
      );
    });
  });
});
