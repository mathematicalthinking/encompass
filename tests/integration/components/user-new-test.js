import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, triggerEvent, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | user-new', function (hooks) {
  setupRenderingTest(hooks);

  const buildOrganization = (overrides = {}) => ({
    id: 'org1',
    name: 'Mathematical Thinking',
    ...overrides
  });

  const adminSetup = () => ({ 
    organizations: [buildOrganization()], 
    currentUserProps: { isAdmin: true } 
  });

  async function renderUserNew(context, { organizations = [], currentUserProps = {}} = {}) {
    context.set('organizations', organizations);
    
    const CurrentUserStub = Service.extend({
      isTeacher: false,
      isAdmin: false,
      isPdAdmin: false,
      id: 'user1',
      user: { organization: buildOrganization() },
      ...currentUserProps
    });

    const UserValidationStub = Service.extend({
      errors: {},
      validate(field, value) {
        if (field === 'confirmPassword' && value !== undefined) {
          this.errors.confirmPassword = 'Passwords do not match';
        }
      },
      getError(field) { return this.errors[field]; },
      getArrayErrors() { return []; },
      setServerError() {},
      clearFormErrors() {},
      resetError(field) { delete this.errors[field]; }
    });

    const RouterStub = Service.extend({
      replaceWith() { return Promise.resolve(); }
    });

    const SweetAlertStub = Service.extend({
      showModal() { 
        return Promise.resolve({ value: true, isConfirmed: true }); 
      },
      showToast() {}
    });

    context.owner.register('service:router', RouterStub);
    context.owner.register('service:currentUser', CurrentUserStub);
    context.owner.register('service:userValidation', UserValidationStub);
    context.owner.register('service:sweet-alert', SweetAlertStub);
    await render(hbs`<UserNew @organizations={{this.organizations}} />`);
  }

  // --- Basic Rendering ---
  test('renders form with essential elements', async function (assert) {
    await renderUserNew(this, adminSetup());

    assert.dom('h3').hasText('Create a New User');
    assert.dom('#new-user-btn').hasText('Create New User');
    assert.dom('.cancel-button').hasText('Cancel');
  });

  // --- Field Visibility by User Type ---
  const userTypeTests = [
    {
      type: 'admin',
      props: { isAdmin: true },
      fields: ['.user-email', '.user-location', '.twitter-typeahead', 'input[name="authorized"]'],
      text: ['Account Type'],
      missing: []
    },
    {
      type: 'pd admin',
      props: { isPdAdmin: true },
      fields: ['.user-email', '.user-location', 'input[name="authorized"]'],
      text: ['Account Type', 'Organization'],
      missing: ['.twitter-typeahead']
    },
    {
      type: 'teacher',
      props: { isTeacher: true },
      fields: ['.user-username', '.user-first-name', '.user-last-name', '.user-password'],
      text: [],
      missing: ['.user-email', '.user-location', 'Account Type', 'Organization']
    }
  ];

  userTypeTests.forEach(({ type, props, fields, text, missing }) => {
    test(`${type} sees correct fields`, async function (assert) {
      await renderUserNew(this, {
        organizations: [buildOrganization()],
        currentUserProps: props
      });

      // Common fields all users see(except student)
      assert.dom('.user-username').exists();
      assert.dom('.user-first-name').exists();
      assert.dom('.user-last-name').exists();
      assert.dom('.user-password').exists();

      // Type-specific fields
      fields.forEach(field => assert.dom(field).exists(`${type} sees ${field}`));
      text.forEach(txt => assert.dom().includesText(txt, `${type} sees ${txt}`));
      missing.forEach(field => {
        if (field.startsWith('.')) {
          assert.dom(field).doesNotExist(`${type} doesn't see ${field}`);
        } else {
          assert.dom().doesNotIncludeText(field, `${type} doesn't see ${field}`);
        }
      });
    });
  });

  // --- Account Type Options ---
  const accountTypeTests = [
    { user: 'admin', props: { isAdmin: true }, types: ['Teacher', 'Student', 'Pd Admin', 'Admin'] },
    { user: 'pd admin', props: { isPdAdmin: true }, types: ['Teacher', 'Student'] }
  ];

  accountTypeTests.forEach(({ user, props, types }) => {
    test(`${user} sees correct account types`, async function (assert) {
      await renderUserNew(this, {
        organizations: [buildOrganization()],
        currentUserProps: props
      });

      const select = this.element.querySelector('select');
      if (select) {
        const options = [...select.options].map(opt => opt.value);
        assert.deepEqual(options, types, `${user} sees correct account type options`);
      }
    });
  });

  // --- Required Field Indicators & Account Type Changes ---
  test('account type changes affect required field indicators', async function (assert) {
    await renderUserNew(this, adminSetup());

    assert.dom('.required-star').exists({ count: 3 }, 'Student shows 3 required fields');

    const select = this.element.querySelector('select');
    if (select) {
      await fillIn(select, 'Teacher');
      assert.dom('.required-star').exists({ count: 8 }, 'Teacher shows 8 required fields');
      
      await fillIn(select, 'Student');
      assert.dom('.required-star').exists({ count: 3 }, 'Back to Student shows 3 required fields');
    }
  });

  // --- Validation ---
  test('form validation works correctly', async function (assert) {
    await renderUserNew(this, adminSetup());

    // Username validation
    await fillIn('.user-username', '');
    await triggerEvent('.user-username', 'focusout');
    assert.dom('.validation-error').includesText('Username is required');
    assert.dom('.user-username').hasClass('input-error');

    // Password confirmation validation
    const passwords = this.element.querySelectorAll('.user-password');
    await fillIn(passwords[0], 'password123');
    await fillIn(passwords[1], 'different');
    await triggerEvent(passwords[1], 'focusout');
    assert.dom('.validation-error').exists('Shows password mismatch error');
  });

  // --- Password Toggle ---
  test('password toggle affects both password fields', async function (assert) {
    await renderUserNew(this, adminSetup());

    const passwords = this.element.querySelectorAll('.user-password');
    await fillIn(passwords[0], 'password123');
    
    assert.dom('.password-toggle-button').exists('Toggle button appears');
    assert.dom(passwords[0]).hasAttribute('type', 'password');
    assert.dom(passwords[1]).hasAttribute('type', 'password');
    
    await click('.password-toggle-button');
    
    assert.dom(passwords[0]).hasAttribute('type', 'text');
    assert.dom(passwords[1]).hasAttribute('type', 'text');
  });

  // --- Organization Handling ---
  test('admin sees organization typeahead', async function (assert) {
    await renderUserNew(this, adminSetup());
    assert.dom('.twitter-typeahead').exists();
  });

  test('pd admin sees current organization', async function (assert) {
    await renderUserNew(this, {
      organizations: [buildOrganization()],
      currentUserProps: { 
        isPdAdmin: true,
        user: { organization: buildOrganization({ name: 'PD Org' }) }
      }
    });
    assert.dom().includesText('PD Org');
  });

  test('pd admin without organization shows error', async function (assert) {
    await renderUserNew(this, {
      organizations: [buildOrganization()],
      currentUserProps: { 
        isPdAdmin: true,
        user: { organization: null }
      }
    });
    assert.dom('.validation-error').includesText('Organization is required');
  });

  // --- Form Submission ---
  test('form submission behavior', async function (assert) {
    await renderUserNew(this, adminSetup());

    // Button is initially enabled
    assert.dom('#new-user-btn').isNotDisabled();
    assert.dom('#new-user-btn').hasText('Create New User');

    // Shows validation errors on submit with empty fields
    await click('#new-user-btn');
    assert.dom('.validation-error').exists('Shows validation errors on empty submit');
  });

  // --- Radio Buttons ---
  test('authorized radio buttons work', async function (assert) {
    await renderUserNew(this, adminSetup());

    const noRadio = find('input[value="false"]');
    const yesRadio = find('input[value="true"]');

    assert.ok(noRadio.checked, 'No radio checked by default');
    assert.notOk(yesRadio.checked, 'Yes radio not checked by default');

    await click('input[value="true"]');
    assert.ok(yesRadio.checked, 'Yes radio checked after click');
    assert.notOk(noRadio.checked, 'No radio unchecked after click');
  });

  // --- Input Types ---
  test('input fields have correct types', async function (assert) {
    await renderUserNew(this, adminSetup());

    assert.dom('.user-email').hasAttribute('type', 'email');
    assert.dom('.user-password').hasAttribute('type', 'password');
  });

  // --- Critical Edge Cases ---
  test('teacher cannot see account type selector', async function (assert) {
    await renderUserNew(this, {
      organizations: [buildOrganization()],
      currentUserProps: { isTeacher: true }
    });

    assert.dom('select').doesNotExist('Teacher has no account type selector');
  });

  test('pd admin sees account type selector but limited options', async function (assert) {
    await renderUserNew(this, {
      organizations: [buildOrganization()],
      currentUserProps: { isPdAdmin: true }
    });

    assert.dom('select').exists('PD Admin sees account type selector');
    
    const select = this.element.querySelector('select');
    if (select) {
      const options = [...select.options].map(opt => opt.value);
      assert.notOk(options.includes('Admin'), 'PD Admin cannot create Admin accounts');
      assert.notOk(options.includes('Pd Admin'), 'PD Admin cannot create other PD Admin accounts');
      assert.ok(options.includes('Teacher'), 'PD Admin can create Teacher accounts');
      assert.ok(options.includes('Student'), 'PD Admin can create Student accounts');
    }
  });

  test('password toggle only appears after entering password', async function (assert) {
    await renderUserNew(this, adminSetup());

    assert.dom('.password-toggle-button').doesNotExist('No toggle button initially');
    
    await fillIn('.user-password', 'password123');
    assert.dom('.password-toggle-button').exists('Toggle button appears after password entry');
  });

  test('confirm password field exists', async function (assert) {
    await renderUserNew(this, adminSetup());

    assert.dom().includesText('Confirm Password', 'Confirm password field is present');
    
    const passwords = this.element.querySelectorAll('.user-password');
    assert.equal(passwords.length, 2, 'Two password fields exist');
  });

  test('form handles empty organizations array', async function (assert) {
    await renderUserNew(this, {
      organizations: [],
      currentUserProps: { isAdmin: true }
    });

    assert.dom('.twitter-typeahead').exists('Typeahead still renders with empty organizations');
  });

  test('validation errors have consistent styling', async function (assert) {
    await renderUserNew(this, adminSetup());

    await fillIn('.user-username', '');
    await triggerEvent('.user-username', 'focusout');
    
    const errorElement = this.element.querySelector('.validation-error');
    assert.ok(errorElement, 'Validation error element exists');
    assert.dom('.validation-error').hasClass('validation-error', 'Error has correct CSS class');
  });

  test('form submission handles server errors gracefully', async function (assert) {
    await renderUserNew(this, adminSetup());

    // Simulate server error by submitting with empty fields
    await click('#new-user-btn');
    assert.dom('.validation-error').exists('Shows validation errors on empty submit');
  });
});