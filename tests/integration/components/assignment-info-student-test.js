import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { create } from 'underscore';

module('Integration | Component | assignment-info-student', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(function () {
    // Mock format-date helper
    this.owner.register(
      'helper:format-date',
      function (date, format, doUseRelativeTime) {
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
      .dom('.info-name')
      .hasText(
        'Assignment Name: Math Assignment',
        'Assignment name label is rendered correctly'
      );
    assert
      .dom('.assigned-date')
      .hasText(
        'Assigned Date: October 1, 2023',
        'Assigned date is formatted correctly'
      );
    assert
      .dom('.due-date')
      .hasText('Due Date: October 15, 2023', 'Due date is formatted correctly');
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

    assert.dom('.problem-title').containsText('Solve for X');
    assert.dom('.class-name').containsText('Algebra 101');
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

    assert.dom('.assigned-date').containsText('N/A', 'Assigned Date is N/A');
    assert.dom('.due-date').containsText('N/A', 'Due Date is N/A');
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
      .dom('.problem-text')
      .containsText('Find the value of X in the equation.');
    assert.dom('.assignmentImage img').exists('Problem image is rendered');
    assert
      .dom('.assignmentImage img')
      .hasAttribute('src', 'data:image/png;base64,someImageData');
  });

  test('it displays revise button when there are past submissions', async function (assert) {
    this.set('answerList', [{ createDate: '2023-10-01' }]);
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
      @answerList={{this.answerList}}
    />`);

    assert.dom('.edit-assignment-button').exists('Revise button is visible');
  });

  test('it displays respond button when there are no past submissions', async function (assert) {
    this.set('answerList', []);
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
      @answerList={{this.answerList}}
    />`);

    assert.dom('.save-assign-btn').exists('Respond button is visible');
  });

  test('it displays past submissions', async function (assert) {
    this.set('answerList', [
      { answerId: '1', createDate: '2023-10-01T10:00:00Z' },
      { answerId: '2', createDate: '2023-10-02T12:00:00Z' },
    ]);
    this.set('displayedAnswer', null);
    this.set('displayAnswer', (answer) => {
      this.set('displayedAnswer', answer);
    });

    await render(hbs`<AssignmentInfoStudent
      @answerList={{this.answerList}}
    />`);

    assert
      .dom('.past-submissions')
      .exists('Past submissions section is visible');
    assert
      .dom('.submission-list li')
      .exists({ count: 2 }, 'Two past submissions are displayed');
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
