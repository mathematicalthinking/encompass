import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | admin-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const state = {
      options: [{ value: 'org', label: 'Org', type: 'checkbox' }],
      selection: { type: 'checkbox' },
      subOptions: [
        { value: 'trashed', label: 'Trashed', icon: 'i-trash' },
        { value: 'hidden', label: 'Hidden', icon: 'i-hidden' },
      ],
      subSelections: [],
    };
    this.state = state;

    this.owner.register(
      'service:input-state',
      class extends Service {
        getOptions() {
          return state.options;
        }
        getSelection() {
          return state.selection;
        }
        getSubOptions() {
          return state.subOptions;
        }
        getSubSelections() {
          return state.subSelections;
        }
        setSelection() {}
        setSubSelection(name, value, on) {
          state.lastSub = { value, on };
        }
        setListState() {}
      }
    );
    this.owner.register('service:utility-methods', class extends Service {});

    // SelectizeInput drags in jQuery/selectize; stub it to a no-op.
    this.owner.register(
      'template:components/selectize-input',
      hbs`<div class='selectize-stub'></div>`
    );
    this.owner.register('component:selectize-input', templateOnly());
  });

  test('renders the find-by dropdown and the sub-option checkboxes', async function (assert) {
    await render(hbs`<AdminFilter @filterName='adm' />`);

    assert.dom('#admin-filter').exists();
    assert.dom('.selectize-stub').exists('the main find-by dropdown renders');
    assert
      .dom('.secondary-filter-options .checkbox-content')
      .exists({ count: 2 }, 'a checkbox per sub-option');
  });

  test('toggling a sub-option checkbox reports it and calls onUpdate', async function (assert) {
    let updated = 0;
    this.set('onUpdate', () => (updated += 1));

    await render(hbs`<AdminFilter @filterName='adm' @onUpdate={{this.onUpdate}} />`);

    await click('#trashed');

    assert.deepEqual(
      this.state.lastSub,
      { value: 'trashed', on: true },
      'the toggled sub-option is set on'
    );
    assert.strictEqual(updated, 1, 'onUpdate fired');
  });
});
