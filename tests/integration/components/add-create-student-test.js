import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import Component from '@glimmer/component';
import $ from 'jquery';

module('Integration | Component | add-create-student', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.originalJQueryPost = $.post;

    // Mock sweet-alert service
    const alertService = class extends Service {
      toastCalls = [];
      showToast(type, message) {
        this.toastCalls.push({ type, message });
      }
    };
    this.owner.register('service:sweet-alert', alertService);

    // Mock currentUser service
    this.owner.register(
      'service:current-user',
      class extends Service {
        user = {
          id: 'user1',
          organization: { id: 'org1' },
        };
      }
    );

    // Mock store service
    const user1 = EmberObject.create({
      id: 'student1',
      username: 'student_one',
      _id: 'student1',
      accountType: 'S',
      get(key) {
        return this[key];
      },
    });
    const user2 = EmberObject.create({
      id: 'student2',
      username: 'student_two',
      _id: 'student2',
      accountType: 'S',
      get(key) {
        return this[key];
      },
    });
    const newStudent = EmberObject.create({
      id: 'student-new',
      username: 'brand_new_student',
      _id: 'student-new',
      accountType: 'S',
      get(key) {
        return this[key];
      },
    });

    this.userMap = {
      student1: user1,
      student2: user2,
      'student-new': newStudent,
    };

    const mockStore = class extends Service {
      peekAll() {
        return {
          toArray: () => {
            return [user1, user2, newStudent];
          },
        };
      }
      peekRecord(modelName, id) {
        return this.userMap[id] || null;
      }
      findRecord(modelName, id) {
        return Promise.resolve(this.userMap[id] || null);
      }
    };
    mockStore.prototype.userMap = this.userMap;
    this.owner.register('service:store', mockStore);

    class SelectizeInputStub extends Component {}
    this.owner.register(
      'template:components/selectize-input',
      hbs`
        <div id={{@inputId}} class='selectize-input-stub'>
          <button
            type='button'
            class='simulate-select-existing'
            {{on 'click' (fn @onItemAdd 'student1')}}
          >
            Pick Existing Student
          </button>
          <button
            type='button'
            class='simulate-select-other'
            {{on 'click' (fn @onItemAdd 'student2')}}
          >
            Pick Other Student
          </button>
        </div>
      `
    );
    this.owner.register('component:selectize-input', SelectizeInputStub);

    // Set up mock section
    this.saveCallCount = 0;
    this.set(
      'section',
      EmberObject.create({
        id: 'section1',
        name: 'Test Section',
        sectionPassword: 'testpass123',
        students: A([]),
        save: () => {
          this.saveCallCount += 1;
          return Promise.resolve();
        },
      })
    );

    // Set up mock students array
    this.set('students', this.section.students);

    this.set('sectionPassword', 'classpass123');

    $.post = () => Promise.resolve({ _id: 'student-new' });
  });

  hooks.afterEach(function () {
    $.post = this.originalJQueryPost;
  });

  test('it renders with correct structure', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    assert.dom('#add-create-student').exists('Component container exists');
    assert.dom('.student-search').exists('Add existing user section exists');
    assert.dom('.student-create').exists('Create student section exists');
    assert.dom('#create-student').exists('Create student form exists');
  });

  test('it displays the "Add Existing User" section', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    assert
      .dom('.student-search h3')
      .hasText('Add Existing User', 'Add existing user heading is displayed');
    assert
      .dom('#select-add-student')
      .exists('Selectize input for adding students exists');
  });

  test('it displays the "Create new student account" section', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    assert
      .dom('.student-create h3')
      .hasText(
        'Create new student account',
        'Create student heading is displayed'
      );
    assert.dom('#username').exists('Username input exists');
    assert.dom('#first-name').exists('First name input exists');
    assert.dom('#last-name').exists('Last name input exists');
  });

  test('it shows password input when not using default password', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    assert
      .dom('#password')
      .exists('Password input exists when not using default password');
  });

  test('toggling default password checkbox shows/hides class password section', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Initially, password input should be visible
    assert.dom('#password').exists('Password input visible initially');

    // Click the "use default password" checkbox
    await click('input[name="usingDefaultPassword"]');

    // Password input should be hidden, class password should be shown
    assert
      .dom('#password')
      .doesNotExist('Password input hidden after checking default password');
    assert.dom('.section-info').exists('Class password is shown');
  });

  test('show/hide password toggle works', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Password input should be type password initially
    assert
      .dom('#password')
      .hasAttribute('type', 'password', 'Password is hidden initially');

    // Click the show password button
    await click('#show-password-btn');

    // Password input should now be type text
    assert
      .dom('#password')
      .hasAttribute('type', 'text', 'Password is shown after clicking show');
  });

  test('it shows error when missing credentials on submit', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Click create button without filling in required fields
    await click('.submit button.action_button');

    assert
      .dom('.error-message')
      .hasText(
        'Please fill in all required fields',
        'Missing credentials error is shown'
      );
  });

  test('it validates username format', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Enter an invalid username (contains uppercase)
    await fillIn('#username', 'InvalidUsername');
    await triggerEvent('#username', 'input');

    assert
      .dom('.error-message')
      .includesText(
        'Username must be all lowercase',
        'Invalid username error is shown'
      );
  });

  test('it accepts valid username format', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Enter a valid username
    await fillIn('#username', 'valid_username123');
    await triggerEvent('#username', 'input');

    // Should not show username format error
    assert
      .dom('.error-message')
      .doesNotExist('No error shown for valid username');
  });

  test('it shows class password when using default password', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Check the use default password checkbox
    await click('input[name="usingDefaultPassword"]');

    // The class password should be displayed
    assert
      .dom('.section-info')
      .hasText('classpass123', 'Class password is displayed');
  });

  test('it allows hiding the class password', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    // Check the use default password checkbox
    await click('input[name="usingDefaultPassword"]');

    // Initially the password should be visible
    assert
      .dom('.section-info')
      .hasText('classpass123', 'Password visible initially');

    // Click to hide the password
    await click('.section-info #show-password-btn');

    // Password should now be hidden (displayed as input type="password")
    assert.dom('.hidden-class-pass').exists('Password input is now hidden');
  });

  test('Create and Add button exists', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    assert
      .dom('.submit button.action_button')
      .hasText(
        'Create and Add',
        'Create and Add button exists with correct text'
      );
  });

  test('it adds an existing student selected from existing-user picker', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    await click('.simulate-select-existing');

    assert.true(
      this.students.includes(this.userMap.student1),
      'selected existing student is added to section students'
    );
    assert.strictEqual(this.saveCallCount, 1, 'section is saved once');

    const alert = this.owner.lookup('service:sweet-alert');
    assert.strictEqual(alert.toastCalls.length, 1, 'shows success toast');
    assert.strictEqual(alert.toastCalls[0].message, 'Student Added');
  });

  test('it prevents adding duplicate existing student from picker', async function (assert) {
    this.students.pushObject(this.userMap.student1);

    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    await click('.simulate-select-existing');

    assert
      .dom('.error-message')
      .includesText('User already registered in this section.');
    assert.strictEqual(
      this.saveCallCount,
      0,
      'section is not saved for duplicate'
    );
  });

  test('it creates and adds a new student when form is valid', async function (assert) {
    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    await fillIn('#username', 'brand_new_student');
    await fillIn('#password', 'abc12345');
    await click('.submit button.action_button');

    assert.true(
      this.students.includes(this.userMap['student-new']),
      'newly created student is added to section students'
    );
    assert.strictEqual(this.saveCallCount, 1, 'section is saved after create');

    const alert = this.owner.lookup('service:sweet-alert');
    assert.strictEqual(
      alert.toastCalls[0].message,
      'Student Created',
      'shows create success toast'
    );
  });

  test('it shows username unavailable when signup reports existing username', async function (assert) {
    $.post = () =>
      Promise.resolve({
        message: 'There already exists a user with that username',
      });

    await render(hbs`
      <AddCreateStudent
        @section={{this.section}}
        @students={{this.students}}
        @sectionPassword={{this.sectionPassword}}
      />
    `);

    await fillIn('#username', 'taken_username');
    await fillIn('#password', 'abc12345');
    await click('.submit button.action_button');

    assert.dom('.error-message').includesText('Username is unavailable.');
    assert.strictEqual(
      this.saveCallCount,
      0,
      'does not save section on signup conflict'
    );
  });
});
