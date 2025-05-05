import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | assignment-info-student', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    // Mock format-date helper
    this.owner.register(
      'helper:format-date',
      function ([date, format, doUseRelativeTime]) {
        if (!date) {
          return 'N/A';
        }
        if (date === '2023-10-01') {
          return 'October 1, 2023';
        }
        if (date === '2023-10-15') {
          return 'October 15, 2023';
        }
        return 'Invalid Date';
      }
    );
  });

  test('it renders assignment information correctly', async function (assert) {
    this.set('assignment', {
      name: 'Math Assignment',
      assignedDate: '2023-10-01',
      dueDate: '2023-10-15',
    });
    this.set('problem', {
      title: 'Solve for X',
      text: 'Find the value of X in the equation.',
    });
    this.set('section', {
      id: '123',
      name: 'Algebra 101',
    });

    await render(hbs`<AssignmentInfoStudent
      @assignment={{this.assignment}}
      @problem={{this.problem}}
      @section={{this.section}}
    />`);

    assert
      .dom('.assignment-name')
      .hasText('Math Assignment', 'Assignment name is rendered correctly');
    assert
      .dom('.assigned-date')
      .hasText('October 1, 2023', 'Assigned date is formatted correctly');
    assert
      .dom('.due-date')
      .hasText('October 15, 2023', 'Due date is formatted correctly');
  });

  test('it renders assignment details correctly', async function (assert) {
    this.set('assignment', {
      name: 'Math Assignment',
      assignedDate: '2023-10-01',
      dueDate: '2023-10-15',
    });
    this.set('problem', {
      title: 'Solve for X',
      text: 'Find the value of X in the equation.',
    });
    this.set('section', {
      id: '123',
      name: 'Algebra 101',
    });

    await render(hbs`<AssignmentInfoStudent
      @assignment={{this.assignment}}
      @problem={{this.problem}}
      @section={{this.section}}
    />`);

    assert
      .dom('.info-detail label[for="assignment"]')
      .hasText('Assignment Name:');
    assert.dom('.info-detail p').containsText('Math Assignment');
    assert.dom('.info-detail').containsText('Solve for X');
    assert.dom('.info-detail').containsText('Algebra 101');
    assert.dom('.info-detail').containsText('Oct 1st 2023');
    assert.dom('.info-detail').containsText('Oct 15th 2023');
  });

  test('it handles missing assignedDate and dueDate', async function (assert) {
    this.set('assignment', {
      name: 'Math Assignment',
    });
    this.set('problem', {
      title: 'Solve for X',
      text: 'Find the value of X in the equation.',
    });
    this.set('section', {
      id: '123',
      name: 'Algebra 101',
    });

    await render(hbs`<AssignmentInfoStudent
      @assignment={{this.assignment}}
      @problem={{this.problem}}
      @section={{this.section}}
    />`);

    assert.dom('.info-detail').containsText('N/A', 'Assigned Date is N/A');
    assert.dom('.info-detail').containsText('N/A', 'Due Date is N/A');
  });

  test('it renders problem statement and image', async function (assert) {
    this.set('problem', {
      title: 'Solve for X',
      text: 'Find the value of X in the equation.',
      image: {
        imageData: 'data:image/png;base64,someImageData',
      },
    });

    await render(hbs`<AssignmentInfoStudent
      @problem={{this.problem}}
    />`);

    assert
      .dom('.info-detail')
      .containsText('Find the value of X in the equation.');
    assert.dom('.assignmentImage img').exists('Problem image is rendered');
    assert
      .dom('.assignmentImage img')
      .hasAttribute('src', 'data:image/png;base64,someImageData');
  });

  test('it displays revise and respond buttons', async function (assert) {
    this.set('showReviseButton', true);
    this.set('showRespondButton', true);
    this.set('reviseAssignmentResponse', () => assert.step('revise clicked'));
    this.set('beginAssignmentResponse', () => assert.step('respond clicked'));

    await render(hbs`<AssignmentInfoStudent
      @showReviseButton={{this.showReviseButton}}
      @showRespondButton={{this.showRespondButton}}
      @reviseAssignmentResponse={{this.reviseAssignmentResponse}}
      @beginAssignmentResponse={{this.beginAssignmentResponse}}
    />`);

    assert.dom('.edit-assignment-button').exists('Revise button is visible');
    assert.dom('.save-assign-btn').exists('Respond button is visible');

    await click('.edit-assignment-button');
    await click('.save-assign-btn');

    assert.verifySteps(['revise clicked', 'respond clicked']);
  });

  test('it displays past submissions', async function (assert) {
    this.set('sortedList', [
      { answerId: '1', createDate: '2023-10-01T10:00:00Z' },
      { answerId: '2', createDate: '2023-10-02T12:00:00Z' },
    ]);
    this.set('displayedAnswer', null);
    this.set('displayAnswer', (answer) => {
      this.set('displayedAnswer', answer);
    });

    await render(hbs`<AssignmentInfoStudent
      @sortedList={{this.sortedList}}
      @displayAnswer={{this.displayAnswer}}
    />`);

    assert
      .dom('.past-submissions')
      .exists('Past submissions section is visible');
    assert
      .dom('.submission-list li')
      .exists({ count: 2 }, 'Two past submissions are displayed');
    assert.dom('.submission-list li:first-child').containsText('Oct 1st 2023');

    await click('.submission-list li:first-child');
    assert.strictEqual(
      this.displayedAnswer.answerId,
      '1',
      'First submission is displayed'
    );
  });

  test('it handles no past submissions', async function (assert) {
    this.set('sortedList', []);

    await render(hbs`<AssignmentInfoStudent
      @sortedList={{this.sortedList}}
    />`);

    assert
      .dom('.info-msg-container .info-none')
      .exists('No submissions message is displayed');
    assert
      .dom('.past-submissions')
      .doesNotExist('Past submissions section is not visible');
  });
});
