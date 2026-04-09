import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';
import EmberObject, { action } from '@ember/object';
import { A } from '@ember/array';

function buildUser(overrides = {}) {
  return EmberObject.create({
    id: 'user-1',
    username: 'teacher1',
    accountType: 'T',
    get(key) {
      return this[key];
    },
    ...overrides,
  });
}

function buildAssignment(overrides = {}) {
  return EmberObject.create({
    id: 'assignment-1',
    name: 'Linear Functions',
    ...overrides,
  });
}

function buildGroup(overrides = {}) {
  return EmberObject.create({
    id: 'group-1',
    name: 'Group 1',
    isTrashed: false,
    students: A([]),
    save() {
      return Promise.resolve(this);
    },
    ...overrides,
  });
}

function buildSection({
  id = 'section-1',
  name = 'Algebra I',
  createdBy = { id: 'teacher-1' },
  organization = { id: 'org-1', name: 'STEM Academy' },
  teachers = [buildUser({ id: 'teacher-1', username: 'lead-teacher' })],
  students = [
    buildUser({ id: 'student-1', username: 'alice', accountType: 'S' }),
  ],
  assignments = [buildAssignment()],
  sectionPassword = 'secret-code',
} = {}) {
  const teacherCollection = A(teachers);
  const studentCollection = A(students);

  return EmberObject.create({
    id,
    name,
    createdBy,
    organization,
    teachers: teacherCollection,
    students: studentCollection,
    assignments,
    sectionPassword,
    hasDirtyAttributes: false,
    get(key) {
      return this[key];
    },
    hasMany(key) {
      if (key === 'teachers') {
        return {
          ids: () => teacherCollection.map((teacher) => teacher.id),
        };
      }

      return {
        ids: () => [],
      };
    },
    save() {
      return Promise.resolve(this);
    },
    set(key, value) {
      this[key] = value;
      return value;
    },
  });
}

