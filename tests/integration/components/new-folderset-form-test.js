import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | new-folderset-form', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // RadioGroup stub: a button per privacy option calling @updateValue(value)
    this.owner.register(
      'template:components/ui/radio-group',
      hbs`
        <div class='stub-radio {{@options.groupName}}' data-selected='{{@selectedValue}}'>
          {{#each @options.inputs as |input|}}
            <button
              type='button'
              class='opt'
              data-value='{{input.value}}'
              {{on 'click' (fn @updateValue input.value)}}
            >{{input.label}}</button>
          {{/each}}
        </div>
      `
    );
    this.owner.register('component:ui/radio-group', templateOnly());
  });

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      name: undefined,
      privacySetting: undefined,
      nameErrors: [],
      privacyErrors: [],
      nameValue: undefined,
      privacyValue: undefined,
      onNameChange: (v) => context.set('nameValue', v),
      onPrivacyChange: (v) => context.set('privacyValue', v),
      ...overrides,
    });
    return render(hbs`
      <NewFoldersetForm
        @name={{this.name}}
        @privacySetting={{this.privacySetting}}
        @nameErrors={{this.nameErrors}}
        @privacyErrors={{this.privacyErrors}}
        @onNameChange={{this.onNameChange}}
        @onPrivacyChange={{this.onPrivacyChange}}
      />
    `);
  }

  test('renders the name input and privacy options, defaulting to Private', async function (assert) {
    await renderComponent(this);

    assert.dom('#new-folderset-form').exists();
    assert.dom('input#folderset-name').exists();
    assert.dom('.stub-radio.privacySetting .opt').exists({ count: 3 });
    assert
      .dom('.stub-radio.privacySetting')
      .hasAttribute('data-selected', 'M', 'privacy defaults to Private');
  });

  test('reflects the @name argument in the input', async function (assert) {
    await renderComponent(this, { name: 'My Folder Set' });

    assert.dom('input#folderset-name').hasValue('My Folder Set');
  });

  test('typing the name reports up through @onNameChange', async function (assert) {
    await renderComponent(this);

    await fillIn('input#folderset-name', 'Geometry set');

    assert.strictEqual(this.nameValue, 'Geometry set');
  });

  test('choosing a privacy option reports up through @onPrivacyChange', async function (assert) {
    await renderComponent(this);

    await click('.stub-radio.privacySetting .opt[data-value="E"]');

    assert.strictEqual(this.privacyValue, 'E');
  });
});
