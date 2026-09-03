import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | primary-list-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Stub inputState with a controllable in-memory selection.
    const state = {
      options: [
        { value: 'mine', label: 'Mine', icon: 'i-mine' },
        { value: 'all', label: 'All', icon: 'i-all' },
      ],
      selectionValue: 'mine',
      subOptions: [{ value: 'trashed', label: 'Trashed', icon: 'i-trash' }],
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
          return state.selectionValue;
        }
        getSelectionValue() {
          return state.selectionValue;
        }
        getSubOptions() {
          return state.subOptions;
        }
        getSubSelections() {
          return state.subSelections;
        }
        setSelection(name, val) {
          state.selectionValue = val;
        }
        setSubSelection() {}
      }
    );
    this.owner.register('service:current-user', class extends Service {});

    // Stub the RadioFilter child to a button that reports the option back.
    this.owner.register(
      'template:components/ui/radio-filter',
      hbs`<button type='button' class='radio-stub' {{on 'click' (fn @onClick @inputValue)}}>{{@labelName}}</button>`
    );
    this.owner.register('component:ui/radio-filter', templateOnly());
  });

  test('renders a radio option per main option', async function (assert) {
    await render(hbs`<PrimaryListFilter @filterName='ws' />`);

    assert.dom('.radio-stub').exists({ count: 2 });
    assert.dom('.filter-mine').exists();
    assert.dom('.filter-all').exists();
  });

  test('selecting a main option updates the selection and calls onUpdate', async function (assert) {
    let updated = 0;
    this.set('onUpdate', () => (updated += 1));

    await render(
      hbs`<PrimaryListFilter @filterName='ws' @onUpdate={{this.onUpdate}} />`
    );

    // second option is 'all'
    await click('.filter-all .radio-stub');

    assert.strictEqual(this.state.selectionValue, 'all', 'selection set to all');
    assert.strictEqual(updated, 1, 'onUpdate fired once');
  });

  test('shows the sub-options for the active selection', async function (assert) {
    await render(hbs`<PrimaryListFilter @filterName='ws' />`);

    // 'mine' is active by default; its sub-options render as checkboxes
    assert.dom('.secondary-filter-options .trashed').exists();
  });
});
