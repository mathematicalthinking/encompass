import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | ws-copy-permissions', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Stub the collaborator search box. It only needs to let a test add a
    // collaborator by clicking, calling `@onItemAdd(id, item)`.
    this.owner.register(
      'template:components/selectize-input',
      hbs`
        <div class='stub-selectize' id='{{@inputId}}'>
          <button
            type='button'
            class='add-collab'
            {{on 'click' (fn @onItemAdd 'u9' 'item')}}
          >add</button>
        </div>
      `
    );
    this.owner.register('component:selectize-input', templateOnly());

    // Stub the per-user permissions editor. Exposes buttons to fire the three
    // callbacks the parent wires: @onSave, @onSubViewChange, @stopEditing.
    this.owner.register(
      'template:components/ws-permissions-new',
      hbs`
        <div class='stub-perm-editor'>
          <span class='editing-user'>{{@selectedUser.username}}</span>
          <button
            type='button'
            class='stub-save'
            {{on 'click' (fn @onSave (hash user=@selectedUser global='viewOnly'))}}
          >save</button>
          <button
            type='button'
            class='stub-subview-on'
            {{on 'click' (fn @onSubViewChange true)}}
          >open sub-view</button>
          <button
            type='button'
            class='stub-stop'
            {{on 'click' @stopEditing}}
          >stop</button>
        </div>
      `
    );
    this.owner.register('component:ws-permissions-new', templateOnly());

    // next() pops a confirmation modal only when a collaborator is mid-edit.
    class AlertStub extends Service {
      showModal() {
        return Promise.resolve({ value: true });
      }
    }
    this.owner.register('service:sweet-alert', AlertStub);
  });

  const nextButton = '.nav-btn-container .primary-button:not(.cancel-button)';

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      newWsPermissions: undefined,
      newWsOwner: { id: 'owner1' },
      submissionsPool: [],
      workspace: {},
      proceededWith: undefined,
      backDirections: [],
      onProceed: (perms) => context.set('proceededWith', perms),
      onBack: (dir) =>
        context.set('backDirections', [...context.backDirections, dir]),
      ...overrides,
    });
    return render(hbs`
      <WsCopyPermissions
        @newWsPermissions={{this.newWsPermissions}}
        @newWsOwner={{this.newWsOwner}}
        @submissionsPool={{this.submissionsPool}}
        @workspace={{this.workspace}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
      />
    `);
  }

  test('renders the collaborator picker and nav with no collaborators added', async function (assert) {
    await renderComponent(this);

    assert.dom('#ws-copy-permissions').exists();
    assert.dom('.stub-selectize').exists('collaborator search box renders');
    assert
      .dom('.collaborator-list')
      .doesNotExist('no added-collaborator list when empty');
    assert
      .dom('.stub-perm-editor')
      .doesNotExist('editor is hidden until a collaborator is selected');
    assert.dom('.nav-btn-container .cancel-button').hasText('Back');
    assert.dom(nextButton).hasText('Next');
  });

  test('prefills the added-collaborator list from @newWsPermissions', async function (assert) {
    await renderComponent(this, {
      newWsPermissions: [
        { user: { id: 'u1', username: 'alice' } },
        { user: { id: 'u2', username: 'bob' } },
      ],
    });

    assert.dom('.collaborator-list li').exists({ count: 2 });
    assert.dom('.collaborator-list').includesText('alice');
    assert.dom('.collaborator-list').includesText('bob');
    assert
      .dom(
        '.collaborator-list li:first-child [aria-label="Modify collaborator"]'
      )
      .exists('each row has an edit button');
  });

  test('Back calls @onBack with -1', async function (assert) {
    await renderComponent(this);

    await click('.cancel-button');

    assert.deepEqual(this.backDirections, [-1], 'moves back one step');
  });

  test('Next with no active edit passes the permissions to @onProceed', async function (assert) {
    const perms = [{ user: { id: 'u1', username: 'alice' } }];
    await renderComponent(this, { newWsPermissions: perms });

    await click(nextButton);

    assert.deepEqual(
      this.proceededWith,
      perms,
      '@onProceed receives the current permissions'
    );
  });

  test('removing a collaborator drops them from the list', async function (assert) {
    await renderComponent(this, {
      newWsPermissions: [
        { user: { id: 'u1', username: 'alice' } },
        { user: { id: 'u2', username: 'bob' } },
      ],
    });

    assert.dom('.collaborator-list li').exists({ count: 2 });

    await click(
      '.collaborator-list li:first-child [aria-label="Remove collaborator"]'
    );

    assert.dom('.collaborator-list li').exists({ count: 1 });
    assert.dom('.collaborator-list').doesNotIncludeText('alice');
    assert.dom('.collaborator-list').includesText('bob');
  });

  test('editing a collaborator opens the permissions editor for that user', async function (assert) {
    await renderComponent(this, {
      newWsPermissions: [{ user: { id: 'u1', username: 'alice' } }],
    });
    assert.dom('.stub-perm-editor').doesNotExist();

    await click('[aria-label="Modify collaborator"]');

    assert.dom('.stub-perm-editor').exists('editor is revealed');
    assert.dom('.editing-user').hasText('alice', 'for the chosen collaborator');
  });

  test('the sub-view callback hides the Back/Next buttons', async function (assert) {
    await renderComponent(this, {
      newWsPermissions: [{ user: { id: 'u1', username: 'alice' } }],
    });
    await click('[aria-label="Modify collaborator"]');
    assert.dom('.nav-btn-container').exists('nav visible while editing');

    await click('.stub-subview-on');

    assert
      .dom('.nav-btn-container')
      .doesNotExist('nav hidden while the submission sub-view is open');
  });

  test('saving from the editor closes it and keeps the collaborator', async function (assert) {
    await renderComponent(this, {
      newWsPermissions: [{ user: { id: 'u1', username: 'alice' } }],
    });
    await click('[aria-label="Modify collaborator"]');
    assert.dom('.stub-perm-editor').exists();

    await click('.stub-save');

    assert.dom('.stub-perm-editor').doesNotExist('editor closes after save');
    assert
      .dom('.collaborator-list li')
      .exists({ count: 1 }, 'collaborator stays in the list');
    assert.dom('.collaborator-list').includesText('alice');
  });
});