module('Integration | Component | section-info', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class SweetAlertStub extends Service {
      toastCalls = [];

      showToast(type, message) {
        this.toastCalls.push({ type, message });
      }

      showModal() {
        return Promise.resolve({ value: true });
      }
    }

    class UtilityMethodsStub extends Service {
      getBelongsToId(record, key) {
        if (!record || !key) {
          return null;
        }

        const value = record[key];
        if (!value) {
          return null;
        }

        if (typeof value === 'object') {
          return value.id ?? null;
        }

        return value;
      }
    }

    class RouterStub extends Service {
      transitions = [];

      transitionTo(routeName, ...args) {
        this.transitions.push({ routeName, args });
      }
    }

    class StoreStub extends Service {
      users = A([
        buildUser({ id: 'teacher-1', username: 'lead-teacher' }),
        buildUser({ id: 'teacher-2', username: 'co-teacher' }),
        buildUser({
          id: 'student-3',
          username: 'student-user',
          accountType: 'S',
        }),
      ]);
      problems = A([EmberObject.create({ id: 'problem-1', name: 'Slope' })]);

      peekAll(modelName) {
        if (modelName === 'user') {
          return {
            toArray: () => A(this.users),
          };
        }

        return {
          toArray: () => A([]),
        };
      }

      findAll(modelName) {
        if (modelName === 'problem') {
          return Promise.resolve(this.problems);
        }

        return Promise.resolve(A([]));
      }

      createRecord() {
        return EmberObject.create({
          save() {
            return Promise.resolve(this);
          },
        });
      }
    }

    class CurrentUserStub extends Service {
      id = 'teacher-1';
      isStudent = false;
      isTeacher = true;
      isPdAdmin = false;
      isAdmin = false;
      user = buildUser({
        id: 'teacher-1',
        username: 'lead-teacher',
        organization: { id: 'org-1', name: 'STEM Academy' },
      });
    }

    class SelectizeInputStub extends Component {}
    class AssignmentNewStub extends Component {}
    class AddCreateStudentStub extends Component {
      @action addExistingStudent() {
        const section = this.args.section;
        const existingStudent = buildUser({
          id: 'student-existing',
          username: 'existing-student',
          accountType: 'S',
        });

        const alreadyAdded = section.students.some(
          (student) => student.id === existingStudent.id
        );

        if (!alreadyAdded) {
          section.students.pushObject(existingStudent);
        }
      }

      @action addNewStudent() {
        const section = this.args.section;
        const newStudent = buildUser({
          id: 'student-new',
          username: 'brand-new-student',
          accountType: 'S',
        });

        const alreadyAdded = section.students.some(
          (student) => student.id === newStudent.id
        );

        if (!alreadyAdded) {
          section.students.pushObject(newStudent);
        }
      }
    }
    class GroupInfoStub extends Component {}

    this.owner.register('service:sweet-alert', SweetAlertStub);
    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register('service:router', RouterStub);
    this.owner.register('service:store', StoreStub);
    this.owner.register('service:current-user', CurrentUserStub);
    this.owner.register('service:currentUser', CurrentUserStub);

    this.owner.register(
      'template:components/selectize-input',
      hbs`<div class='selectize-input-stub' data-input-id={{@inputId}}></div>`
    );
    this.owner.register('component:selectize-input', SelectizeInputStub);

    this.owner.register(
      'template:components/assignment-new',
      hbs`<div class='assignment-new-stub' data-problem-count={{@cachedProblems.length}} data-section-id={{@selectedSection.id}}></div>`
    );
    this.owner.register('component:assignment-new', AssignmentNewStub);

    this.owner.register(
      'template:components/add-create-student',
      hbs`
        <div class='add-create-student-stub' data-section-id={{@section.id}}>
          <button
            type='button'
            class='add-existing-student-btn'
            {{on 'click' this.addExistingStudent}}
          >
            Add Existing Student
          </button>
          <button
            type='button'
            class='add-new-student-btn'
            {{on 'click' this.addNewStudent}}
          >
            Add New Student
          </button>
        </div>
      `
    );
    this.owner.register('component:add-create-student', AddCreateStudentStub);

    this.owner.register(
      'template:components/group-info',
      hbs`<li class='group-info-stub'>{{@group.name}}</li>`
    );
    this.owner.register('component:group-info', GroupInfoStub);
  });

  async function renderSectionInfo(context, overrides = {}) {
    const section = overrides.section || buildSection();
    const groups = overrides.groups || A([]);
    const cachedProblems = overrides.cachedProblems || A([]);

    context.setProperties({
      section,
      groups,
      cachedProblems,
    });

    await render(hbs`
      <SectionInfo
        @section={{this.section}}
        @groups={{this.groups}}
        @cachedProblems={{this.cachedProblems}}
      />
    `);

    await settled();
  }

  test('renders section details with assignments, teachers, and students', async function (assert) {
    const section = buildSection({
      assignments: [
        buildAssignment({ id: 'assignment-1', name: 'Slope Lab' }),
        buildAssignment({ id: 'assignment-2', name: 'Intercepts' }),
      ],
      teachers: [buildUser({ id: 'teacher-1', username: 'lead-teacher' })],
      students: [
        buildUser({ id: 'student-1', username: 'alice', accountType: 'S' }),
      ],
    });

    await renderSectionInfo(this, { section });

    assert.dom('#section-info').exists();
    assert.dom('[data-test="section-name-display"]').hasText('Algebra I');
    assert.dom('.section-info-detail.assignments').includesText('Slope Lab');
    assert.dom('.section-info-detail.assignments').includesText('Intercepts');
    assert.dom('.section-info-detail.teachers').includesText('lead-teacher');
    assert.dom('.section-info-detail.students').includesText('alice');
  });

  test('hides editing controls for student users', async function (assert) {
    class StudentCurrentUserStub extends Service {
      id = 'student-1';
      isStudent = true;
      isTeacher = false;
      isPdAdmin = false;
      isAdmin = false;
      user = buildUser({
        id: 'student-1',
        username: 'alice',
        accountType: 'S',
        organization: { id: 'org-1', name: 'STEM Academy' },
      });
    }

    this.owner.register('service:current-user', StudentCurrentUserStub);
    this.owner.register('service:currentUser', StudentCurrentUserStub);

    await renderSectionInfo(this);

    assert
      .dom('.section-info-detail.teachers .far.fa-edit')
      .doesNotExist('students cannot edit teacher membership');
    assert
      .dom('.section-info-detail.groups .far.fa-edit')
      .doesNotExist('students cannot edit groups');
  });

  test('shows teacher edit UI when the current user can edit the section', async function (assert) {
    await renderSectionInfo(this);

    await click('.section-info-detail.teachers .far.fa-edit');
    await settled();

    assert
      .dom('.selectize-input-stub[data-input-id="select-add-teacher"]')
      .exists('teacher editor appears after toggling teacher edit mode');
  });

  test('does not open group editor when the class has no students', async function (assert) {
    const section = buildSection({ students: [] });

    await renderSectionInfo(this, { section });

    await click('.section-info-detail.groups .far.fa-edit');
    await settled();

    const alert = this.owner.lookup('service:sweet-alert');
    assert.dom('.save-group').doesNotExist('group editor stays closed');
    assert.strictEqual(alert.toastCalls.length, 1, 'shows an error toast');
    assert.strictEqual(
      alert.toastCalls[0].message,
      'Please add students to class',
      'toast explains why groups cannot be added'
    );
  });

  test('shows grouped student indicators when adding a group', async function (assert) {
    const alice = buildUser({
      id: 'student-1',
      username: 'alice',
      accountType: 'S',
    });
    const bob = buildUser({
      id: 'student-2',
      username: 'bob',
      accountType: 'S',
    });
    const section = buildSection({ students: [alice, bob] });
    const groups = A([
      buildGroup({
        id: 'group-1',
        name: 'Existing Group',
        students: A([alice]),
      }),
    ]);

    await renderSectionInfo(this, { section, groups });

    await click('.section-info-detail.groups .far.fa-edit');
    await settled();

    assert.dom('.save-group').exists('group editor is visible');
    assert.dom('.group-options').includesText('alice');
    assert.dom('.group-options').includesText('bob');
    assert.strictEqual(
      this.element.querySelectorAll('.group-options .fa-check').length,
      1,
      'already grouped students are marked in the add-group list'
    );
  });

  test('saving a new group does not mutate the queried groups array', async function (assert) {
    assert.expect(3);

    const alice = buildUser({
      id: 'student-1',
      username: 'alice',
      accountType: 'S',
    });
    const section = buildSection({ students: [alice] });
    const groups = A([]);

    groups.addObject = () => {
      throw new Error('groups array should not be mutated directly');
    };

    await renderSectionInfo(this, { section, groups });

    await click('.section-info-detail.groups .far.fa-edit');
    await fillIn('.new-group-name', 'New Group');
    await click('#group-student-student-1');
    await click('.save-group');
    await settled();

    assert.dom(this.element).includesText('New Group', 'new group is rendered');

    const alert = this.owner.lookup('service:sweet-alert');
    assert.strictEqual(alert.toastCalls.length, 1, 'shows a success toast');
    assert.strictEqual(alert.toastCalls[0].type, 'success', 'save succeeded');
  });

  test('student edit mode allows adding an existing student to the section', async function (assert) {
    const section = buildSection({
      students: [
        buildUser({ id: 'student-1', username: 'alice', accountType: 'S' }),
      ],
    });

    await renderSectionInfo(this, { section });

    await click('[data-test="edit-students"]');
    await settled();
    await click('.add-existing-student-btn');
    await settled();

    assert
      .dom('.section-info-detail.students')
      .includesText('existing-student', 'existing student is added to list');
  });

  test('adding the same existing student twice does not create duplicates', async function (assert) {
    const section = buildSection({
      students: [
        buildUser({ id: 'student-1', username: 'alice', accountType: 'S' }),
      ],
    });

    await renderSectionInfo(this, { section });

    await click('[data-test="edit-students"]');
    await settled();
    await click('.add-existing-student-btn');
    await click('.add-existing-student-btn');
    await settled();

    const matchingItems = Array.from(
      this.element.querySelectorAll('.section-info-detail.students li')
    ).filter((item) => item.textContent.includes('existing-student'));

    assert.strictEqual(
      matchingItems.length,
      1,
      'existing student appears only once'
    );
  });

  test('student edit mode allows adding a newly created student to the section', async function (assert) {
    const section = buildSection({
      students: [
        buildUser({ id: 'student-1', username: 'alice', accountType: 'S' }),
      ],
    });

    await renderSectionInfo(this, { section });

    await click('[data-test="edit-students"]');
    await settled();
    await click('.add-new-student-btn');
    await settled();

    assert
      .dom('.section-info-detail.students')
      .includesText('brand-new-student', 'newly created student is added');
  });

  test('adding both existing and new students keeps all unique entries visible', async function (assert) {
    const section = buildSection({
      students: [
        buildUser({ id: 'student-1', username: 'alice', accountType: 'S' }),
      ],
    });

    await renderSectionInfo(this, { section });

    await click('[data-test="edit-students"]');
    await settled();
    await click('.add-existing-student-btn');
    await click('.add-new-student-btn');
    await settled();

    assert.dom('.section-info-detail.students').includesText('alice');
    assert
      .dom('.section-info-detail.students')
      .includesText('existing-student');
    assert
      .dom('.section-info-detail.students')
      .includesText('brand-new-student');
  });

  test('attempting to add an already-enrolled existing student keeps single entry', async function (assert) {
    const section = buildSection({
      students: [
        buildUser({
          id: 'student-existing',
          username: 'existing-student',
          accountType: 'S',
        }),
      ],
    });

    await renderSectionInfo(this, { section });

    await click('[data-test="edit-students"]');
    await settled();
    await click('.add-existing-student-btn');
    await settled();

    const matchingItems = Array.from(
      this.element.querySelectorAll('.section-info-detail.students li')
    ).filter((item) => item.textContent.includes('existing-student'));

    assert.strictEqual(
      matchingItems.length,
      1,
      'already-enrolled student remains a single entry'
    );
  });
});
