import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | details-list-item', function (hooks) {
  setupRenderingTest(hooks);

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      label: 'Selected Problem',
      currentStep: 2,
      associatedStep: 1,
      displayValue: 'Problem A',
      emptyValue: 'No Problem',
      isArray: false,
      children: null,
      cannotBeRemoved: false,
      editCalls: [],
      onEdit: (step) => context.editCalls.push(step),
      ...overrides,
    });

    await render(hbs`
      <ul>
        <DetailsListItem
          @label={{this.label}}
          @currentStep={{this.currentStep}}
          @associatedStep={{this.associatedStep}}
          @displayValue={{this.displayValue}}
          @emptyValue={{this.emptyValue}}
          @isArray={{this.isArray}}
          @children={{this.children}}
          @cannotBeRemoved={{this.cannotBeRemoved}}
          @editValue={{this.onEdit}}
        />
      </ul>
    `);
  }

  test('it renders when current step has reached associated step', async function (assert) {
    await renderComponent(this, {
      currentStep: 3,
      associatedStep: 2,
      displayValue: 'Problem 3',
    });

    assert.dom('.details-list-item').exists();
    assert.dom('.detail-header').includesText('Selected Problem');
    assert.dom('.display-info').hasText('Problem 3');
  });

  test('it does not render when current step is below associated step', async function (assert) {
    await renderComponent(this, {
      currentStep: 1,
      associatedStep: 2,
    });

    assert.dom('.details-list-item').doesNotExist();
  });

  test('it renders array display values as sub-list children', async function (assert) {
    await renderComponent(this, {
      isArray: true,
      displayValue: ['alpha', 'beta', 'gamma'],
    });

    assert
      .dom('.sub-content-child')
      .exists({ count: 3 }, 'array values are rendered as child list items');
    assert.dom('.sub-list').includesText('alpha');
    assert.dom('.sub-list').includesText('beta');
    assert.dom('.sub-list').includesText('gamma');
  });

  test('it shows edit button when a child has value and triggers callback with associated step', async function (assert) {
    await renderComponent(this, {
      displayValue: null,
      currentStep: 4,
      children: [
        { label: 'Class', displayValue: null, emptyValue: 'No Class' },
        {
          label: 'Workspace',
          displayValue: 'WS-1',
          emptyValue: 'No Workspace',
        },
      ],
      associatedStep: 4,
    });

    assert
      .dom('.detail-edit-button')
      .exists('edit button is shown when child contains a display value');
    assert.dom('.sub-list').includesText('WS-1');

    await click('.detail-edit-button');

    assert.deepEqual(
      this.editCalls,
      [4],
      'edit callback receives the associated step'
    );
  });

  test('it hides edit button when cannotBeRemoved is true', async function (assert) {
    await renderComponent(this, {
      displayValue: 'Problem A',
      cannotBeRemoved: true,
    });

    assert.dom('.detail-edit-button').doesNotExist();
  });
});
