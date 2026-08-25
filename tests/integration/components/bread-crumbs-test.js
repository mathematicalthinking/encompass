import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | bread-crumbs', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.items = [
      { id: 'a', name: 'First' },
      { id: 'b', name: 'Second' },
      { id: 'c', name: 'Third' },
    ];
  });

  test('renders a crumb per item with sequential display values', async function (assert) {
    this.set('items', this.items);

    await render(hbs`<BreadCrumbs @items={{this.items}} />`);

    assert.dom('.bread-crumbs-item').exists({ count: 3 });
    assert
      .dom('.bread-crumbs-item')
      .includesText('1', 'the first crumb shows display value 1');
  });

  test('clicking a crumb fires onSelect with that item', async function (assert) {
    let selected = null;
    this.set('items', this.items);
    this.set('onSelect', (item) => (selected = item));

    await render(
      hbs`<BreadCrumbs @items={{this.items}} @onSelect={{this.onSelect}} />`
    );

    await click('.bread-crumbs-item:last-child');

    assert.strictEqual(
      selected,
      this.items[2],
      'onSelect receives the clicked item'
    );
  });

  test('the selected item is marked active', async function (assert) {
    this.set('items', this.items);
    this.set('selectedItem', this.items[1]);

    await render(
      hbs`<BreadCrumbs @items={{this.items}} @selectedItem={{this.selectedItem}} />`
    );

    assert.dom('.active-crumb').exists({ count: 1 });
    assert
      .dom('.bread-crumbs-item.active-crumb')
      .includesText('2', 'the second crumb is the active one');
  });
});
