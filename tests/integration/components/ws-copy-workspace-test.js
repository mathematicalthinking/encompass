import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | ws-copy-workspace', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // the component looks workspaces up by id via the store
    this.records = {};
    const records = this.records;
    this.owner.register(
      'service:store',
      class extends Service {
        peekRecord(type, id) {
          return records[id] || null;
        }
      }
    );

    // selectize stub: buttons to add / remove a workspace, mirroring
    // @onItemAdd(id, item) / @onItemRemove(id, null)
    this.owner.register(
      'template:components/selectize-input',
      hbs`
        <div class='stub-selectize' id='{{@inputId}}'>
          <button type='button' class='pick' {{on 'click' (fn @onItemAdd 'ws1' 'item')}}>pick</button>
          <button type='button' class='clear' {{on 'click' (fn @onItemRemove 'ws1' null)}}>clear</button>
        </div>
      `
    );
    this.owner.register('component:selectize-input', templateOnly());

    this.owner.register(
      'template:components/workspace-info-summary',
      hbs`<div class='stub-info-summary'>{{@workspace.id}}</div>`
    );
    this.owner.register('component:workspace-info-summary', templateOnly());

    // error box stub — shows the message and a dismiss that calls @resetError
    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class='stub-error'>{{@error}}<button type='button' class='dismiss' {{on 'click' @resetError}}>x</button></div>`
    );
    this.owner.register('component:ui/error-box', templateOnly());
  });

  function makeWorkspace(overrides = {}) {
    const data = {
      id: 'ws1',
      name: 'WS One',
      submissionsLength: 3,
      ...overrides,
    };
    return { id: data.id, get: (key) => data[key] };
  }

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      selectedWorkspace: null,
      fromWorkspaceList: false,
      showLoadingSubmissions: false,
      loadSubmissionErrors: [],
      selected: 'unset',
      proceedCount: 0,
      onSelectWorkspace: (ws) => context.set('selected', ws),
      onProceed: () => context.set('proceedCount', context.proceedCount + 1),
      ...overrides,
    });
    return render(hbs`
      <WsCopyWorkspace
        @selectedWorkspace={{this.selectedWorkspace}}
        @fromWorkspaceList={{this.fromWorkspaceList}}
        @showLoadingSubmissions={{this.showLoadingSubmissions}}
        @loadSubmissionErrors={{this.loadSubmissionErrors}}
        @onSelectWorkspace={{this.onSelectWorkspace}}
        @onProceed={{this.onProceed}}
      />
    `);
  }

  const nextButton = '.nav-btn-container .primary-button';

  test('renders the workspace picker and Next when not from the list', async function (assert) {
    await renderComponent(this);

    assert.dom('#ws-copy-workspace').exists();
    assert.dom('.stub-selectize').exists('the workspace search box renders');
    assert.dom(nextButton).hasText('Next');
    assert.dom('.stub-info-summary').doesNotExist('nothing selected yet');
  });

  test('hides the picker when arriving from the workspace list', async function (assert) {
    await renderComponent(this, { fromWorkspaceList: true });

    assert.dom('.stub-selectize').doesNotExist('picker hidden');
    assert.dom(nextButton).exists('Next still available');
  });

  test('shows the info summary for the selected workspace', async function (assert) {
    await renderComponent(this, { selectedWorkspace: makeWorkspace() });

    assert.dom('.stub-info-summary').exists().hasText('ws1');
  });

  test('picking a workspace calls @onSelectWorkspace with the store record', async function (assert) {
    const ws = makeWorkspace();
    this.records.ws1 = ws;
    await renderComponent(this);

    await click('.pick');

    assert.strictEqual(this.selected, ws, 'the resolved record is handed up');
  });

  test('clearing the picker calls @onSelectWorkspace with null', async function (assert) {
    await renderComponent(this);

    await click('.clear');

    assert.strictEqual(this.selected, null, 'removal clears the parent value');
  });

  test('Next with no selection shows the missing-workspace error', async function (assert) {
    await renderComponent(this, { selectedWorkspace: null });

    await click(nextButton);

    assert.dom('.stub-error').hasTextContaining('Please select a workspace');
    assert.strictEqual(this.proceedCount, 0, 'does not advance');
  });

  test('Next with a submission-less workspace shows the too-few error', async function (assert) {
    await renderComponent(this, {
      selectedWorkspace: makeWorkspace({ submissionsLength: 0 }),
    });

    await click(nextButton);

    assert.dom('.stub-error').hasTextContaining('at least 1 submission');
    assert.strictEqual(this.proceedCount, 0, 'does not advance');
  });

  test('Next with a valid workspace calls @onProceed', async function (assert) {
    await renderComponent(this, {
      selectedWorkspace: makeWorkspace({ submissionsLength: 3 }),
    });

    await click(nextButton);

    assert.strictEqual(this.proceedCount, 1, 'advances to the next step');
    assert.dom('.stub-error').doesNotExist('no validation error');
  });
});
