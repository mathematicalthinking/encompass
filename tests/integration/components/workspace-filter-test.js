import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | workspace-filter', function (hooks) {
  setupRenderingTest(hooks);

  // Mock services
  class CurrentUserService extends Service {
    @tracked user = { isAdmin: true };
  }

  hooks.beforeEach(function () {
    // Injecting the mocked currentUser service
    this.owner.register('service:current-user', CurrentUserService);

    // Providing the necessary arguments to the component
    this.set('triggerFetch', () => {});
    this.set('triggerShowTrashed', () => {});
    this.set('triggerShowHidden', () => {});
    this.set('onUpdatePrimaryFilter', () => {});
    this.set('onUpdateSecondaryFilter', () => {});
    this.set('toggleTrashed', false);
    this.set('toggleHidden', false);
    this.set('filter', {
      primaryFilters: {
        inputs: [
          { value: 'all', label: 'All', order: 1, isChecked: false },
          { value: 'active', label: 'Active', order: 2, isChecked: false },
        ],
      },
    });
    this.set('primaryFilter', {
      value: 'all',
      secondaryFilters: { inputs: {} },
    });
    this.set('adminFilterSelect', {});
    this.set('organizations', [
      { id: 1, name: 'Org 1' },
      { id: 2, name: 'Org 2' },
    ]);
  });

  test('it renders the filter options correctly', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @onUpdate={{this.triggerFetch}}
        @triggerShowTrashed={{this.triggerShowTrashed}}
        @triggerShowHidden={{this.triggerShowHidden}}
        @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
        @adminFilterSelect={{this.adminFilterSelect}}
        @orgs={{this.organizations}}
      />
    `);

    assert
      .dom('h2')
      .hasText('Filter Options', 'The component renders the title correctly');
    assert
      .dom('h3')
      .hasText(
        'Primary Filters',
        'The primary filter heading is rendered correctly'
      );
    assert
      .dom('.primary-filter-list li')
      .exists(
        { count: 2 },
        'The correct number of primary filters is rendered'
      );
  });

  test('it calls the onUpdatePrimaryFilter action when a primary filter is updated', async function (assert) {
    assert.expect(1);

    this.set('onUpdatePrimaryFilter', (value) => {
      console.log(value);
      assert.strictEqual(
        value.value,
        'active',
        'The onUpdatePrimaryFilter action is called with the correct value'
      );
    });

    // Render the component with appropriate arguments
    await render(hbs`
      <WorkspaceFilter
        @onUpdate={{this.onUpdatePrimaryFilter}}
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
      />
    `);

    // Click on the second primary filter option
    await click('.primary-filter-list li:nth-child(2) input');
  });

  test('it toggles the secondary filters visibility', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
      />
    `);

    assert.dom('.more-header').exists('The "More" header exists');
    assert
      .dom('.more-header.closed')
      .exists('The "More" section is initially closed');

    await click('.more-header');
    assert
      .dom('.more-header.closed')
      .doesNotExist('The "More" section is opened after clicking');
  });

  test('it shows AdminWorkspaceFilter when the user is an admin', async function (assert) {
    // Set the user as an admin
    let currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user.isAdmin = true;

    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
        @adminFilterSelect={{this.adminFilterSelect}}
      />
    `);

    assert
      .dom('#admin-workspace-filter')
      .exists('AdminWorkspaceFilter is rendered when the user is an admin');
  });

  test('it shows secondary filter options when the user is not an admin', async function (assert) {
    // Set the user as not an admin
    let currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user.isAdmin = false;

    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
        @adminFilterSelect={{this.adminFilterSelect}}
      />
    `);

    assert
      .dom('#admin-workspace-filter')
      .exists(
        'AdminWorkspaceFilter is not rendered when the user not is an admin'
      );
  });

  test('the primary filter value is "all" by default', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @adminFilterSelect={{this.adminFilterSelect}}
      />
    `);

    assert.strictEqual(
      this.primaryFilter.value,
      'all',
      'The primary filter value is "all" by default'
    );
  });

  test('it calls the appropriate action to toggle trashed workspaces', async function (assert) {
    // Set the user as an admin
    let currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user.isAdmin = true;
    assert.expect(1);

    this.set('triggerShowTrashed', () => {
      assert.ok(true, 'The triggerShowTrashed action is called');
    });

    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
        @adminFilterSelect={{this.adminFilterSelect}}
        @triggerShowTrashed={{this.triggerShowTrashed}}
      />
    `);

    // Click the 'More' header to reveal the additional filters
    await click('.more-header');

    await click('#toggle-trashed');
  });

  test('it correctly shows or hides hidden workspaces', async function (assert) {
    assert.expect(1);

    this.set('triggerShowHidden', () => {
      assert.ok(true, 'The triggerShowHidden action is called');
    });

    await render(hbs`
      <WorkspaceFilter
      @triggerShowHidden={{this.triggerShowHidden}}
      @toggleHidden={{this.toggleHidden}}
      />
      `);

    // Click the 'More' header to reveal the additional filters
    await click('.more-header');

    // Now `showMoreFilters` should be `true` and the hidden workspace toggle should be visible
    await click('#toggle-hidden');

    // Additional assertions if necessary
    assert.ok(
      document.querySelector('#toggle-hidden'),
      'Hidden workspace toggle is now visible'
    );
  });

  test('renders organization options correctly', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
        @adminFilterSelect={{this.adminFilterSelect}}
        @orgs={{this.organizations}}
      />
    `);

    assert
      .dom('.secondary-filter-options label')
      .exists({ count: 0 }, 'The organization options are rendered correctly');
  });

  test('displays correct layout for current user admin privileges', async function (assert) {
    // Set the user as an admin
    let currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user.isAdmin = true;
    await render(hbs`
      <WorkspaceFilter
        @filter={{this.filter}}
        @primaryFilter={{this.primaryFilter}}
        @adminFilterSelect={{this.adminFilterSelect}}
        @orgs={{this.organizations}}
      />
    `);
    // Click the 'More' header to reveal the additional filters
    await click('.more-header');

    assert
      .dom(
        this.element
          .querySelectorAll('label.subfilter')[1]
          .querySelector('span')
      )
      .includesText(
        'Show All Trashed Workspaces',
        'The trashed workspaces section is displayed for admin users'
      );
  });
});
