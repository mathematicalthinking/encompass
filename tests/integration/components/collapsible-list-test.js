import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | collapsible-list', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CollapsibleList />`);

    assert.equal(this.element.textContent.trim(), '');

    await render(hbs`
    <CollapsibleList @noInfo="No users available">
    </CollapsibleList>
  `);

    assert.equal(
      this.element.textContent.trim(),
      'No users available',
      'Renders noInfo text when no users are provided'
    );
  });
});
