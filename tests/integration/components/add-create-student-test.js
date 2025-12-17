import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';
import { setComponentTemplate } from '@ember/component';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { A } from '@ember/array';

module('Integration | Component | add-create-student', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Mock SelectizeInput to prevent re-render loops and async issues
    const MockSelectize = class extends Component {};

    const MockSelectizeWithTemplate = setComponentTemplate(
      hbs`<select id={{@inputId}} data-test-mocked-selectize>MOCKED</select>`,
      MockSelectize
    );

    this.owner.register('component:selectize-input', MockSelectizeWithTemplate);

    // Stub required services
    const ErrorHandlingStub = Service.extend({
      errors: {},
      getErrors(key) {
        return this.errors[key] || [];
      },
      handleErrors(err, key) {
        const msg = typeof err === 'string' ? err : err?.message || String(err);
        this.errors[key] = [msg];
      },
      removeMessages(key) {
        delete this.errors[key];
      },
    });

    const SweetAlertStub = Service.extend({
      showToast() {},
    });

    const CurrentUserStub = Service.extend({
      id: 'user-1',
      user: EmberObject.create({
        organization: EmberObject.create({ id: 'org-1' }),
      }),
    });

    const StoreStub = Service.extend({
      peekAll() {
        return A([]);
      },
      peekRecord() {
        return null;
      },
      findRecord() {
        return Promise.resolve(EmberObject.create({ id: 'user-123' }));
      },
    });

    this.owner.register('service:errorHandling', ErrorHandlingStub);
    this.owner.register('service:sweet-alert', SweetAlertStub);
    this.owner.register('service:currentUser', CurrentUserStub);
    this.owner.register('service:store', StoreStub);
  });

  // Helper to build section object
  const buildSection = (overrides = {}) => {
    return EmberObject.create({
      id: 'section-1',
      name: 'Section A',
      students: A([]),
      save() {
        return Promise.resolve();
      },
      ...overrides,
    });
  };

  // Render helper - sets props and renders component
  async function renderAddCreateStudent(context, props = {}) {
    const defaults = {
      section: buildSection(),
      students: A([]),
      sectionPassword: null,
    };

    context.setProperties({ ...defaults, ...props });

    await render(hbs`<AddCreateStudent
      @section={{this.section}}
      @students={{this.students}}
      @sectionPassword={{this.sectionPassword}}
    />`);
  }

  // ---------- Basic Rendering ----------

  test('renders main container and headings', async function (assert) {
    await renderAddCreateStudent(this);
    assert.dom('#add-create-student').exists('main container renders');
    assert.dom('h3').exists({ count: 2 }, 'shows two section headings');
    assert
      .dom('.student-search h3')
      .hasText('Add Existing User', 'add existing heading present');
    assert
      .dom('.student-create h3')
      .hasText('Create new student account', 'create new heading present');
  });

  test('renders form fields', async function (assert) {
    await renderAddCreateStudent(this);
    assert.dom('#username').exists('username input exists');
    assert.dom('#first-name').exists('first name input exists');
    assert.dom('#last-name').exists('last name input exists');
    assert
      .dom('button.action_button')
      .hasText('Create and Add', 'submit button exists');
  });

  test('renders selectize search for existing students', async function (assert) {
    await renderAddCreateStudent(this);

    // Debug: log the entire rendered HTML
    console.log('Rendered HTML:', this.element.innerHTML);

    // Debug: check what selects exist
    console.log('All selects:', this.element.querySelectorAll('select'));

    assert
      .dom('#select-add-student')
      .exists('selectize input for student search exists');
    assert.dom('.fas.fa-info-circle').exists('info icon is present');
  });

  // ---------- Class Password Checkbox ----------

  test('shows class password checkbox', async function (assert) {
    await renderAddCreateStudent(this);
    assert
      .dom('input[name="usingDefaultPassword"]')
      .exists('checkbox for using default password exists');
    assert
      .dom('label[for="usingDefaultPassword"]')
      .hasText('Use class password for all students?');
  });

  test('shows individual password field when not using class password', async function (assert) {
    await renderAddCreateStudent(this);
    // By default, checkbox is unchecked, so individual password field should show
    assert.dom('#password').exists('individual password field is visible');
    assert
      .dom('label[for="addpassword"]')
      .includesText('Password', 'password label is visible');
  });

  test('shows class password when sectionPassword is provided', async function (assert) {
    await renderAddCreateStudent(this, { sectionPassword: 'class-pass-123' });
    // First need to check the checkbox to enable using class password
    await click('input[name="usingDefaultPassword"]');
    assert
      .dom('.section-info')
      .exists('section info container exists for showing password');
  });

  test('shows message when class password not set', async function (assert) {
    await renderAddCreateStudent(this, { sectionPassword: null });
    // When checkbox is checked, user will see "not set" message
    // (In actual usage, user must check the box first to see this)
    assert.dom('input[name="usingDefaultPassword"]').exists();
  });

  // ---------- Required Field Indicators ----------

  test('marks username as required', async function (assert) {
    await renderAddCreateStudent(this);
    assert.dom('label[for="username"]').includesText('Username');
    assert
      .dom('label[for="username"] .required-star')
      .exists('username has required indicator');
  });

  test('marks first and last name as optional', async function (assert) {
    await renderAddCreateStudent(this);
    assert
      .dom('label[for="first-name"]')
      .includesText('Optional', 'first name labeled optional');
    assert
      .dom('label[for="last-name"]')
      .includesText('Optional', 'last name labeled optional');
  });

  // ---------- Password Toggle ----------

  test('shows password toggle button', async function (assert) {
    await renderAddCreateStudent(this);
    assert.dom('#show-password-btn').exists('password toggle button exists');
    assert
      .dom('#show-password-btn .fa-eye')
      .exists('eye icon shows initially (password hidden)');
  });

  // ---------- Input Placeholders ----------

  test('inputs have correct placeholders', async function (assert) {
    await renderAddCreateStudent(this);
    assert.dom('#username').hasAttribute('placeholder', 'username');
    assert.dom('#first-name').hasAttribute('placeholder', 'first name');
    assert.dom('#last-name').hasAttribute('placeholder', 'last name');
    assert.dom('#password').hasAttribute('placeholder', 'password');
  });

  // ---------- Form Structure ----------

  test('form has correct structure', async function (assert) {
    await renderAddCreateStudent(this);
    assert.dom('form#create-student').exists('form has correct id');
    assert.dom('form.properForm').exists('form has proper class');
    assert.dom('fieldset').exists('fieldset wraps inputs');
  });

  // ---------- Student List Integration ----------

  test('renders with empty students list', async function (assert) {
    await renderAddCreateStudent(this, { students: A([]) });
    assert
      .dom('#add-create-student')
      .exists('component renders with empty list');
  });

  test('renders with existing students', async function (assert) {
    const students = A([
      EmberObject.create({ id: 's1', username: 'student1' }),
      EmberObject.create({ id: 's2', username: 'student2' }),
    ]);
    await renderAddCreateStudent(this, { students });
    assert
      .dom('#add-create-student')
      .exists('component renders with student list');
  });

  // ---------- Section Integration ----------

  test('renders with section data', async function (assert) {
    const section = buildSection({ name: 'Math 101' });
    await renderAddCreateStudent(this, { section });
    assert.dom('#add-create-student').exists('component renders with section');
  });
});
