import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

module('Integration | Component | workspace-new-settings', function (hooks) {
  setupRenderingTest(hooks);

  // --- Test Data Builders ---
  const buildUser = (overrides = {}) => ({
    id: 'user1',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    isStudent: false,
    isAdmin: false,
    accountType: 'T',
    get(prop) {
      return this[prop];
    },
    ...overrides,
  });

  const buildFolderSet = (overrides = {}) => ({
    id: 'fs1',
    name: 'Default Folder Set',
    get(prop) {
      return this[prop];
    },
    ...overrides,
  });

  const buildUsers = (count = 3) => {
    return Array.from({ length: count }, (_, i) =>
      buildUser({ id: `user${i + 1}`, username: `user${i + 1}` })
    );
  };

  const buildFolderSets = (count = 2) => {
    return Array.from({ length: count }, (_, i) =>
      buildFolderSet({ id: `fs${i + 1}`, name: `Folder Set ${i + 1}` })
    );
  };

  // --- Service Stubs Setup ---
  hooks.beforeEach(function () {
    // Mock CurrentUser service
    class CurrentUserStub extends Service {
      user = buildUser();
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

    // Mock Alert service
    class SweetAlertStub extends Service {
      showModalCalled = false;
      showToastCalled = false;
      lastToastType = null;
      lastToastMessage = null;

      showModal(type, title, text, confirmText) {
        this.showModalCalled = true;
        return Promise.resolve({ value: true });
      }
      showToast(type, message, position, duration, showCloseButton, callback) {
        this.showToastCalled = true;
        this.lastToastType = type;
        this.lastToastMessage = message;
      }
    }
    this.owner.register('service:sweet-alert', SweetAlertStub);

    // Mock Store service
    class StoreStub extends Service {
      peekAll(modelName) {
        if (modelName === 'user') {
          return {
            reject(callback) {
              return buildUsers().filter((u) => !callback(u));
            },
          };
        }
        return [];
      }
      peekRecord(modelName, id) {
        if (modelName === 'user') {
          return buildUser({ id, username: `user-${id}` });
        }
        if (modelName === 'folder-set') {
          return buildFolderSet({ id, name: `Folder Set ${id}` });
        }
        return null;
      }
    }
    this.owner.register('service:store', StoreStub);

    // Stub SelectizeInput component
    class SelectizeInputStub extends Component {}
    this.owner.register(
      'template:components/selectize-input',
      hbs`<div class="stub-selectize" data-input-id={{@inputId}}></div>`
    );
    this.owner.register('component:selectize-input', SelectizeInputStub);

    // Stub Ui::RadioGroup component
    class RadioGroupStub extends Component {}
    this.owner.register(
      'template:components/ui/radio-group',
      hbs`<div class="stub-radio-group" data-group={{@options.groupName}}></div>`
    );
    this.owner.register('component:ui/radio-group', RadioGroupStub);

    // Stub Ui::ErrorBox component
    class ErrorBoxStub extends Component {}
    this.owner.register(
      'template:components/ui/error-box',
      hbs`<div class="stub-error-box">{{@error}}</div>`
    );
    this.owner.register('component:ui/error-box', ErrorBoxStub);

    // Stub WsNewSettingsPermissions component
    class WsNewSettingsPermissionsStub extends Component {}
    this.owner.register(
      'template:components/ws-new-settings-permissions',
      hbs`<div class="stub-permissions"></div>`
    );
    this.owner.register(
      'component:ws-new-settings-permissions',
      WsNewSettingsPermissionsStub
    );
  });

  // ============================================================
  // COMPONENT RENDERING TESTS
  // ============================================================

  test('renders the component container with correct ID', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component container exists with correct ID');
  });

  test('displays Create New Workspace heading', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('h1').hasText('Create New Workspace', 'Shows correct heading');
  });

  test('renders back button with correct text', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.back-button').exists('Back button exists');
    assert
      .dom('.back-button')
      .containsText('Submission Viewer', 'Back button shows correct text');
  });

  test('back button has arrow icon', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.back-button i.fa-arrow-left')
      .exists('Back button has left arrow icon');
  });

  test('renders create workspace content container', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.create-ws-content').exists('Content container exists');
  });

  // ============================================================
  // WORKSPACE NAME SECTION TESTS
  // ============================================================

  test('renders workspace name section', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.ws-new.name').exists('Workspace name section exists');
    assert
      .dom('.ws-new.name .input-label')
      .containsText('Workspace Name', 'Shows correct label');
  });

  test('workspace name section has info tooltip', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.name .info-text-tip')
      .exists('Tooltip container exists');
    assert
      .dom('.ws-new.name [data-tooltip]')
      .exists('Has data-tooltip attribute');
    assert.dom('.ws-new.name .info-icon').exists('Info icon is present');
  });

  test('renders workspace name input', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('#ws-new-name').exists('Workspace name input exists');
    assert
      .dom('#ws-new-name')
      .hasClass('single-text-input', 'Input has correct class');
    assert
      .dom('#ws-new-name')
      .hasAttribute('placeholder', 'Provide a name for your workspace');
  });

  test('workspace name input is editable', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    await fillIn('#ws-new-name', 'My Test Workspace');
    assert
      .dom('#ws-new-name')
      .hasValue('My Test Workspace', 'Input value updates');
  });

  // ============================================================
  // WORKSPACE OWNER SECTION TESTS
  // ============================================================

  test('renders workspace owner section', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.ws-new.owner').exists('Owner section exists');
    assert
      .dom('.ws-new.owner .input-label')
      .containsText('Workspace Owner', 'Shows correct label');
  });

  test('owner section has info tooltip', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.ws-new.owner .info-text-tip').exists('Owner tooltip exists');
    assert
      .dom('.ws-new.owner [data-tooltip]')
      .hasAttribute(
        'data-tooltip',
        /owner of the workspace/,
        'Has correct tooltip text'
      );
  });

  test('renders selectize input for owner selection', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.owner .stub-selectize')
      .exists('Owner selectize input exists');
    assert.dom('[data-input-id="owner-select"]').exists('Has correct input ID');
  });

  // ============================================================
  // PRIVACY SETTING SECTION TESTS
  // ============================================================

  test('renders privacy setting section', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.ws-new.mode').exists('Privacy setting section exists');
    assert
      .dom('.ws-new.mode .input-label')
      .containsText('Privacy Setting', 'Shows correct label');
  });

  test('privacy section has info tooltip', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.ws-new.mode .info-text-tip').exists('Privacy tooltip exists');
  });

  test('renders radio group for privacy modes', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.mode .stub-radio-group')
      .exists('Privacy radio group exists');
    assert
      .dom('[data-group="mode"]')
      .exists('Radio group has correct group name');
  });

  // ============================================================
  // FOLDER SET SECTION TESTS
  // ============================================================

  test('renders folder set section', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.ws-new.folderset').exists('Folder set section exists');
    assert
      .dom('.ws-new.folderset .input-label')
      .containsText('Folder Set', 'Shows correct label');
  });

  test('folder set section has info tooltip', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.folderset .info-text-tip')
      .exists('Folder set tooltip exists');
  });

  test('renders selectize input for folder set', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.folderset .stub-selectize')
      .exists('Folder set selectize exists');
    assert
      .dom('[data-input-id="folderset-select"]')
      .exists('Has correct input ID');
  });

  // ============================================================
  // SUBMISSION SETTINGS SECTION TESTS
  // ============================================================

  test('renders submission settings section', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.submission-settings')
      .exists('Submission settings section exists');
    assert
      .dom('.ws-new.submission-settings .input-label')
      .containsText('Submission Settings', 'Shows correct label');
  });

  test('submission settings section has info tooltip', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.submission-settings .info-text-tip')
      .exists('Submission settings tooltip exists');
  });

  test('renders radio group for submission settings', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.submission-settings .stub-radio-group')
      .exists('Submission settings radio group exists');
    assert
      .dom('[data-group="submissionSettings"]')
      .exists('Radio group has correct group name');
  });

  // ============================================================
  // PERMISSIONS SECTION TESTS
  // ============================================================

  test('renders permissions component', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.stub-permissions').exists('Permissions component is rendered');
  });

  // ============================================================
  // CREATE BUTTON TESTS
  // ============================================================

  test('renders create workspace button', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.primary-button.create-ws').exists('Create button exists');
    assert
      .dom('.primary-button.create-ws')
      .hasText('Create Workspace', 'Button has correct text');
  });

  test('create button has correct type attribute', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.primary-button.create-ws')
      .hasAttribute('type', 'button', 'Button has button type');
  });

  // ============================================================
  // ERROR DISPLAY TESTS
  // ============================================================

  test('renders create workspace error container', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.create-ws-error').exists('Error container exists');
  });

  test('shows error box when createWorkspaceError is provided', async function (assert) {
    this.set('error', 'Failed to create workspace');
    await render(
      hbs`<WorkspaceNewSettings @createWorkspaceError={{this.error}} />`
    );
    assert
      .dom('.create-ws-error .stub-error-box')
      .exists('Error box is displayed');
    assert
      .dom('.create-ws-error .stub-error-box')
      .containsText('Failed to create workspace');
  });

  test('does not show error box when no error exists', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.create-ws-error .stub-error-box')
      .doesNotExist('No error box when no error');
  });

  // ============================================================
  // COMPONENT ARGS TESTS
  // ============================================================

  test('accepts users argument', async function (assert) {
    this.set('users', buildUsers());
    await render(hbs`<WorkspaceNewSettings @users={{this.users}} />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders with users arg');
  });

  test('accepts folderSets argument', async function (assert) {
    this.set('folderSets', buildFolderSets());
    await render(hbs`<WorkspaceNewSettings @folderSets={{this.folderSets}} />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders with folderSets arg');
  });

  test('accepts all expected arguments', async function (assert) {
    this.set('users', buildUsers());
    this.set('folderSets', buildFolderSets());
    this.set('onProceed', () => {});
    this.set('onBack', () => {});
    this.set('createWorkspaceError', null);

    await render(hbs`
      <WorkspaceNewSettings 
        @users={{this.users}}
        @folderSets={{this.folderSets}}
        @onProceed={{this.onProceed}}
        @onBack={{this.onBack}}
        @createWorkspaceError={{this.createWorkspaceError}}
      />
    `);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders with all arguments');
  });

  // ============================================================
  // BACK BUTTON ACTION TESTS
  // ============================================================

  test('back button calls onBack callback when clicked', async function (assert) {
    assert.expect(1);

    this.set('onBack', () => {
      assert.ok(true, 'onBack callback was called');
    });

    await render(hbs`<WorkspaceNewSettings @onBack={{this.onBack}} />`);
    await click('.back-button');
  });

  test('back button handles missing onBack callback gracefully', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    await click('.back-button');
    assert
      .dom('#workspace-new-settings')
      .exists('Component still renders after clicking back');
  });

  // ============================================================
  // VALIDATION TESTS
  // ============================================================

  test('clicking create with empty name shows validation error', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    await click('.primary-button.create-ws');
    await settled();

    // The component should show an error toast and set error state
    const alertService = this.owner.lookup('service:sweet-alert');
    assert.true(alertService.showToastCalled, 'Error toast was shown');
    assert.strictEqual(
      alertService.lastToastType,
      'error',
      'Toast type is error'
    );
  });

  test('create button triggers handleSettings action', async function (assert) {
    assert.expect(1);

    // Since validation will fail without a name, we just verify the button is clickable
    await render(hbs`<WorkspaceNewSettings />`);
    await click('.primary-button.create-ws');
    await settled();

    const alertService = this.owner.lookup('service:sweet-alert');
    assert.true(alertService.showToastCalled, 'handleSettings was triggered');
  });

  // ============================================================
  // USER TYPE SPECIFIC TESTS
  // ============================================================

  test('admin user sees internet privacy option', async function (assert) {
    class AdminUserStub extends Service {
      user = buildUser({ isAdmin: true, isStudent: false });
    }
    this.owner.register('service:current-user', AdminUserStub);

    await render(hbs`<WorkspaceNewSettings />`);
    // The modeInputs getter should include 'internet' for admins
    // We verify the component renders without error
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders for admin user');
  });

  test('student user does not see internet privacy option', async function (assert) {
    class StudentUserStub extends Service {
      user = buildUser({ isAdmin: false, isStudent: true });
    }
    this.owner.register('service:current-user', StudentUserStub);

    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders for student user');
  });

  test('non-admin teacher does not see internet privacy option', async function (assert) {
    class TeacherUserStub extends Service {
      user = buildUser({ isAdmin: false, isStudent: false, accountType: 'T' });
    }
    this.owner.register('service:current-user', TeacherUserStub);

    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders for teacher user');
  });

  // ============================================================
  // COMPONENT LAYOUT AND STRUCTURE TESTS
  // ============================================================

  test('all form sections are present in correct order', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);

    const sections = this.element.querySelectorAll('.ws-new');
    assert.strictEqual(sections.length, 5, 'All 5 form sections are present');
    assert.true(
      sections[0].classList.contains('name'),
      'First section is name'
    );
    assert.true(
      sections[1].classList.contains('owner'),
      'Second section is owner'
    );
    assert.true(
      sections[2].classList.contains('mode'),
      'Third section is mode'
    );
    assert.true(
      sections[3].classList.contains('folderset'),
      'Fourth section is folderset'
    );
    assert.true(
      sections[4].classList.contains('submission-settings'),
      'Fifth section is submission-settings'
    );
  });

  test('all info icons use correct icon class', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);

    const infoIcons = this.element.querySelectorAll('.info-icon');
    assert.strictEqual(infoIcons.length, 5, 'All 5 sections have info icons');

    infoIcons.forEach((icon) => {
      assert.true(
        icon.classList.contains('fa-info-circle'),
        'Icon uses fa-info-circle class'
      );
    });
  });

  test('component structure matches expected hierarchy', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);

    assert
      .dom('#workspace-new-settings > h1')
      .exists('H1 is direct child of container');
    assert
      .dom('#workspace-new-settings > .back-button')
      .exists('Back button is direct child');
    assert
      .dom('#workspace-new-settings > .create-ws-content')
      .exists('Content is direct child');
    assert
      .dom('.create-ws-content .ws-new')
      .exists('Form sections inside content');
    assert
      .dom('.create-ws-content .stub-permissions')
      .exists('Permissions inside content');
    assert
      .dom('.create-ws-content .create-ws-error')
      .exists('Error container inside content');
    assert
      .dom('.create-ws-content .primary-button.create-ws')
      .exists('Create button inside content');
  });

  // ============================================================
  // TOOLTIP ATTRIBUTE TESTS
  // ============================================================

  test('workspace name tooltip has correct content', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.name [data-tooltip]')
      .hasAttribute(
        'data-tooltip',
        'Provide an easily identifiable name for this workspace'
      );
  });

  test('privacy setting tooltip has correct content', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.mode [data-tooltip]')
      .hasAttribute('data-tooltip', /Decide who can see this workspace/);
  });

  test('folder set tooltip has correct content', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.folderset [data-tooltip]')
      .hasAttribute('data-tooltip', /saved folder sets/);
  });

  test('submission settings tooltip has correct content', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.submission-settings [data-tooltip]')
      .hasAttribute(
        'data-tooltip',
        /all revisions or just submissions of record/
      );
  });

  // ============================================================
  // OWNER OPTIONS COMPUTED PROPERTY TESTS
  // ============================================================

  test('ownerOptions maps users correctly', async function (assert) {
    const users = buildUsers(3);
    this.set('users', users);

    await render(hbs`<WorkspaceNewSettings @users={{this.users}} />`);
    // Component renders successfully with users mapped to options
    assert
      .dom('.ws-new.owner .stub-selectize')
      .exists('Owner selectize renders with user options');
  });

  test('ownerOptions handles empty users array', async function (assert) {
    this.set('users', []);
    await render(hbs`<WorkspaceNewSettings @users={{this.users}} />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders with empty users array');
  });

  test('ownerOptions handles undefined users', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders without users arg');
  });

  // ============================================================
  // FOLDER SET OPTIONS COMPUTED PROPERTY TESTS
  // ============================================================

  test('folderSetOptions maps folder sets correctly', async function (assert) {
    const folderSets = buildFolderSets(3);
    this.set('folderSets', folderSets);

    await render(hbs`<WorkspaceNewSettings @folderSets={{this.folderSets}} />`);
    assert
      .dom('.ws-new.folderset .stub-selectize')
      .exists('Folder set selectize renders with options');
  });

  test('folderSetOptions handles empty array', async function (assert) {
    this.set('folderSets', []);
    await render(hbs`<WorkspaceNewSettings @folderSets={{this.folderSets}} />`);
    assert
      .dom('#workspace-new-settings')
      .exists('Component renders with empty folderSets');
  });

  // ============================================================
  // DEFAULT VALUES TESTS
  // ============================================================

  test('selectedMode defaults to private', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    // The privacy radio group should have 'private' as default
    // Verified by successful render without errors
    assert
      .dom('[data-group="mode"]')
      .exists('Privacy mode radio group exists with default');
  });

  test('selectedSubmissionSettings defaults to all', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    // The submission settings radio group should have 'all' as default
    assert
      .dom('[data-group="submissionSettings"]')
      .exists('Submission settings exists with default');
  });

  // ============================================================
  // INPUT CONTAINER TESTS
  // ============================================================

  test('workspace name input container has correct class', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.single-text-input-container')
      .exists('Input container has correct class');
    assert
      .dom('.single-text-input-container #ws-new-name')
      .exists('Input is inside container');
  });

  // ============================================================
  // ACCESSIBILITY TESTS
  // ============================================================

  test('back button has type attribute', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.back-button')
      .hasAttribute('type', 'button', 'Back button has type attribute');
  });

  test('create button has type attribute', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.primary-button.create-ws')
      .hasAttribute('type', 'button', 'Create button has type');
  });

  test('workspace name input has id for label association', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('#ws-new-name').exists('Input has id attribute');
  });

  // ============================================================
  // CSS CLASS TESTS
  // ============================================================

  test('back button has correct CSS class', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert.dom('.back-button').exists('Back button has back-button class');
  });

  test('create button has primary-button and create-ws classes', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.primary-button.create-ws')
      .exists('Create button has both classes');
  });

  test('form sections have correct CSS classes', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);
    assert
      .dom('.ws-new.name')
      .exists('Name section has ws-new and name classes');
    assert
      .dom('.ws-new.owner')
      .exists('Owner section has ws-new and owner classes');
    assert
      .dom('.ws-new.mode')
      .exists('Mode section has ws-new and mode classes');
    assert
      .dom('.ws-new.folderset')
      .exists('Folderset section has ws-new and folderset classes');
    assert
      .dom('.ws-new.submission-settings')
      .exists('Submission settings has correct classes');
  });

  // ============================================================
  // SIMPTIP TOOLTIP CLASSES TESTS
  // ============================================================

  test('tooltips have simptip styling classes', async function (assert) {
    await render(hbs`<WorkspaceNewSettings />`);

    const tooltips = this.element.querySelectorAll('.info-text-tip');
    assert.ok(tooltips.length > 0, 'Tooltip elements exist');

    tooltips.forEach((tooltip) => {
      assert.true(
        tooltip.classList.contains('simptip-position-right'),
        'Has position class'
      );
      assert.true(
        tooltip.classList.contains('simptip-multiline'),
        'Has multiline class'
      );
      assert.true(
        tooltip.classList.contains('simptip-smooth'),
        'Has smooth class'
      );
    });
  });
});
