import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | form-validator', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.fixture = document.querySelector('#qunit-fixture');
    this.fixture.innerHTML = `
      <form id="validator-form">
        <input id="required-name" type="text" required>
        <input id="optional-note" type="text">
        <input id="required-check" type="checkbox">
      </form>
    `;
    this.service = this.owner.lookup('service:form-validator');
  });

  hooks.afterEach(function () {
    this.fixture.innerHTML = '';
  });

  test('initialize tracks required input changes', function (assert) {
    let checkFormCalls = 0;
    this.service.initialize('#validator-form', () => {
      checkFormCalls += 1;
    });

    const requiredInput = document.querySelector('#required-name');
    requiredInput.value = 'Ada';
    requiredInput.dispatchEvent(new Event('change', { bubbles: true }));

    assert.false(this.service.isPristine);
    assert.true(this.service.isDirty);
    assert.true(this.service.isValid);
    assert.strictEqual(checkFormCalls, 0);
  });

  test('validate identifies and marks missing required inputs', async function (assert) {
    this.service.initialize('#validator-form');

    const result = await this.service.validate('#validator-form');
    const requiredInput = document.querySelector('#required-name');

    assert.false(result.isValid);
    assert.strictEqual(result.invalidInputs.length, 1);
    assert.true(requiredInput.classList.contains('required-error'));
    assert.true(this.service.isSubmitted);
  });

  test('validate rejects a missing form id', async function (assert) {
    await assert.rejects(this.service.validate(), /Invalid form id!/);
  });

  test('clearForm resets values and pristine state', function (assert) {
    this.service.initialize('#validator-form');
    const requiredInput = document.querySelector('#required-name');
    const checkbox = document.querySelector('#required-check');
    requiredInput.value = 'Ada';
    checkbox.checked = true;
    this.service.isPristine = false;

    this.service.clearForm();

    assert.strictEqual(requiredInput.value, '');
    assert.false(checkbox.checked);
    assert.true(this.service.isPristine);
  });
});
