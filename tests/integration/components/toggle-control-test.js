import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | toggle-control', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // options are indexed by toggle state (0, 1, 2)
    this.options = [
      { icon: 'icon-zero' },
      { icon: 'icon-one' },
      { icon: 'icon-two' },
    ];
  });

  test('renders the label and the icon for the initial state', async function (assert) {
    this.set('opts', this.options);

    await render(
      hbs`<ToggleControl @label='Sort' @options={{this.opts}} @initialState={{0}} @classToAdd='my-toggle' />`
    );

    assert.dom('.my-toggle').includesText('Sort');
    assert.dom('.my-toggle i').hasClass('icon-zero');
  });

  test('clicking cycles the state and reports the new value via onUpdate', async function (assert) {
    let reported = null;
    this.set('opts', this.options);
    this.set('onUpdate', (v) => (reported = v));

    await render(
      hbs`<ToggleControl @label='Sort' @options={{this.opts}} @initialState={{1}} @onUpdate={{this.onUpdate}} @classToAdd='my-toggle' />`
    );

    await click('.my-toggle span');

    assert.strictEqual(
      reported,
      this.options[2],
      'state 1 → 2 reports options[2]'
    );
  });

  test('the icon updates to the newly selected state', async function (assert) {
    this.set('opts', this.options);

    await render(
      hbs`<ToggleControl @label='Sort' @options={{this.opts}} @initialState={{1}} @classToAdd='my-toggle' />`
    );

    await click('.my-toggle span');

    assert.dom('.my-toggle i').hasClass('icon-two', 'icon reflects the new state');
  });
});
