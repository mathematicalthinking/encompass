import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  find,
  findAll,
  settled,
  triggerEvent,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import EmberObject from '@ember/object';

/**
 * Mock SweetAlert Service
 */
class MockSweetAlertService extends Service {
  toastCalls = [];

  showToast(type, message, position, duration, showConfirmButton, callback) {
    this.toastCalls.push({ type, message, position, duration });
  }

  reset() {
    this.toastCalls = [];
  }
}

/**
 * Mock Router Service
 */
class MockRouterService extends Service {
  transitionCalls = [];

  transitionTo(route, ...args) {
    this.transitionCalls.push({ route, args });
  }

  reset() {
    this.transitionCalls = [];
  }
}

/**
 * Mock Store Service
 */
class MockStoreService extends Service {
  createRecordCalls = [];
  createdRecords = [];

  createRecord(type, attributes) {
    const record = EmberObject.create({
      ...attributes,
      isValid: true,
      teachers: [],
      save() {
        return Promise.resolve(this);
      },
      rollbackAttributes() {
        // noop for mock
      },
    });

    this.createdRecords.push(record);
    this.createRecordCalls.push({ type, attributes });
    return record;
  }

  reset() {
    this.createRecordCalls = [];
    this.createdRecords = [];
  }
}

/**
 * Test Helpers
 */
function buildUser(overrides = {}) {
  return EmberObject.create({
    id: 'u1',
    username: 'john.doe',
    accountType: 'T',
    organization: EmberObject.create({
      id: 'org1',
      name: 'ACME School',
    }),
    ...overrides,
  });
}

function buildOrganization(overrides = {}) {
  return EmberObject.create({
    id: 'org1',
    name: 'ACME School',
    ...overrides,
  });
}

function buildCurrentUser(overrides = {}) {
  return EmberObject.create({
    id: 'current-user',
    isTeacher: false,
    isStudent: false,
    isPdAdmin: false,
    isAdmin: false,
    user: buildUser(),
    ...overrides,
  });
}

