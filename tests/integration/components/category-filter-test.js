import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | category-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const state = { subSelections: [], lastSub: null };
    this.state = state;

    this.owner.register(
      'service:input-state',
      class extends Service {
        getSubOptions() {
          return [{ value: 'includeSubCats', label: 'Include Subcategories' }];
        }
        getSubSelections() {
          return state.subSelections;
        }
        setSubSelection(name, value, on) {
          state.lastSub = { value, on };
        }
        setListState() {}
      }
    );
    this.owner.register('service:store', class extends Service {});

    // Heavy children -> no-op stubs.
    this.owner.register('template:components/selectize-input', hbs`<div class='selectize-stub'></div>`);
    this.owner.register('component:selectize-input', templateOnly());
    this.owner.register('template:components/categories-menu', hbs`<div class='cats-menu-stub'></div>`);
    this.owner.register('component:categories-menu', templateOnly());
  });

  test('renders the empty state and the include-subcategories toggle', async function (assert) {
    await render(hbs`<CategoryFilter @filterName='cat' />`);

    assert.dom('.selectize-stub').exists('category search input renders');
    assert.dom('#toggle-sub-cats').exists('include-subcategories checkbox renders');
    assert.dom('p').hasText('No categories selected.');
  });

  test('opening the category menu shows the modal', async function (assert) {
    await render(hbs`<CategoryFilter @filterName='cat' />`);

    await click('.show-category-btn');

    assert.dom('#category-list-modal').exists('the category picker modal opens');
    assert.dom('.cats-menu-stub').exists();
  });

  test('toggling include-subcategories reports it and calls onUpdate', async function (assert) {
    let updated = 0;
    this.set('onUpdate', () => (updated += 1));

    await render(hbs`<CategoryFilter @filterName='cat' @onUpdate={{this.onUpdate}} />`);

    await click('#toggle-sub-cats');

    assert.deepEqual(this.state.lastSub, { value: 'includeSubCats', on: true });
    assert.strictEqual(updated, 1, 'onUpdate fired');
  });
});
