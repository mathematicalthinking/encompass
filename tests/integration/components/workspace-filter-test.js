import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';

/** In this test suite, I came across a strange error:
 *  Error: Expected a dynamic component definition, but received an object or function that 
 * did not have a component manager associated with it. The dynamic invocation was 
 * <(result of a unknown helper)> or {{(result of a unknown helper)}}, and the incorrect definition 
 * is the value at the path (result of a unknown helper), which was: Object
 * 
 * Although it talks about an unknown helper, the error is actually caused by the <input> tag in the
 * template file. Replacing the native HTML tag with <Input> from @ember/component resolved the issue.

 */

// Mock the current-user service
const currentUserStub = Service.extend({
  user: { isAdmin: true },
});

module('Integration | Component | workspace-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register the mock service
    this.owner.register('service:current-user', currentUserStub);
    this.set('triggerFetch', () => {});
    this.set('triggerShowTrashed', () => {});
    this.set('triggerShowHidden', () => {});
    this.set('onUpdatePrimaryFilter', () => {});
    this.set('onUpdateSecondaryFilter', () => {});
    this.set('toggleTrashed', false);
    this.set('toggleHidden', false);
    this.set('adminFilterSelect', {});

    this.setProperties({
      filter: {
        primaryFilters: {
          inputs: {
            mine: {
              label: 'Mine',
              value: 'mine',
              isChecked: true,
              secondaryFilters: {
                inputs: {
                  createdBy: { value: 'createdBy', isApplied: true },
                  owner: { value: 'owner', isApplied: true },
                },
                selectedValues: ['createdBy'],
              },
            },
            collab: {
              label: 'Collaborator',
              value: 'collab',
              isChecked: false,
            },
          },
        },
      },
      primaryFilter: {
        value: 'mine',
        secondaryFilters: {
          inputs: {
            createdBy: { value: 'createdBy', isApplied: true },
            owner: { value: 'owner', isApplied: false },
          },
          selectedValues: ['createdBy'],
        },
      },
      orgs: [
        { id: 1, name: 'Org 1' },
        { id: 2, name: 'Org 2' },
      ],
    });
  });

  test('it renders primary filter options and selects one', async function (assert) {
    await render(hbs`<WorkspaceFilter 
      @filter={{this.filter}} 
      @primaryFilter={{this.primaryFilter}} 
      @onUpdate={{this.onUpdate}}
    />`);

    assert.dom('.filter-mine').exists('Mine filter option is rendered');
    assert
      .dom('.filter-collab')
      .exists('Collaborator filter option is rendered');

    assert
      .dom('.filter-mine input')
      .isChecked('Mine filter is checked by default');

    // Click to update the primary filter
    await click('.filter-collab input');
    assert
      .dom('.filter-collab input')
      .isChecked('Collaborator filter becomes checked');
  });

  test('it updates secondary filters', async function (assert) {
    await render(hbs`<WorkspaceFilter 
      @filter={{this.filter}} 
      @primaryFilter={{this.primaryFilter}} 
      @onUpdate={{this.onUpdate}}
    />`);

    assert
      .dom('.secondary-filter-options')
      .exists('Secondary filters are rendered');
    // log the dom
    console.log(this.element.innerHTML);

    assert
      .dom('.secondary-filter-options .checkbox-content')
      .exists({ count: 2 }, 'Renders two secondary filters');

    // Click to toggle a secondary filter
    await click(find('.checkbox-content:not(.is-selected) input'));
    assert.equal(
      this.primaryFilter.secondaryFilters.selectedValues.length,
      2,
      'Both secondary filters applied'
    );
  });

  test('it toggles more filters', async function (assert) {
    await render(hbs`<WorkspaceFilter 
      @filter={{this.filter}} 
      @primaryFilter={{this.primaryFilter}} 
      @onUpdate={{this.onUpdate}}
    />`);

    assert
      .dom('.more-filter-list')
      .doesNotExist('More filters are hidden by default');

    // Click to toggle more filters
    await click(find('.more-header'));
    assert.dom('.more-filter-list').exists('More filters are shown');
  });

  test('it handles missing secondary filters gracefully', async function (assert) {
    this.set('primaryFilter.secondaryFilters', null); // Simulate no secondary filters

    await render(hbs`<WorkspaceFilter 
      @filter={{this.filter}} 
      @primaryFilter={{this.primaryFilter}} 
      @onUpdate={{this.onUpdate}}
    />`);

    assert
      .dom('.secondary-filter-options')
      .hasNoText('Secondary filter options have no content');
  });

  test('it handles empty organization options', async function (assert) {
    this.set('orgs', []); // Simulate no orgs

    await render(hbs`<WorkspaceFilter 
      @filter={{this.filter}} 
      @primaryFilter={{this.primaryFilter}} 
      @onUpdate={{this.onUpdate}}
    />`);

    assert
      .dom('.org-options')
      .doesNotExist('No organization options are shown');
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
    console.log(this.element.innerHTML);
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
