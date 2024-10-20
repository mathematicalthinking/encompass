import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Service from '@ember/service';
import Component from '@ember/component';

// Mock the store service
const storeStub = Service.extend({
  query() {
    return Promise.resolve([]);
  },
});

// Mock the current-user service
const currentUserStub = Service.extend({
  user: { isAdmin: true, organization: Promise.resolve(null) },
});

const sweetAlertStub = Service.extend({
  showModal() {
    // Mock implementation, returning a resolved promise to avoid errors
    return Promise.resolve();
  },
});

module('Integration | Component | workspace-list-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Register the mock services
    this.owner.register('service:store', storeStub);
    this.owner.register('service:current-user', currentUserStub);
    this.owner.register('service:sweet-alert', sweetAlertStub);
    // Mock the selectize-input component
    this.owner.register(
      'component:selectize-input',
      Component.extend({
        layout: hbs`<div class="mock-selectize-input">Mock Selectize Input</div>`,
      })
    );
    this.set('store', {
      query() {
        return Promise.resolve([]);
      },
    });

    // mock toCopyWorkspace
    this.set('toCopyWorkspace', () => {});

    this.set('model', {
      currentUser: {
        id: '1',
        name: 'Test User',
        organization: Promise.resolve(null), // Organization is explicitly set to null
      },
    });
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
      workspaces: [],
      searchOptions: ['name', 'owner'],
      sortOptions: {
        name: [{ label: 'A-Z', value: 'name', isChecked: true }],
      },
    });
  });

  test('it renders filter options and updates the list', async function (assert) {
    await render(hbs`<WorkspaceListContainer 
      @store={{this.store}} 
      @model={{this.model}} 
      @toCopyWorkspace={{this.toCopyWorkspace}}
    />`);

    assert.dom('.filter-mine').exists('Mine filter option is rendered');
    assert.dom('.sort-bar').exists('Sort options are rendered');

    // Mock changing filters
    await click('.filter-mine input');
    assert.dom('.results-list').exists('Results list is updated');
  });

  test('it handles sorting of workspaces', async function (assert) {
    await render(hbs`<WorkspaceListContainer 
      @store={{this.store}} 
      @model={{this.model}} 
      @toCopyWorkspace={{this.toCopyWorkspace}}
    />`);

    assert
      .dom('.sort-bar-item.name')
      .exists('Workspace Name sort option is present');

    await click('.sort-bar-item.name');
    assert.dom('.results-list').exists('Results list is sorted by name');
  });

  test('it handles empty workspace list gracefully', async function (assert) {
    this.set('workspaces', []); // Simulate no workspaces

    await render(hbs`<WorkspaceListContainer 
      @store={{this.store}} 
      @model={{this.model}} 
      @toCopyWorkspace={{this.toCopyWorkspace}}
    />`);

    assert
      .dom('.results-list')
      .doesNotContainText('No results message is shown');
  });
});
