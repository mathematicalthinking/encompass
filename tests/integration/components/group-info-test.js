import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

function buildStudent(overrides = {}) {
  return EmberObject.create({
    id: 'student-1',
    username: 'alice',
    ...overrides,
  });
}

function buildGroup(overrides = {}) {
  const initialName = overrides.name ?? 'Group 1';
  const initialStudents = overrides.students ?? A([]);

  return EmberObject.create({
    id: 'group-1',
    name: initialName,
    students: initialStudents,
    hasDirtyAttributes: false,
    rollbackAttributes() {
      this.name = initialName;
    },
    ...overrides,
  });
}

module('Integration | Component | group-info', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class SweetAlertStub extends Service {
      toastCalls = [];

      showToast(type, message) {
        this.toastCalls.push({ type, message });
      }
    }

    this.owner.register('service:sweet-alert', SweetAlertStub);
  });

  test('editing students uses local draft state until save', async function (assert) {
    const alice = buildStudent({ id: 'student-1', username: 'alice' });
    const bob = buildStudent({ id: 'student-2', username: 'bob' });
    const carol = buildStudent({ id: 'student-3', username: 'carol' });
    const group = buildGroup({
      students: A([alice, bob]),
    });

    let saveCallCount = 0;

    this.setProperties({
      group,
      students: A([alice, bob, carol]),
      saveGroup: () => {
        saveCallCount += 1;
      },
      updateGroup: () => {},
      deleteGroup: () => {},
    });

    await render(hbs`
      <GroupInfo
        @group={{this.group}}
        @addGroup={{true}}
        @students={{this.students}}
        @saveGroup={{this.saveGroup}}
        @updateGroup={{this.updateGroup}}
        @deleteGroup={{this.deleteGroup}}
      />
    `);

    await click('.edit-group');
    await click(this.element.querySelectorAll('input[type="checkbox"]')[2]);

    assert.deepEqual(
      group.students.mapBy('id'),
      ['student-1', 'student-2'],
      'group membership is unchanged before save'
    );
    assert.strictEqual(saveCallCount, 0, 'save callback has not run yet');
  });

  test('saving passes draft name and students to parent callback', async function (assert) {
    const alice = buildStudent({ id: 'student-1', username: 'alice' });
    const bob = buildStudent({ id: 'student-2', username: 'bob' });
    const group = buildGroup({
      students: A([alice]),
    });

    let savedPayload;

    this.setProperties({
      group,
      students: A([alice, bob]),
      saveGroup: (savedGroup, payload) => {
        savedPayload = {
          group: savedGroup,
          name: payload.name,
          studentIds: payload.students.map((student) => student.id),
        };
      },
      updateGroup: () => {},
      deleteGroup: () => {},
    });

    await render(hbs`
      <GroupInfo
        @group={{this.group}}
        @addGroup={{true}}
        @students={{this.students}}
        @saveGroup={{this.saveGroup}}
        @updateGroup={{this.updateGroup}}
        @deleteGroup={{this.deleteGroup}}
      />
    `);

    await click('.edit-group');
    await fillIn('.groups-item-input', 'Updated Group');
    await click(this.element.querySelectorAll('input[type="checkbox"]')[1]);

    assert.strictEqual(
      group.name,
      'Group 1',
      'group name is unchanged before save'
    );
    assert.deepEqual(
      group.students.mapBy('id'),
      ['student-1'],
      'group students are unchanged before save'
    );

    await click('.edit-group');

    assert.strictEqual(savedPayload.group, group, 'passes the original group');
    assert.strictEqual(
      savedPayload.name,
      'Updated Group',
      'passes the draft name'
    );
    assert.deepEqual(
      savedPayload.studentIds,
      ['student-1', 'student-2'],
      'passes the draft student membership'
    );
  });
});
