import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | assignment-list', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // utility-methods.getBelongsToId reads the createdBy relationship id.
    this.owner.register(
      'service:utility-methods',
      class extends Service {
        getBelongsToId(record) {
          return record.createdById;
        }
      }
    );
    this.assignments = [
      { id: 'a1', name: 'Alpha', createdById: 'u1', isTrashed: false, createDate: 1 },
      { id: 'a2', name: 'Beta', createdById: 'other', isTrashed: false, createDate: 2 },
    ];
  });

  function registerUser(owner, isStudent) {
    owner.register(
      'service:current-user',
      class extends Service {
        user = {
          id: 'u1',
          username: 'teach',
          isStudent,
          assignments: [],
          organization: { name: 'Org' },
        };
      }
    );
  }

  test('renders the teacher assignment lists', async function (assert) {
    registerUser(this.owner, false);
    this.set('assignments', this.assignments);

    await render(hbs`<AssignmentList @assignments={{this.assignments}} />`);

    assert.dom('.your-assignments').includesText('Alpha', 'own assignment listed');
    assert.dom('.list-header h1').hasText('Assignments');
  });

  test('links point at the assignment route', async function (assert) {
    registerUser(this.owner, false);
    this.set('assignments', this.assignments);

    await render(hbs`<AssignmentList @assignments={{this.assignments}} />`);

    assert.dom('a.assignment-new-link').exists();
  });

  test('the Create Assignment link shows for a teacher', async function (assert) {
    registerUser(this.owner, false);
    this.set('assignments', this.assignments);

    await render(hbs`<AssignmentList @assignments={{this.assignments}} />`);

    assert.dom('#assignment-new-btn').exists('teacher sees create link');
  });

  test('the Create Assignment link is hidden for a student', async function (assert) {
    registerUser(this.owner, true);
    this.set('assignments', this.assignments);

    await render(hbs`<AssignmentList @assignments={{this.assignments}} />`);

    assert.dom('#assignment-new-btn').doesNotExist('student does not see it');
  });
});
