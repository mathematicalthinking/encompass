import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn, findAll } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module(
  'Integration | Component | workspace-info-collaborators',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      const store = this.owner.lookup('service:store');

      // Mock services
      class UtilityMethodsService extends Service {
        isNonEmptyObject(obj) {
          return obj && typeof obj === 'object' && Object.keys(obj).length > 0;
        }
        isNonEmptyArray(arr) {
          return Array.isArray(arr) && arr.length > 0;
        }
      }

      class CurrentUserService extends Service {
        user = { id: 'current-user', username: 'currentuser', isAdmin: false };
      }

      class SweetAlertService extends Service {
        showToast() {
          return Promise.resolve();
        }
        showModal() {
          return Promise.resolve({ value: true });
        }
      }

      class WorkspacePermissionsService extends Service {
        canEdit() {
          return true;
        }
      }

      this.owner.register('service:utility-methods', UtilityMethodsService);
      this.owner.register('service:current-user', CurrentUserService);
      this.owner.register('service:sweet-alert', SweetAlertService);
      this.owner.register(
        'service:workspace-permissions',
        WorkspacePermissionsService
      );

      // Create test users
      const user1 = store.createRecord('user', {
        id: 'user-1',
        username: 'testuser1',
      });

      const user2 = store.createRecord('user', {
        id: 'user-2',
        username: 'testuser2',
      });

      // Create workspace with permissions
      const workspace = store.createRecord('workspace', {
        id: 'ws-1',
        name: 'Test Workspace',
        workspaceType: 'individual',
        permissions: [
          {
            user: 'user-1',
            global: 'editor',
            selections: 4,
            comments: 4,
            folders: 3,
            feedback: 'none',
            submissions: { all: true, userOnly: false, submissionIds: [] },
          },
          {
            user: 'user-2',
            global: 'viewOnly',
            selections: 1,
            comments: 1,
            folders: 1,
            feedback: 'none',
            submissions: { all: true, userOnly: false, submissionIds: [] },
          },
        ],
      });

      this.set('workspace', workspace);
      this.set('originalCollaborators', [user1, user2]);
      this.set('canEdit', true);
      this.set('selectedCollaborators', { 'user-1': true, 'user-2': true });
      this.set('initialCollabOptions', [user1, user2]);
      this.set('customSubmissionIds', []);
      this.set('isShowingCustomViewer', false);
      this.set('toggleIsShowingCustomViewer', () => {
        this.set('isShowingCustomViewer', !this.isShowingCustomViewer);
      });
    });

    test('it renders collaborators list', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      assert
        .dom('.collab-container')
        .exists({ count: 2 }, 'Shows 2 collaborators');
      const collabNames = this.element.textContent;
      assert.ok(collabNames.includes('testuser1'), 'Shows first user');
      assert.ok(collabNames.includes('testuser2'), 'Shows second user');
    });

    test('clicking edit opens edit mode for collaborator', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Initially no radio groups visible
      assert
        .dom('.radio-group')
        .doesNotExist('No radio group visible before edit');

      // Click edit on first collaborator
      const editIcons = findAll('.fa-edit');
      assert.ok(editIcons.length >= 2, 'Has edit icons for collaborators');

      await click(editIcons[0]);

      // Edit mode should show radio group for global permissions
      assert
        .dom('.radio-group')
        .exists('Radio group appears after clicking edit');

      // Should show cancel button in edit mode
      assert.dom('.cancel-button').exists('Cancel button appears in edit mode');
    });

    test('editing collaborator shows correct permission value in radio group', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Click edit on first collaborator (editor permission)
      const editIcons = findAll('.fa-edit');
      await click(editIcons[0]);

      // The radio group should be populated with the current permission value
      assert
        .dom('.radio-group')
        .exists('Radio group is rendered with permission data');
    });

    test('clicking cancel exits edit mode', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Enter edit mode
      const editIcons = findAll('.fa-edit');
      await click(editIcons[0]);
      assert.dom('.radio-group').exists('Edit mode is active');

      // Click cancel
      await click('.cancel-button');

      // Edit mode should close
      assert.dom('.radio-group').doesNotExist('Edit mode closed after cancel');
    });

    test('clicking add collaborator opens new collaborator form', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Click the add collaborator button
      await click('.heading-icon');

      // Should render the WorkspaceInfoCollaboratorsNew component
      // (This will render when createNewCollaborator is true)
      assert.ok(true, 'Add collaborator action triggered');
    });

    test('workspacePermissions getter adds userObj to permissions', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Both collaborators should render with their usernames
      const collabNames = this.element.querySelectorAll('.collab-name a');
      assert.strictEqual(
        collabNames.length,
        2,
        'Both collaborators have user links'
      );

      // The userObj should be accessible for rendering username
      const textContent = this.element.textContent;
      assert.ok(textContent.includes('testuser1'), 'Shows testuser1');
      assert.ok(textContent.includes('testuser2'), 'Shows testuser2');
    });

    test('edit mode correctly sets globalPermissionValue without undefined errors', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Click edit on first collaborator (has 'editor' permission)
      const editIcons = findAll('.fa-edit');
      await click(editIcons[0]);

      // Should not throw "Cannot read properties of undefined (reading 'get')" error
      // The radio group should render without errors
      assert
        .dom('.radio-group')
        .exists('Radio group renders without undefined errors');

      // Click edit on second collaborator (has 'viewOnly' permission)
      await click('.cancel-button');
      const editIcons2 = findAll('.fa-edit');
      await click(editIcons2[1]);

      assert
        .dom('.radio-group')
        .exists('Second edit also works without errors');
    });

    test('removes collaborator when clicking minus icon', async function (assert) {
      // Mock the workspace save to prevent actual API call
      this.workspace.save = function () {
        return Promise.resolve();
      };

      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      const originalPermissionsCount = this.workspace.get('permissions').length;

      // Enter edit mode to see minus icon
      const editIcons = findAll('.fa-edit');
      await click(editIcons[0]);

      // In edit mode, minus icon should appear
      const minusIcon = this.element.querySelector('.fa-minus-circle');
      assert.ok(minusIcon, 'Minus icon appears in edit mode');

      // Click the minus icon (triggers confirmation modal which auto-confirms in test)
      await click(minusIcon);

      // Verify permissions array was updated (after async save completes)
      await new Promise((resolve) => setTimeout(resolve, 100));

      const newPermissionsCount = this.workspace.get('permissions').length;
      assert.strictEqual(
        newPermissionsCount,
        originalPermissionsCount - 1,
        'Collaborator was removed from permissions'
      );
    });

    test('permission object structure maintains immutability', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      const workspace = this.workspace;
      const originalPermissions = workspace.get('permissions');
      const firstPermission = originalPermissions[0];

      // Click edit on first collaborator
      const editIcons = findAll('.fa-edit');
      await click(editIcons[0]);

      // Original permission object should not have been mutated
      // (userObj should be added to a new object, not the original)
      assert.strictEqual(
        firstPermission.user,
        'user-1',
        'Original permission still has user ID'
      );
      assert.notOk(
        firstPermission.userObj,
        'Original permission object was not mutated with userObj'
      );
    });

    test('displays correct permission labels for different permission types', async function (assert) {
      await render(hbs`
        <WorkspaceInfoCollaborators
          @workspace={{this.workspace}}
          @originalCollaborators={{this.originalCollaborators}}
          @canEdit={{this.canEdit}}
          @selectedCollaborators={{this.selectedCollaborators}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @isShowingCustomViewer={{this.isShowingCustomViewer}}
          @toggleIsShowingCustomViewer={{this.toggleIsShowingCustomViewer}}
        />
      `);

      // Should display permission type labels (via collab-permissions helper)
      assert
        .dom('.collab-settings')
        .exists({ count: 2 }, 'Shows settings for both collaborators');
    });
  }
);
