import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module('Integration | Component | workspace-info', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const store = this.owner.lookup('service:store');

    class UtilityMethodsService extends Service {
      isNonEmptyObject(obj) {
        return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
      }
      isNonEmptyArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
      }
    }

    class CurrentUserService extends Service {
      user = {
        id: 'current-user',
        username: 'currentuser',
        accountType: 'A',
        isAdmin: true,
        isStudent: false,
      };
    }

    class SweetAlertService extends Service {}

    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:sweet-alert', SweetAlertService);

    // Stub the child components so the container renders in isolation, wiring
    // each stub to fire the closures the container passes down.
    const register = (name, tmpl) => {
      this.owner.register(`template:components/${name}`, tmpl);
      this.owner.register(`component:${name}`, templateOnly());
    };
    register(
      'workspace-info-settings',
      hbs`<div class='stub-settings'>{{if @canEdit 'can-edit' 'read-only'}}</div>`
    );
    register('workspace-info-stats', hbs`<div class='stub-stats'></div>`);
    register(
      'workspace-info-collaborators',
      hbs`<div class='stub-collaborators'>
        <button
          type='button'
          class='open-viewer'
          {{on 'click' @toggleIsShowingCustomViewer}}
        >toggle</button>
      </div>`
    );
    register(
      'custom-submission-viewer-list',
      hbs`<div class='stub-viewer'>
        <span class='sel-count'>{{@selectedSubmissionIds.length}}</span>
        <button type='button' class='sel-all' {{on 'click' @onSelectAll}}>all</button>
        <button type='button' class='unsel-all' {{on 'click' @onUnselectAll}}>none</button>
        <button
          type='button'
          class='sel-one'
          {{on 'click' (fn @onSelect 'sub-9')}}
        >one</button>
        <button type='button' class='done' {{on 'click' @onDone}}>done</button>
      </div>`
    );

    const workspace = store.createRecord('workspace', {
      id: 'ws-1',
      name: 'Test Workspace',
      workspaceType: 'individual',
      owner: store.createRecord('user', { id: 'owner-1', username: 'owner' }),
      permissions: [],
      submissions: [
        store.createRecord('submission', { id: 'sub-1' }),
        store.createRecord('submission', { id: 'sub-2' }),
      ],
    });

    this.set('workspace', workspace);
    this.set('originalCollaborators', A([]));
  });

  async function renderComponent(context) {
    return render(hbs`
      <WorkspaceInfo
        @workspace={{this.workspace}}
        @originalCollaborators={{this.originalCollaborators}}
      />
    `);
  }

  test('renders the workspace name and the settings, collaborators, and stats panels', async function (assert) {
    await renderComponent(this);

    assert.dom('#workspace-info h2').hasText('Test Workspace');
    assert.dom('.stub-settings').exists('renders the settings panel');
    assert.dom('.stub-collaborators').exists('renders the collaborators panel');
    assert.dom('.stub-stats').exists('renders the stats panel');
    assert.dom('.stub-viewer').doesNotExist('custom viewer is hidden initially');
  });

  test('toggling the custom viewer shows it and hides the settings and stats panels', async function (assert) {
    await renderComponent(this);

    await click('.open-viewer');

    assert.dom('.stub-viewer').exists('custom viewer is shown');
    assert.dom('.stub-settings').doesNotExist('settings panel is hidden');
    assert.dom('.stub-stats').doesNotExist('stats panel is hidden');
    assert
      .dom('.stub-collaborators')
      .exists('collaborators panel stays rendered');
  });

  test('select-all fills the selected ids from the workspace submissions and unselect-all clears them', async function (assert) {
    await renderComponent(this);
    await click('.open-viewer');

    assert.dom('.sel-count').hasText('0', 'starts with nothing selected');

    await click('.sel-all');
    assert
      .dom('.sel-count')
      .hasText('2', 'select-all pulls both submission ids');

    await click('.unsel-all');
    assert.dom('.sel-count').hasText('0', 'unselect-all clears the list');
  });

  test('selecting a single submission toggles its id in the list', async function (assert) {
    await renderComponent(this);
    await click('.open-viewer');

    await click('.sel-one');
    assert.dom('.sel-count').hasText('1', 'adds the id on first click');

    await click('.sel-one');
    assert.dom('.sel-count').hasText('0', 'removes the same id on second click');
  });

  test('passes canEdit to the settings panel for the workspace creator', async function (assert) {
    // Non-admin, but the creator — exercises belongsTo('createdBy').id().
    const store = this.owner.lookup('service:store');
    const currentUser = this.owner.lookup('service:current-user');
    currentUser.user.accountType = 'T';
    currentUser.user.id = 'creator-1';
    this.workspace.createdBy = store.createRecord('user', { id: 'creator-1' });

    await renderComponent(this);
    await settled();

    assert.dom('.stub-settings').hasText('can-edit');
  });
});
