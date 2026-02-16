import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

module(
  'Integration | Component | ws-new-settings-permissions',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
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

      // Mock Store service
      class StoreStub extends Service {
        peekRecord(modelName, id) {
          return {
            id: id,
            username: `user-${id}`,
            firstName: 'Test',
            lastName: 'User',
          };
        }
      }
      this.owner.register('service:store', StoreStub);

      // Stub SelectizeInput component
      class SelectizeInputStub extends Component {}
      this.owner.register(
        'template:components/selectize-input',
        hbs`<div class="stub-selectize"></div>`
      );
      this.owner.register('component:selectize-input', SelectizeInputStub);

      // Stub Ui::RadioGroup component
      class RadioGroupStub extends Component {}
      this.owner.register(
        'template:components/ui/radio-group',
        hbs`<div class="stub-radio-group"></div>`
      );
      this.owner.register('component:ui/radio-group', RadioGroupStub);

      // Stub Ui::ErrorBox component
      class ErrorBoxStub extends Component {}
      this.owner.register(
        'template:components/ui/error-box',
        hbs`<div class="stub-error-box"></div>`
      );
      this.owner.register('component:ui/error-box', ErrorBoxStub);

      // Note: collab-permissions helper exists in app and will be automatically available
    });

    // --- Component Structure Tests ---

    test('renders the component container', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('#ws-new-settings-permissions')
        .exists('Component container exists');
    });

    test('displays collaborators label and info icon', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.input-label')
        .containsText('Collaborators', 'Shows collaborators label');
      assert.dom('.info-icon').exists('Info icon is present');
    });

    test('displays instructional text for selecting users', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.sub-input-label')
        .containsText('Select a user', 'Shows selection instructions');
    });

    test('renders selectize input for user selection', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert.dom('.stub-selectize').exists('Selectize input stub is rendered');
    });

    // --- Permission Configuration Tests ---

    test('does not show global permissions when no collaborator is selected', async function (assert) {
      this.set('permissions', []);
      this.set('selectedCollaborator', null);
      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);
      assert
        .dom('.global-permissions')
        .doesNotExist('Global permissions section is hidden');
    });

    test('shows global permissions when a collaborator is selected', async function (assert) {
      this.set('permissions', []);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });
      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);
      assert
        .dom('.global-permissions')
        .exists('Global permissions section is shown');
    });

    test('displays radio group for global permissions', async function (assert) {
      this.set('permissions', []);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });
      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);
      assert
        .dom('.stub-radio-group')
        .exists('Radio group for permissions is rendered');
    });

    test('shows custom permissions note when collaborator selected', async function (assert) {
      this.set('permissions', []);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });
      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);
      assert
        .dom('.global-permissions .sub-input-label')
        .containsText(
          'custom permissions after',
          'Shows custom permissions note'
        );
    });

    test('displays save permissions button when collaborator selected', async function (assert) {
      this.set('permissions', []);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });
      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);
      assert.dom('.button-container button').exists('Save button is present');
      assert
        .dom('.button-container button')
        .hasText('Save Permissions', 'Button has correct text');
    });

    test('save button has correct class styling', async function (assert) {
      this.set('permissions', []);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });
      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);
      assert
        .dom('.button-container button')
        .hasClass('secondary-button', 'Button has secondary styling');
    });

    // --- Added Collaborators List Tests ---

    test('does not show added collaborators section when permissions array is empty', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.added-collab')
        .doesNotExist('Added collaborators section is hidden when empty');
    });

    test('shows added collaborators section when permissions exist', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.added-collab')
        .exists('Added collaborators section is shown');
    });

    test('displays Added Collaborators heading', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.added-collab .input-label')
        .containsText('Added Collaborators', 'Shows section heading');
    });

    test('displays username for each added collaborator', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert.dom('.added-collab li').containsText('alice', 'Shows username');
    });

    test('displays permission level for each collaborator', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.added-collab li')
        .containsText('View Only', 'Shows permission level');
    });

    test('displays edit icon for each collaborator', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert.dom('.added-collab .fa-edit').exists('Edit icon is present');
    });

    test('displays remove icon for each collaborator', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.added-collab .fa-minus-circle')
        .exists('Remove icon is present');
    });

    test('displays multiple collaborators in list', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
        {
          user: { id: 'u2', username: 'bob' },
          global: 'editor',
        },
        {
          user: { id: 'u3', username: 'charlie' },
          global: 'approver',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.added-collab li')
        .exists({ count: 3 }, 'Shows all three collaborators');
    });

    test('displays different permission types correctly', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
        {
          user: { id: 'u2', username: 'bob' },
          global: 'editor',
        },
        {
          user: { id: 'u3', username: 'charlie' },
          global: 'indirectMentor',
        },
        {
          user: { id: 'u4', username: 'diana' },
          global: 'directMentor',
        },
        {
          user: { id: 'u5', username: 'eve' },
          global: 'approver',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );

      assert
        .dom('.added-collab')
        .containsText('View Only', 'Shows viewOnly permission');
      assert
        .dom('.added-collab')
        .containsText('Editor', 'Shows editor permission');
      assert
        .dom('.added-collab')
        .containsText('Mentor', 'Shows mentor permission');
      assert
        .dom('.added-collab')
        .containsText(
          'Mentor with Direct Send',
          'Shows direct mentor permission'
        );
      assert
        .dom('.added-collab')
        .containsText('Approver', 'Shows approver permission');
    });

    // --- Component Integration Tests ---

    test('component accepts all expected arguments', async function (assert) {
      this.set('permissions', []);
      this.set('users', [{ id: 'u1', username: 'user1' }]);
      this.set('isEditing', false);
      this.set('selectedCollaborator', null);
      this.set('initialCollabOptions', []);
      this.set('selectedCollaborators', {});

      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @users={{this.users}}
        @isEditing={{this.isEditing}}
        @selectedCollaborator={{this.selectedCollaborator}}
        @initialCollabOptions={{this.initialCollabOptions}}
        @selectedCollaborators={{this.selectedCollaborators}}
      />
    `);
      assert
        .dom('#ws-new-settings-permissions')
        .exists('Component renders with all arguments');
    });

    test('component renders without errors when only required args provided', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('#ws-new-settings-permissions')
        .exists('Component renders with minimal arguments');
    });

    test('edit icon has correct title attribute', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.fa-edit')
        .hasAttribute('title', 'Modify', 'Edit icon has correct title');
    });

    test('remove icon has correct title attribute', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert
        .dom('.fa-minus-circle')
        .hasAttribute('title', 'Remove', 'Remove icon has correct title');
    });

    test('component layout has proper structure', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });

      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);

      assert
        .dom('#ws-new-settings-permissions')
        .exists('Main container exists');
      assert
        .dom('#ws-new-settings-permissions .input-label')
        .exists('Has label section');
      assert
        .dom('#ws-new-settings-permissions .global-permissions')
        .exists('Has permissions section');
      assert
        .dom('#ws-new-settings-permissions .added-collab')
        .exists('Has collaborators list');
    });

    test('tooltip has correct data attribute', async function (assert) {
      this.set('permissions', []);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert.dom('[data-tooltip]').exists('Tooltip data attribute is present');
    });

    test('collaborators list uses unordered list structure', async function (assert) {
      this.set('permissions', [
        {
          user: { id: 'u1', username: 'alice' },
          global: 'viewOnly',
        },
      ]);
      await render(
        hbs`<WsNewSettingsPermissions @permissions={{this.permissions}} />`
      );
      assert.dom('.added-collab ul').exists('Uses ul element for list');
      assert.dom('.added-collab ul li').exists('Has list items');
    });

    test('save button is clickable', async function (assert) {
      assert.expect(2);

      this.set('permissions', []);
      this.set('selectedCollaborator', { id: '123', username: 'testuser' });

      await render(hbs`
      <WsNewSettingsPermissions 
        @permissions={{this.permissions}}
        @selectedCollaborator={{this.selectedCollaborator}}
      />
    `);

      assert.dom('.button-container button').exists('Save button exists');
      assert
        .dom('.button-container button')
        .hasAttribute('type', 'button', 'Button has correct type');
    });
  }
);
