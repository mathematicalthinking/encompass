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

module('Integration | Component | import-work-step2', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const sectionRecord = { id: 'section-1', name: 'Algebra Period 2' };
    this.sectionRecord = sectionRecord;

    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register(
      'service:store',
      class extends Service {
        peekRecord(modelName, id) {
          if (modelName === 'section' && id === 'section-1') {
            return sectionRecord;
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
            class='stub-add-section'
            {{on 'click' (fn @onItemAdd 'section-1' (hash added=true))}}
          >
            Add Section
          </button>
          <button
            type='button'
            class='stub-remove-section'
            {{on 'click' (fn @onItemRemove 'section-1' null)}}
          >
            Remove Section
          </button>
          <button
            type='button'
            class='stub-add-unknown-section'
            {{on 'click' (fn @onItemAdd 'section-unknown' (hash added=true))}}
          >
            Add Unknown Section
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
      selectedProblem: { id: 'problem-1', title: 'Linear Functions' },
      selectedSection: null,
      selectedValue: false,
      uploadedFileIdsParam: 'img-1,img-2',
      proceedPayload: null,
      proceedCount: 0,
      selectionPayloads: [],
      backDirections: [],
      onProceed: (payload) => {
        context.proceedPayload = payload;
        context.proceedCount += 1;
      },
      onSelectionChange: (payload) => {
        context.selectionPayloads = [...context.selectionPayloads, payload];
      },
      onBack: (direction) => {
        context.backDirections = [...context.backDirections, direction];
      },
      ...overrides,
    });

    await render(hbs`
      <ImportWorkStep2
        @selectedProblem={{this.selectedProblem}}
        @selectedSection={{this.selectedSection}}
        @selectedValue={{this.selectedValue}}
        @uploadedFileIdsParam={{this.uploadedFileIdsParam}}
        @onSelectionChange={{this.onSelectionChange}}
        @onBack={{this.onBack}}
        @onProceed={{this.onProceed}}
      />
    `);
  }

  test('it passes selected section id into selectize initial items', async function (assert) {
    await renderComponent(this, {
      selectedValue: true,
      selectedSection: { id: 'section-1', name: 'Algebra Period 2' },
    });

    assert
      .dom('.selectize-input-stub')
      .hasAttribute('data-input-id', 'select-class');
    assert.dom('.stub-item').exists({ count: 1 });
    assert.dom('.stub-item').hasText('section-1');
  });

  test('it proceeds with "No class" and clears section before sending payload', async function (assert) {
    await renderComponent(this, {
      selectedValue: false,
      selectedSection: { id: 'section-1', name: 'Legacy Section' },
    });

    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.strictEqual(this.proceedCount, 1, 'onProceed is called once');
    assert.false(
      this.proceedPayload.selectedValue,
      'payload confirms no class path'
    );
    assert.strictEqual(
      this.proceedPayload.selectedSection,
      null,
      'payload clears selected section'
    );
    assert.dom('.error-box-stub').doesNotExist();
  });

  test('it shows validation error when class matching is on without selected class', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.strictEqual(this.proceedCount, 0, 'onProceed is not called');
    assert.dom('.error-box-stub').exists();
    assert.dom('.error-text').hasText('Please select a class or no class');
  });

  test('it selects class from store and proceeds with class payload', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    await click('.stub-add-section');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.strictEqual(this.proceedCount, 1, 'onProceed is called');
    assert.true(
      this.proceedPayload.selectedValue,
      'payload keeps class matching enabled'
    );
    assert.strictEqual(
      this.proceedPayload.selectedSection,
      this.sectionRecord,
      'payload passes selected section record'
    );
    assert.dom('.error-box-stub').doesNotExist();
  });

  test('it clears validation error after class selection', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');
    assert.dom('.error-box-stub').exists('error appears after invalid next');

    await click('.stub-add-section');
    assert
      .dom('.error-box-stub')
      .doesNotExist('error is cleared after selecting class');
  });

  test('it calls onBack with -1', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container .cancel-button');

    assert.deepEqual(this.backDirections, [-1], 'back callback receives -1');
  });

  test('it sends selection change payloads when toggling class usage', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    await click('input[name="useClass"][value="false"]');

    assert.strictEqual(this.selectionPayloads.length, 2);
    assert.true(
      this.selectionPayloads[0].selectedValue,
      'first payload enables class usage'
    );
    assert.strictEqual(
      this.selectionPayloads[0].selectedSection,
      null,
      'no section selected yet on enable'
    );
    assert.false(
      this.selectionPayloads[1].selectedValue,
      'second payload disables class usage'
    );
    assert.strictEqual(
      this.selectionPayloads[1].selectedSection,
      null,
      'disable payload clears section'
    );
  });

  test('it sends selection payload on remove and on back', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    await click('.stub-add-section');
    await click('.stub-remove-section');
    await click('.nav-btn-container .cancel-button');

    assert.strictEqual(this.selectionPayloads.length, 4);
    assert.strictEqual(
      this.selectionPayloads[2].selectedSection,
      null,
      'remove payload clears selected section'
    );
    assert.strictEqual(
      this.selectionPayloads[3].selectedSection,
      null,
      'back payload keeps current cleared selection state'
    );
    assert.deepEqual(this.backDirections, [-1], 'back callback still fires');
  });

  test('it dismisses missing class validation error via Ui::ErrorBox reset callback', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');
    assert.dom('.error-box-stub').exists();

    await click('.dismiss-error');
    assert.dom('.error-box-stub').doesNotExist();
  });

  test('it shows selectize only when class usage is enabled', async function (assert) {
    await renderComponent(this);

    assert
      .dom('.selectize-input-stub')
      .doesNotExist('selectize hidden when class usage is disabled');

    await click('input[name="useClass"][value="true"]');
    assert
      .dom('.selectize-input-stub')
      .exists('selectize shown when class usage is enabled');

    await click('input[name="useClass"][value="false"]');
    assert
      .dom('.selectize-input-stub')
      .doesNotExist('selectize hidden again when class usage is disabled');
  });

  test('it ignores unknown section ids and keeps validation blocked', async function (assert) {
    await renderComponent(this);

    await click('input[name="useClass"][value="true"]');
    assert.strictEqual(this.selectionPayloads.length, 1);

    await click('.stub-add-unknown-section');
    assert.strictEqual(
      this.selectionPayloads.length,
      1,
      'unknown id does not emit additional selection payload'
    );

    await click('.nav-btn-container .primary-button:not(.cancel-button)');
    assert.strictEqual(
      this.proceedCount,
      0,
      'cannot proceed without valid class'
    );
    assert.dom('.error-box-stub').exists();
  });

  test('it ignores duplicate add callbacks for the already selected section', async function (assert) {
    await renderComponent(this, {
      selectedValue: true,
      selectedSection: this.sectionRecord,
    });

    assert.strictEqual(this.selectionPayloads.length, 0);

    await click('.stub-add-section');

    assert.strictEqual(
      this.selectionPayloads.length,
      0,
      'duplicate add with same section id is ignored'
    );
  });
});
