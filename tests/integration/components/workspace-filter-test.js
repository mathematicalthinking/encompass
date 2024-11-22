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

// Mock CurrentUser service
class MockCurrentUserService extends Service {
  user = {
    displayName: 'Test User',
    email: 'test@example.com',
    isAdmin: true,
  };
}

module('Integration | Component | workspace-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register the mock service
    this.owner.register('service:current-user', MockCurrentUserService);

    // Set up the required properties and actions
    this.setProperties({
      filterName: 'all',
      adminFilterName: null,
      showTrashed: false,
      showHidden: false,
      triggerFetch: () => {},
      triggerShowTrashed: () => {},
      triggerShowHidden: () => {},
      toggleTrashed: () => {},
      toggleHidden: () => {},
    });
  });

  test('it renders primary filter options and toggles more filters', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @filterName={{this.filterName}}
        @adminFilterName={{this.adminFilterName}}
        @onUpdate={{this.triggerFetch}}
        @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
      />
    `);

    assert
      .dom('h2')
      .hasText('Filter Options', 'Filter options title is rendered');

    assert
      .dom('.more-header.closed')
      .exists('More filters section is initially closed');

    // Click to toggle the more filters section
    await click('.more-header');
    assert
      .dom('.more-header.closed')
      .doesNotExist('The "More" section opens after clicking');
    assert.dom('.more-filter-list').exists('More filters list is shown');
  });

  test('it toggles hidden workspaces', async function (assert) {
    assert.expect(1);

    this.set('triggerShowHidden', () => {
      assert.ok(true, 'The triggerShowHidden action is called');
    });

    await render(hbs`
      <WorkspaceFilter
        @showHidden={{this.showHidden}}
        @toggleHidden={{this.triggerShowHidden}}
        @toggleTrashed={{this.toggleTrashed}}
      />
    `);

    await click('.more-header'); // Reveal the additional filters
    await click('#toggle-hidden'); // Trigger hidden workspaces toggle
  });

  test('it toggles trashed workspaces when user is admin', async function (assert) {
    assert.expect(1);

    this.set('toggleTrashed', () => {
      assert.ok(true, 'The toggleTrashed action is called');
    });

    await render(hbs`
      <WorkspaceFilter
        @showTrashed={{this.showTrashed}}
        @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
      />
    `);

    await click('.more-header'); // Reveal the additional filters
    await click('#toggle-trashed'); // Trigger trashed workspaces toggle
  });

  test('it displays admin-specific filters for admin users', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @showTrashed={{this.showTrashed}}
        @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
      />
    `);

    await click('.more-header'); // Reveal the additional filters
    assert
      .dom('#toggle-trashed')
      .exists('The trashed workspaces toggle is visible for admin users');
    assert
      .dom('#toggle-trashed + span')
      .includesText(
        'Show All Trashed Workspaces',
        'The admin-specific filter label is displayed'
      );
  });

  test('it does not show trashed workspaces toggle for non-admin users', async function (assert) {
    // Set the user as a non-admin
    let currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user.isAdmin = false;

    await render(hbs`
      <WorkspaceFilter
        @showTrashed={{this.showTrashed}}
        @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
      />
    `);

    await click('.more-header'); // Reveal the additional filters
    assert
      .dom('#toggle-trashed')
      .doesNotExist(
        'The trashed workspaces toggle is not visible for non-admin users'
      );
  });

  test('it toggles the more filters section', async function (assert) {
    await render(hbs`
      <WorkspaceFilter
        @filterName={{this.filterName}}
        @onUpdate={{this.triggerFetch}}
                @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
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

  test('it hides admin-specific filters for non-admin users', async function (assert) {
    let currentUserService = this.owner.lookup('service:current-user');
    currentUserService.user.isAdmin = false;

    await render(hbs`
      <WorkspaceFilter
        @filterName={{this.filterName}}
        @onUpdate={{this.triggerFetch}}
        @toggleTrashed={{this.toggleTrashed}}
        @toggleHidden={{this.toggleHidden}}
      />
    `);

    await click('.more-header'); // Reveal additional filters

    assert
      .dom('#toggle-trashed')
      .doesNotExist('The admin-specific filter is hidden for non-admin users');
  });
});
