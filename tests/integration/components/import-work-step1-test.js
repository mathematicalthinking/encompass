import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

class UtilityMethodsStub extends Service {
  isNonEmptyObject(value) {
    return (
      !!value && typeof value === 'object' && Object.keys(value).length > 0
    );
  }

  isNullOrUndefined(value) {
    return value === null || value === undefined;
  }
}

class SelectizeInputStub extends Component {
  get isStub() {
    return true;
  }
}
class ErrorBoxStub extends Component {
  get isStub() {
    return true;
  }
}

module('Integration | Component | import-work-step1', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const problemRecord = { id: 'problem-1', title: 'Linear Functions' };
    this.problemRecord = problemRecord;

    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register(
      'service:store',
      class extends Service {
        peekRecord(modelName, id) {
          if (modelName === 'problem' && id === 'problem-1') {
            return problemRecord;
          }
          return null;
        }
      }
    );

    this.owner.register('component:selectize-input', SelectizeInputStub);
    this.owner.register(
      'template:components/selectize-input',
      hbs`
        <div class='selectize-input-stub' data-input-id={{@inputId}}>
          <ul class='stub-initial-items'>
            {{#each @initialItems as |item|}}
              <li class='stub-item'>{{item}}</li>
            {{/each}}
          </ul>
          <button
            type='button'
            class='stub-add-problem'
            {{on 'click' (fn @onItemAdd 'problem-1' (hash added=true))}}
          >
            Add Problem
          </button>
          <button
            type='button'
            class='stub-remove-problem'
            {{on 'click' (fn @onItemRemove 'problem-1' null)}}
          >
            Remove Problem
          </button>
        </div>
      `
    );

    this.owner.register('component:ui/error-box', ErrorBoxStub);
    this.owner.register(
      'template:components/ui/error-box',
      hbs`
        <div class='error-box-stub'>
          <span class='error-text'>{{@error}}</span>
          <button
            type='button'
            class='dismiss-error'
            {{on 'click' @resetError}}
          >
            Dismiss
          </button>
        </div>
      `
    );
  });

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      selectedProblem: null,
      selectedSection: { id: 'section-1' },
      selectedValue: true,
      proceededProblem: null,
      proceedCount: 0,
      onProceed: (problem) => {
        context.proceededProblem = problem;
        context.proceedCount += 1;
      },
      ...overrides,
    });

    await render(hbs`
      <ImportWorkStep1
        @selectedProblem={{this.selectedProblem}}
        @selectedSection={{this.selectedSection}}
        @selectedValue={{this.selectedValue}}
        @onProceed={{this.onProceed}}
      />
    `);
  }

  test('it passes selected problem id into selectize initial items', async function (assert) {
    await renderComponent(this, {
      selectedProblem: { id: 'problem-1', title: 'Linear Functions' },
    });

    assert
      .dom('.selectize-input-stub')
      .hasAttribute('data-input-id', 'select-problem');
    assert.dom('.stub-item').exists({ count: 1 });
    assert.dom('.stub-item').hasText('problem-1');
  });

  test('it shows validation error when Next is clicked with no selected problem', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container .primary-button');

    assert.dom('.error-box-stub').exists();
    assert.dom('.error-text').hasText('Please select a problem');
    assert.strictEqual(this.proceedCount, 0, 'onProceed is not called');
  });

  test('it selects problem from store and calls onProceed on Next', async function (assert) {
    await renderComponent(this);

    await click('.stub-add-problem');
    await click('.nav-btn-container .primary-button');

    assert.strictEqual(
      this.proceededProblem,
      this.problemRecord,
      'selected store record is passed to onProceed'
    );
    assert.strictEqual(this.proceedCount, 1, 'onProceed is called once');
  });

  test('it clears validation error when a valid problem is selected', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container .primary-button');
    assert.dom('.error-box-stub').exists('error is shown after invalid next');

    await click('.stub-add-problem');
    assert
      .dom('.error-box-stub')
      .doesNotExist('error clears after selecting a problem');
  });

  test('it clears local selection on remove and blocks proceed', async function (assert) {
    await renderComponent(this);

    await click('.stub-add-problem');
    await click('.stub-remove-problem');
    await click('.nav-btn-container .primary-button');

    assert.strictEqual(
      this.proceedCount,
      0,
      'onProceed is not called after removal'
    );
    assert
      .dom('.error-box-stub')
      .exists('error returns when selection is removed');
  });

  test('it dismisses error through Ui::ErrorBox reset callback', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container .primary-button');
    assert.dom('.error-box-stub').exists();

    await click('.dismiss-error');
    assert.dom('.error-box-stub').doesNotExist();
  });
});
