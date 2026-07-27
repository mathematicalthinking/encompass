import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

module('Integration | Component | workspace-list-item', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // record the last route transition
    this.transitions = [];
    const transitions = this.transitions;
    this.owner.register(
      'service:router',
      class extends Service {
        transitionTo(...args) {
          transitions.push(args);
        }
      }
    );

    // permissions: allow copy + delete by default (overridable per test)
    const perms = (this.perms = { canCopy: () => true, canDelete: () => true });
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canCopy(ws) {
          return perms.canCopy(ws);
        }
        canDelete(ws) {
          return perms.canDelete(ws);
        }
      }
    );

    this.owner.register('service:sweet-alert', class extends Service {});
    this.owner.register('service:store', class extends Service {});
  });

  function makeWorkspace(overrides = {}) {
    const data = {
      id: 'ws1',
      name: 'My Workspace',
      mode: 'private',
      isTrashed: false,
      submissionsLength: 3,
      selectionsLength: 2,
      commentsLength: 1,
      responsesLength: 0,
      ...overrides,
    };
    return { ...data, get: (key) => data[key] };
  }

  function renderComponent(context, overrides = {}) {
    context.setProperties({
      workspace: makeWorkspace(),
      currentUser: {
        isStudent: false,
        isAdmin: true,
        get: (key) => (key === 'hiddenWorkspaces' ? [] : undefined),
      },
      isList: true,
      isGrid: false,
      ...overrides,
    });
    return render(hbs`
      <WorkspaceListItem
        @workspace={{this.workspace}}
        @currentUser={{this.currentUser}}
        @isList={{this.isList}}
        @isGrid={{this.isGrid}}
      />
    `);
  }

  test('renders the workspace row in list mode', async function (assert) {
    await renderComponent(this);

    assert.dom('.workspace-list-item').exists();
    assert.dom('.item-container').exists('list layout');
    assert.dom('.item-section.name').includesText('My Workspace');
    assert.dom('.item-section.submissions').hasText('3');
    assert.dom('.click-menu').doesNotExist('menu closed initially');
  });

  test('the ellipsis toggles the more-menu open and closed', async function (assert) {
    await renderComponent(this);

    await click('.item-section.more');
    assert.dom('.click-menu').exists('menu opens');

    await click('.item-section.more');
    assert.dom('.click-menu').doesNotExist('menu closes on second click');
  });

  test('the menu shows Copy/Assign/Hide/Delete for an admin', async function (assert) {
    await renderComponent(this);

    await click('.item-section.more');

    assert.dom('.click-menu .icon-text').exists({ count: 4 });
    assert.dom('.click-menu').includesText('Copy');
    assert.dom('.click-menu').includesText('Assign');
    assert.dom('.click-menu').includesText('Hide');
    assert.dom('.click-menu').includesText('Delete');
  });

  test('a student does not see the Assign option', async function (assert) {
    await renderComponent(this, {
      currentUser: {
        isStudent: true,
        isAdmin: false,
        get: () => [],
      },
    });

    await click('.item-section.more');

    assert.dom('.click-menu').doesNotIncludeText('Assign');
    assert.dom('.click-menu').includesText('Copy');
  });

  test('Copy navigates to the copy route with the workspace id', async function (assert) {
    await renderComponent(this);
    await click('.item-section.more');

    await click('.click-menu li'); // Copy is the first option

    assert.deepEqual(this.transitions, [
      ['workspaces.copy', { queryParams: { workspace: 'ws1' } }],
    ]);
    assert.dom('.click-menu').doesNotExist('menu closes after choosing');
  });

  test('a trashed workspace only offers Restore', async function (assert) {
    await renderComponent(this, {
      workspace: makeWorkspace({ isTrashed: true }),
    });

    await click('.item-section.more');

    assert.dom('.click-menu .icon-text').exists({ count: 1 });
    assert.dom('.click-menu').includesText('Restore');
  });
});
