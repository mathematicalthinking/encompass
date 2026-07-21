import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | ws-copy-config', function (hooks) {
  setupRenderingTest(hooks);

  const COPY_CONFIG = {
    groupName: 'copyConfig',
    required: true,
    inputs: [
      { value: 'A', label: 'Submissions Only' },
      { value: 'B', label: 'Submissions and Folder Structure' },
      { value: 'C', label: 'Everything' },
      { value: 'D', label: 'Custom' },
    ],
  };

  hooks.beforeEach(function () {
    // RadioGroup stub: a button per option that calls @updateValue(value)
    this.owner.register(
      'template:components/ui/radio-group',
      hbs`
        <div class='stub-radio {{@options.groupName}}'>
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

    // custom-config sub-step stub — we only assert it appears for config 'D'
    this.owner.register(
      'template:components/ws-copy-custom-config',
      hbs`<div class='stub-custom-config'>custom</div>`
    );
    this.owner.register('component:ws-copy-custom-config', templateOnly());

    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class='stub-error'>{{@error}}</div>`
    );
    this.owner.register('component:ui/error-box', templateOnly());
  });

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      copyConfig: COPY_CONFIG,
      newWsConfig: undefined,
      workspace: {},
      submissionThreads: [],
      proceededWith: undefined,
      backDirections: [],
      onProceed: (...args) => context.set('proceededWith', args),
      onBack: (dir) =>
        context.set('backDirections', [...context.backDirections, dir]),
      ...overrides,
    });
    return render(hbs`
      <WsCopyConfig
        @copyConfig={{this.copyConfig}}
        @newWsConfig={{this.newWsConfig}}
        @workspace={{this.workspace}}
        @submissionThreads={{this.submissionThreads}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
      />
    `);
  }

  const nextButton = '.nav-btn-container .primary-button:not(.cancel-button)';

  test('renders the copy-configuration options and the nav buttons', async function (assert) {
    await renderComponent(this);

    assert.dom('#ws-copy-config').exists();
    assert.dom('.stub-radio.copyConfig .opt').exists({ count: 4 });
    assert.dom('.nav-btn-container .cancel-button').hasText('Back');
    assert.dom(nextButton).hasText('Next');
    assert
      .dom('.stub-custom-config')
      .doesNotExist('custom sub-step hidden by default');
  });

  test('defaults to config A and proceeds with it via Next', async function (assert) {
    await renderComponent(this);

    await click(nextButton);

    assert.deepEqual(
      this.proceededWith,
      ['A'],
      'Next reports the default config to @onProceed'
    );
  });

  test('seeds the selection from @newWsConfig (back-button restore)', async function (assert) {
    await renderComponent(this, { newWsConfig: 'C' });

    await click(nextButton);

    assert.deepEqual(
      this.proceededWith,
      ['C'],
      'the previously chosen config is restored and proceeds'
    );
  });

  test('choosing Custom reveals the custom-config sub-step and hides the nav', async function (assert) {
    await renderComponent(this);
    assert.dom('.stub-custom-config').doesNotExist();

    await click('.stub-radio.copyConfig .opt[data-value="D"]');

    assert.dom('.stub-custom-config').exists('custom sub-step is shown');
    assert
      .dom(nextButton)
      .doesNotExist('the plain Next button is replaced by the custom sub-step');
  });

  test('Back calls @onBack with -1', async function (assert) {
    await renderComponent(this);

    await click('.cancel-button');

    assert.deepEqual(this.backDirections, [-1]);
  });
});
