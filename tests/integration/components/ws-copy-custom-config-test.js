import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';

module('Integration | Component | ws-copy-custom-config', function (hooks) {
  setupRenderingTest(hooks);

  // a minimal Ember-Data-like record: record.get(key) reads a plain hash
  function rec(data) {
    return { ...data, get: (key) => data[key] };
  }

  // a workspace stub whose .get(relationship) returns an array of records
  function makeWorkspace(overrides = {}) {
    const data = {
      submissions: [rec({ id: 's1' }), rec({ id: 's2' })],
      selections: [],
      comments: [],
      responses: [],
      folders: [rec({ id: 'f1' })],
      ...overrides,
    };
    return { get: (key) => data[key] };
  }

  hooks.beforeEach(function () {
    // selectize + viewer stubs — the viewer exposes a Done button
    this.owner.register(
      'template:components/selectize-input',
      hbs`<div class='stub-selectize' id='{{@inputId}}'></div>`
    );
    this.owner.register('component:selectize-input', templateOnly());

    this.owner.register(
      'template:components/custom-submission-viewer-list',
      hbs`<div class='stub-viewer'>
        <button type='button' class='done' {{on 'click' @onDone}}>done</button>
        <button type='button' class='select-all' {{on 'click' @onSelectAll}}>all</button>
      </div>`
    );
    this.owner.register(
      'component:custom-submission-viewer-list',
      templateOnly()
    );
  });

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      workspace: makeWorkspace(),
      submissionThreads: null,
      proceededWith: undefined,
      backDirections: [],
      onProceed: (config) => context.set('proceededWith', config),
      onBack: (dir) =>
        context.set('backDirections', [...context.backDirections, dir]),
      ...overrides,
    });
    return render(hbs`
      <WsCopyCustomConfig
        @workspace={{this.workspace}}
        @submissionThreads={{this.submissionThreads}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
      />
    `);
  }

  const nextButton = '.nav-btn-container .primary-button:not(.cancel-button)';
  const subRadio = (v) => `input[name="submissionOptions"][value="${v}"]`;

  test('renders the five option groups defaulting to All', async function (assert) {
    await renderComponent(this);

    assert.dom('#ws-copy-custom-config').exists();
    assert.dom('.custom-config-content').exists({ count: 5 });
    assert.dom(subRadio('all')).isChecked('submissions default to All');
    assert
      .dom('.custom-config-content.submissions .sub-input-label')
      .hasTextContaining('2 submissions to copy', 'counts the workspace subs');
  });

  test('choosing Custom submissions reveals the viewer and hides the nav', async function (assert) {
    await renderComponent(this);
    assert.dom('.stub-viewer').doesNotExist();

    await click(subRadio('custom'));

    assert.dom('.stub-viewer').exists('the submission viewer opens');
    assert.dom(nextButton).doesNotExist('nav hidden while the viewer is open');
  });

  test('Done in the viewer closes it and restores the nav', async function (assert) {
    await renderComponent(this);
    await click(subRadio('custom'));
    assert.dom('.stub-viewer').exists();

    await click('.stub-viewer .done');

    assert.dom('.stub-viewer').doesNotExist('viewer closed');
    assert.dom(nextButton).exists('nav restored');
    assert.dom('.show-viewer').exists('a "Show Viewer" link appears');
  });

  test('proceeds with the default (all) formatted config', async function (assert) {
    await renderComponent(this);

    await click(nextButton);

    assert.deepEqual(
      this.proceededWith,
      {
        submissionOptions: { all: true },
        folderOptions: { all: true, includeStructureOnly: false },
        selectionOptions: { all: true },
        commentOptions: { all: true },
        responseOptions: { all: true },
      },
      'the formatted config reflects all-selected defaults'
    );
  });

  test('choosing None for selections formats selectionOptions as none', async function (assert) {
    await renderComponent(this);

    await click('input[name="selectionOptions"][value="none"]');
    await click(nextButton);

    assert.deepEqual(this.proceededWith.selectionOptions, { none: true });
  });

  test('Back calls @onBack with -1', async function (assert) {
    await renderComponent(this);

    await click('.cancel-button');

    assert.deepEqual(this.backDirections, [-1]);
  });
});
