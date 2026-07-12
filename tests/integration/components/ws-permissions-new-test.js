import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Component from '@glimmer/component';

module('Integration | Component | ws-permissions-new', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Stub Ui::RadioGroup as a set of buttons so a test can pick a value by
    // clicking `.stub-radio.<groupName> .opt[data-value="<value>"]`.
    class RadioGroupStub extends Component {}
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
    this.owner.register('component:ui/radio-group', RadioGroupStub);

    // Stub the submission viewer — we only care that it renders when custom
    // submissions are chosen.
    class CustomViewerStub extends Component {}
    this.owner.register(
      'template:components/custom-submission-viewer-list',
      hbs`<div class='stub-custom-viewer'>viewer</div>`
    );
    this.owner.register(
      'component:custom-submission-viewer-list',
      CustomViewerStub
    );
  });

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      selectedUser: { id: 'u1', username: 'alice' },
      permissions: [],
      workspace: {},
      submissionsPool: [],
      onSave: () => {},
      stopEditing: () => {},
      onSubViewChange: () => {},
      ...overrides,
    });
    return render(hbs`
      <WsPermissionsNew
        @selectedUser={{this.selectedUser}}
        @permissions={{this.permissions}}
        @workspace={{this.workspace}}
        @submissionsPool={{this.submissionsPool}}
        @onSave={{this.onSave}}
        @stopEditing={{this.stopEditing}}
        @onSubViewChange={{this.onSubViewChange}}
      />
    `);
  }

  const saveButton = 'button.primary-button:not(.cancel-button)';

  test('renders the submissions and workspace-permission groups for the selected user', async function (assert) {
    await renderComponent(this);

    assert.dom('#ws-permissions-new').exists();
    assert.dom('.username').hasText('alice');
    assert.dom('.stub-radio.submissions').exists();
    assert.dom('.stub-radio.global').exists();
    // the per-aspect groups are hidden until the global is "custom"
    assert.dom('.stub-radio.selections').doesNotExist();
  });

  test('Cancel calls @stopEditing and does not save', async function (assert) {
    let stopCalls = 0;
    let saveCalls = 0;
    await renderComponent(this, {
      stopEditing: () => (stopCalls += 1),
      onSave: () => (saveCalls += 1),
    });

    await click('.cancel-button');

    assert.strictEqual(stopCalls, 1, '@stopEditing fired');
    assert.strictEqual(saveCalls, 0, 'nothing saved on cancel');
  });

  test('Save builds the default (View Only) permissions object and calls @onSave', async function (assert) {
    let saved;
    await renderComponent(this, { onSave: (p) => (saved = p) });

    await click(saveButton);

    assert.strictEqual(saved.global, 'viewOnly');
    assert.deepEqual(
      {
        folders: saved.folders,
        selections: saved.selections,
        comments: saved.comments,
        feedback: saved.feedback,
      },
      { folders: 1, selections: 1, comments: 1, feedback: 'none' },
      'View Only maps to the lowest levels'
    );
    assert.deepEqual(saved.submissions, {
      all: true,
      userOnly: false,
      submissionIds: [],
    });
    assert.strictEqual(saved.user, this.selectedUser, 'includes the user');
  });

  test('the Editor preset maps to the right folder/selection/comment/feedback levels', async function (assert) {
    let saved;
    await renderComponent(this, { onSave: (p) => (saved = p) });

    await click('.stub-radio.global .opt[data-value="editor"]');
    await click(saveButton);

    assert.deepEqual(
      {
        folders: saved.folders,
        selections: saved.selections,
        comments: saved.comments,
        feedback: saved.feedback,
      },
      { folders: 3, selections: 4, comments: 4, feedback: 'none' }
    );
  });

  test('choosing the Custom workspace permission reveals the per-aspect groups', async function (assert) {
    await renderComponent(this);
    assert.dom('.stub-radio.selections').doesNotExist();

    await click('.stub-radio.global .opt[data-value="custom"]');

    ['selections', 'comments', 'folders', 'feedback'].forEach((group) =>
      assert.dom(`.stub-radio.${group}`).exists(`${group} group is shown`)
    );
  });

  test('choosing Custom submissions opens the viewer and notifies @onSubViewChange', async function (assert) {
    let subViewCalls = [];
    await renderComponent(this, {
      onSubViewChange: (val) => subViewCalls.push(val),
    });

    // notified once on init: submissions default to "all", so the viewer is hidden
    assert.deepEqual(subViewCalls, [false], 'parent notified on init');
    assert.dom('.stub-custom-viewer').doesNotExist();

    await click('.stub-radio.submissions .opt[data-value="custom"]');

    assert.dom('.stub-custom-viewer').exists('viewer shows for custom submissions');
    assert.strictEqual(
      subViewCalls[subViewCalls.length - 1],
      true,
      'parent notified the viewer is now showing (so it can hide the nav buttons)'
    );
  });
});