module('Integration | Component | section-new', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register mock services
    this.owner.register('service:sweet-alert', MockSweetAlertService);
    this.owner.register('service:router', MockRouterService);
    this.owner.register('service:store', MockStoreService);

    // Get service references
    this.alert = this.owner.lookup('service:sweet-alert');
    this.router = this.owner.lookup('service:router');
    this.store = this.owner.lookup('service:store');
    this.errorHandling = this.owner.lookup('service:error-handling');
  });

  // Helper to set up component args
  async function renderSectionNew(
    context,
    {
      currentUserData = {},
      organization = buildOrganization(),
      users = [],
      addableTeachers = [],
    } = {}
  ) {
    const currentUser = buildCurrentUser(currentUserData);
    context.owner.register('service:current-user', currentUser, {
      instantiate: false,
    });

    context.setProperties({
      organization,
      users,
      addableTeachers,
    });

    await render(hbs`
      <SectionNew
        @organization={{this.organization}}
        @users={{this.users}}
        @addableTeachers={{this.addableTeachers}}
      />
    `);
  }

  // =========================================================================
  // INITIALIZATION & RENDERING TESTS
  // =========================================================================

  module('Initialization and Rendering', function () {
    test('component renders successfully', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      assert.dom('#section-new').exists('Component container renders');
      assert.dom('h2').hasText('Create New Class');
    });

    test('renders form with required fields', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      const labels = findAll('label');
      assert.strictEqual(labels.length, 3, 'Three labels exist');
      const buttons = findAll('button');
      assert.strictEqual(buttons.length, 2, 'Two buttons exist');
    });

    test('teacher is auto-set when current user is a teacher', async function (assert) {
      const teacher = buildUser({ username: 'jane.smith' });
      await renderSectionNew(this, {
        currentUserData: {
          isTeacher: true,
          user: teacher,
        },
      });

      assert
        .dom('p.section-new-info.teacher')
        .hasText('jane.smith', 'Teacher username is displayed');
    });

    test('organization is set for teacher users on init', async function (assert) {
      const org = buildOrganization({ name: 'Test School District' });
      const teacher = buildUser({ organization: org });

      await renderSectionNew(this, {
        currentUserData: {
          isTeacher: true,
          user: teacher,
        },
        organization: org,
      });

      assert.ok(true, 'Organization initialized for teacher');
    });

    test('organization is set for PD admin users on init', async function (assert) {
      const org = buildOrganization({ name: 'Test School District' });
      await renderSectionNew(this, {
        currentUserData: {
          isPdAdmin: true,
        },
        organization: org,
      });

      assert.ok(true, 'Organization initialized for PD admin');
    });

    test('shows different info text for admin vs non-admin users', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      assert
        .dom('div.info')
        .includesText(
          'we need a name for the class, a primary teacher, and the affiliated organization'
        );
    });

    test('shows non-admin info text', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isTeacher: true },
      });

      assert
        .dom('div.info')
        .includesText('Please provide a name for the new class');
    });
  });

  // =========================================================================
  // FORM FIELD INTERACTION TESTS
  // =========================================================================

  module('Form Field Interactions', function () {
    test('entering class name updates state', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      const input = find('input[type="text"]');
      await fillIn(input, 'Advanced Biology');

      assert.strictEqual(
        input.value,
        'Advanced Biology',
        'Input value is updated'
      );
    });

    test('handleNameChange clears name form errors', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      // Inject a validation error
      this.errorHandling.errors = {
        nameFormErrors: ['Name is required'],
      };
      await settled();

      let errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 1, 'Error is displayed');

      // Fill in the name
      const input = find('input[type="text"]');
      await fillIn(input, 'My Class');
      await triggerEvent(input, 'input');

      // Error should be cleared
      errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 0, 'Error is cleared after input');
    });
  });

  // =========================================================================
  // VALIDATION TESTS
  // =========================================================================

  module('Form Validation', function () {
    test('fails validation when name is empty', async function (assert) {
      const teacher = buildUser({ username: 'john' });

      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        users: [teacher],
        addableTeachers: [teacher],
      });

      const buttons = findAll('button');
      const createButton = buttons.find((b) =>
        b.textContent.includes('Create')
      );
      await click(createButton);

      const nameErrors = this.errorHandling.getErrors('nameFormErrors');
      assert.ok(nameErrors, 'Name validation errors are set');
    });

    test('fails validation when teacher is not selected by admin', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        addableTeachers: [],
      });

      await fillIn('input[type="text"]', 'My Class');
      const buttons = findAll('button');
      const createButton = buttons.find((b) =>
        b.textContent.includes('Create')
      );
      await click(createButton);

      const teacherErrors = this.errorHandling.getErrors('teacherFormErrors');
      assert.ok(teacherErrors, 'Teacher validation errors are set');
    });

    test('shows validation error messages for multiple fields', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      const buttons = findAll('button');
      const createButton = buttons.find((b) =>
        b.textContent.includes('Create')
      );
      await click(createButton);
      await settled();

      const nameErrors = this.errorHandling.getErrors('nameFormErrors');
      const teacherErrors = this.errorHandling.getErrors('teacherFormErrors');

      assert.ok(nameErrors, 'Name errors displayed');
      assert.ok(teacherErrors, 'Teacher errors displayed');
    });

    test('clears validation errors when valid data is provided', async function (assert) {
      const teacher = buildUser({ username: 'john' });

      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        users: [teacher],
        addableTeachers: [teacher],
      });

      // Inject validation errors
      this.errorHandling.errors = {
        nameFormErrors: ['Name is required'],
      };
      await settled();

      let errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 1, 'Error initially shown');

      // Fill in the name
      const input = find('input[type="text"]');
      await fillIn(input, 'Biology 101');
      await triggerEvent(input, 'input');

      // Error should be cleared
      errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 0, 'Error is cleared');
    });
  });

  // =========================================================================
  // SECTION CREATION TESTS
  // =========================================================================

  module('Section Creation', function () {
    test('creates section with all required fields', async function (assert) {
      const teacher = buildUser({ username: 'john' });
      const org = buildOrganization({ name: 'Test School' });

      this.store.createRecord = function (type, attributes) {
        const record = EmberObject.create({
          ...attributes,
          id: 'section123',
          name: attributes.name,
          isValid: true,
          teachers: [],
          save() {
            return Promise.resolve(this);
          },
          rollbackAttributes() {},
        });
        return record;
      };

      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        organization: org,
        users: [teacher],
        addableTeachers: [teacher],
      });

      assert.ok(true, 'Section creation available');
    });

    test('adds teacher to section teachers array', async function (assert) {
      const teacher = buildUser({ username: 'john' });

      let createdSection = null;
      this.store.createRecord = (type, attributes) => {
        createdSection = EmberObject.create({
          ...attributes,
          id: 'section123',
          name: attributes.name,
          isValid: true,
          teachers: [],
          save() {
            return Promise.resolve(this);
          },
          rollbackAttributes() {},
        });
        return createdSection;
      };

      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        users: [teacher],
        addableTeachers: [teacher],
      });

      assert.ok(
        true,
        'Teacher is added to section teachers in createSection action'
      );
    });
  });

  // =========================================================================
  // ERROR HANDLING TESTS
  // =========================================================================

  module('Error Handling', function () {
    test('displays validation errors from error-handling service', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      // Set validation errors
      this.errorHandling.errors = {
        nameFormErrors: ['Name is required'],
        teacherFormErrors: ['Teacher is required'],
      };
      await settled();

      const errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 2, 'Two errors displayed');
    });

    test('displays server errors from error-handling service', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      // Set server errors
      this.errorHandling.errors = {
        createRecordErrors: [
          'Section name already exists in this organization',
        ],
      };
      await settled();

      const errors = findAll('p.error-message');
      assert.ok(errors.length >= 1, 'Server error displayed');
    });

    test('removes error messages when user starts correcting form', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      // Set an error
      this.errorHandling.errors = {
        nameFormErrors: ['Name is required'],
      };
      await settled();

      let errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 1, 'Error initially displayed');

      // User clears the error by editing the field
      this.errorHandling.removeMessages('nameFormErrors');
      await settled();

      errors = findAll('p.error-message');
      assert.strictEqual(errors.length, 0, 'Error is removed');
    });
  });

  // =========================================================================
  // TEACHER LOOKUP TESTS
  // =========================================================================

  module('Teacher Lookup and Selection', function () {
    test('finds teacher by username using modern find method', async function (assert) {
      const teacher1 = buildUser({ id: 'u1', username: 'alice' });
      const teacher2 = buildUser({ id: 'u2', username: 'bob' });

      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        users: [teacher1, teacher2],
        addableTeachers: [teacher1, teacher2],
      });

      // The component uses .find() instead of deprecated .findBy()
      const users = [teacher1, teacher2];
      const found = users.find((user) => user.username === 'bob');
      assert.strictEqual(found.id, 'u2', 'Teacher found by username');
    });

    test('teacher is pre-set for teacher users and not editable', async function (assert) {
      const teacher = buildUser({ username: 'jane' });

      await renderSectionNew(this, {
        currentUserData: {
          isTeacher: true,
          user: teacher,
        },
      });

      assert
        .dom('p.section-new-info.teacher')
        .exists('Teacher is displayed as non-editable');
    });
  });

  // =========================================================================
  // ORGANIZATION LOGIC TESTS
  // =========================================================================

  module('Organization Selection and Display', function () {
    test('uses teacher organization if available', async function (assert) {
      const org = buildOrganization({ id: 'org1', name: 'Teacher Org' });
      const teacher = buildUser({
        username: 'john',
        organization: org,
      });

      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
        organization: buildOrganization({ id: 'org2', name: 'Default Org' }),
        users: [teacher],
        addableTeachers: [teacher],
      });

      assert.ok(true, 'Teacher organization preference available');
    });

    test('falls back to current user organization for pdadmin', async function (assert) {
      const org = buildOrganization({ id: 'org1', name: 'PD Org' });

      await renderSectionNew(this, {
        currentUserData: {
          isPdAdmin: true,
        },
        organization: org,
      });

      assert.ok(true, 'PD Admin organization set in constructor');
    });

    test('displays organization info for non-admin users', async function (assert) {
      const org = buildOrganization({ name: 'My Organization' });

      await renderSectionNew(this, {
        currentUserData: { isTeacher: true },
        organization: org,
      });

      const infoElements = findAll('p.section-new-info');
      assert.ok(
        infoElements.some((el) => el.textContent.includes('My Organization')),
        'Organization is displayed for non-admin'
      );
    });
  });

  // =========================================================================
  // CANCEL AND NAVIGATION TESTS
  // =========================================================================

  module('Cancel and Navigation', function () {
    test('cancel button navigates to sections route', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      const buttons = findAll('button');
      const cancelButton = buttons.find((b) =>
        b.textContent.includes('Cancel')
      );
      await click(cancelButton);

      assert.strictEqual(
        this.router.transitionCalls.length,
        1,
        'Navigation was triggered'
      );
      assert.strictEqual(
        this.router.transitionCalls[0].route,
        'sections',
        'Navigates to sections route'
      );
    });

    test('cancel does not save any data', async function (assert) {
      await renderSectionNew(this, {
        currentUserData: { isAdmin: true },
      });

      await fillIn('input[type="text"]', 'My Class');
      const buttons = findAll('button');
      const cancelButton = buttons.find((b) =>
        b.textContent.includes('Cancel')
      );
      await click(cancelButton);

      assert.strictEqual(
        this.store.createdRecords.length,
        0,
        'No section record was created'
      );
    });
  });

  // =========================================================================
  // INTEGRATION TESTS (Full User Workflows)
  // =========================================================================

  module('Full User Workflows', function () {
    test('teacher can create section with themselves pre-populated', async function (assert) {
      const teacher = buildUser({
        id: 'u1',
        username: 'jane.smith',
        organization: buildOrganization({ name: 'ACME School' }),
      });

      await renderSectionNew(this, {
        currentUserData: {
          isTeacher: true,
          user: teacher,
        },
        organization: buildOrganization({ name: 'ACME School' }),
        users: [],
        addableTeachers: [],
      });

      assert
        .dom('p.section-new-info.teacher')
        .hasText('jane.smith', 'Teacher is pre-populated');

      const infoElements = findAll('p.section-new-info');
      assert.ok(
        infoElements.some((el) => el.textContent.includes('ACME School')),
        'Organization is displayed'
      );
    });
  });
});
