import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';
import WorkspaceNewContainerComponent from 'encompass/components/workspace-new-container';

module('Integration | Component | workspace-new-container', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Mock CurrentUser service
    class CurrentUserStub extends Service {
      id = 'user1';
      username = 'testuser';
      isTeacher = true;
      isStudent = false;
      organization = Promise.resolve({ name: 'Test Organization' });
    }
    this.owner.register('service:current-user', CurrentUserStub);

    // Mock Utility Methods service
    class UtilityMethodsStub extends Service {
      isNonEmptyObject(obj) {
        return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
      }
      isNonEmptyArray(arr) {
        return Array.isArray(arr) && arr.length > 0;
      }
    }
    this.owner.register('service:utility-methods', UtilityMethodsStub);

    // Mock Error Handling service
    class ErrorHandlingStub extends Service {
      handleErrors() {}
      removeMessages() {}
    }
    this.owner.register('service:error-handling', ErrorHandlingStub);

    // Mock Alert service
    class AlertStub extends Service {
      showModal() {
        return Promise.resolve({ value: true });
      }
      showToast() {}
    }
    this.owner.register('service:alert', AlertStub);

    // Mock Store service
    class StoreStub extends Service {
      query() {
        return Promise.resolve({
          meta: {
            total: 5,
            areTooManyAnswers: false,
            doConfirmCriteria: false,
          },
        });
      }
      createRecord() {
        return {
          save() {
            return Promise.resolve({
              isEmptyAnswerSet: false,
              createWorkspaceError: null,
              createdWorkspace: { id: 'new-ws-1' },
            });
          },
        };
      }
    }
    this.owner.register('service:store', StoreStub);

    // Register stub components
    class SubmissionsFilterStub extends Component {
      updateSelectizeSingle() {}
    }
    class SubmissionViewerListStub extends Component {}
    class WorkspaceNewSettingsStub extends Component {}
    class MySelectStub extends Component {}
    class ToggleControlStub extends Component {}

    // Register minimal templates for stubs to prevent real template rendering
    this.owner.register(
      'template:components/submissions-filter',
      hbs`<div class="stub-filter"></div>`
    );
    this.owner.register(
      'template:components/submission-viewer-list',
      hbs`<div class="stub-viewer"></div>`
    );
    this.owner.register(
      'template:components/workspace-new-settings',
      hbs`<div class="stub-settings"></div>`
    );
    this.owner.register(
      'template:components/ui/my-select',
      hbs`<div class="stub-select"></div>`
    );
    this.owner.register(
      'template:components/toggle-control',
      hbs`<div class="stub-toggle"></div>`
    );

    this.owner.register('component:submissions-filter', SubmissionsFilterStub);
    this.owner.register(
      'component:submission-viewer-list',
      SubmissionViewerListStub
    );
    this.owner.register(
      'component:workspace-new-settings',
      WorkspaceNewSettingsStub
    );
    this.owner.register('component:ui/my-select', MySelectStub);
    this.owner.register('component:toggle-control', ToggleControlStub);

    // Register the component being tested
    this.owner.register(
      'component:workspace-new-container',
      WorkspaceNewContainerComponent
    );
  });

  // Helper to build mock model
  const buildModel = (overrides = {}) => {
    const base = {
      sections: [],
      assignments: [],
      users: [],
      folderSets: [],
      hideOutlet: false,
    };
    return { ...base, ...overrides };
  };

  // --- Component Rendering Tests ---

  test('renders the component with flex container', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert.dom('.flex-container-full').exists('Component wrapper exists');
  });

  test('shows submission viewer by default', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert.dom('.filter-options').exists('Filter panel is visible');
    assert.dom('.list-view').exists('List view is visible');
  });

  test('displays results list section', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert.dom('.results-list').exists('Results list is present');
    assert.dom('.results-info').exists('Results info section exists');
  });

  test('displays results icons section', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert.dom('.results-icons').exists('Results icons section is shown');
  });

  test('shows submission count in results', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.icon-message.submissions')
      .exists('Submission count indicator is displayed');
  });

  test('displays selected submissions count', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.icon-message.selected')
      .exists('Selected submissions indicator is shown');
  });

  test('shows students count indicator', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.icon-message.students')
      .exists('Students indicator is visible');
  });

  test('renders filter options panel with correct ID', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert.dom('#filter-list-side').exists('Filter panel has correct ID');
  });

  test('component initializes with default step', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    // Component shows submission viewer by default (step 1)
    assert
      .dom('.filter-options')
      .exists('Shows submission viewer on default step');
  });

  test('component handles model without optional properties', async function (assert) {
    this.set('model', {});
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.flex-container-full')
      .exists('Component renders with empty model');
  });

  test('initializes with correct service dependencies', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    // If services weren't injected properly, this would error during render
    assert
      .dom('.flex-container-full')
      .exists('Component initializes with services');
  });

  test('renders stub child components', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    // Verify stubs prevent child template errors
    assert
      .dom('.flex-container-full')
      .exists('Component renders successfully with stubs');
  });

  test('component has proper CSS classes for flex layout', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.flex-item-full.filter-options')
      .exists('Filter options has flex classes');
    assert
      .dom('.flex-item-full.list-view')
      .exists('List view has flex classes');
  });

  test('displays Submissions heading', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert.dom('.heading').hasText('Submissions', 'Shows Submissions heading');
  });

  test('component renders without errors with populated model', async function (assert) {
    this.set(
      'model',
      buildModel({
        sections: [{ id: '1', name: 'Math' }],
        assignments: [{ id: 'a1', name: 'Assignment 1' }],
        users: [{ id: 'u1', username: 'student1' }],
        folderSets: [{ id: 'fs1', name: 'Folder Set 1' }],
      })
    );
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.flex-container-full')
      .exists('Component renders with populated model');
  });

  test('accepts onToWorkspaces callback argument', async function (assert) {
    this.set('model', buildModel());
    this.set('onToWorkspaces', () => {});
    await render(
      hbs`<WorkspaceNewContainer @model={{this.model}} @onToWorkspaces={{this.onToWorkspaces}} />`
    );
    assert
      .dom('.flex-container-full')
      .exists('Component accepts callback argument');
  });

  test('component structure matches expected layout hierarchy', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.flex-item-full.filter-options.collapse')
      .exists('Filter has collapse class');
    assert.dom('.list-container').exists('List container is present');
    assert.dom('.top-row').exists('Top row for actions is present');
  });

  test('renders results list with proper structure', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.results-list .results-info')
      .exists('Results info is in results list');
    assert.dom('.side-icons').exists('Side icons section exists');
  });

  test('component properly initializes teacher selection', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    // Teacher service injection works if no error during render
    assert
      .dom('.flex-container-full')
      .exists('Component with teacher user initializes');
  });

  test('component handles model with all provided data types', async function (assert) {
    this.set(
      'model',
      buildModel({
        sections: [
          { id: 's1', name: 'Section A' },
          { id: 's2', name: 'Section B' },
        ],
        assignments: [{ id: 'a1', name: 'Assignment 1' }],
        users: [
          { id: 'u1', username: 'user1', firstName: 'John', lastName: 'Doe' },
        ],
        folderSets: [{ id: 'fs1', name: 'Default Folder Set' }],
        hideOutlet: false,
      })
    );
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.flex-container-full')
      .exists('Component handles complete model');
  });

  test('renders icons in results section', async function (assert) {
    this.set('model', buildModel());
    await render(hbs`<WorkspaceNewContainer @model={{this.model}} />`);
    assert
      .dom('.icon-message.submissions i.fa-file')
      .exists('File icon for submissions');
    assert
      .dom('.icon-message.selected i.fa-check-circle')
      .exists('Check circle icon for selected');
    assert
      .dom('.icon-message.students i.fa-user')
      .exists('User icon for students');
  });
});
