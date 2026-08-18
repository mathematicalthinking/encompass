import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module(
  'Integration | Component | workspace-info-collaborators-new',
  function (hooks) {
    setupRenderingTest(hooks);

    function findButtonByText(text) {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find((btn) => btn.textContent.trim() === text);
    }

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

      class SweetAlertService extends Service {
        showToast() {
          return Promise.resolve();
        }
      }

      this.owner.register('service:utility-methods', UtilityMethodsService);
      this.owner.register('service:sweet-alert', SweetAlertService);

      // Stub the UI children so the form renders in isolation.
      const register = (name, tmpl) => {
        this.owner.register(`template:components/${name}`, tmpl);
        this.owner.register(`component:${name}`, templateOnly());
      };
      register(
        'selectize-input',
        hbs`<div class='stub-selectize'>
          <button
            type='button'
            class='add-existing'
            {{on 'click' (fn @onItemAdd 'user-1')}}
          >add existing</button>
          <button
            type='button'
            class='add-new'
            {{on 'click' (fn @onItemAdd 'user-2')}}
          >add new</button>
        </div>`
      );
      register(
        'ui/radio-group',
        hbs`<div class='stub-radio'>
          <button
            type='button'
            class='pick-custom'
            {{on 'click' (fn @updateValue 'custom')}}
          >custom</button>
        </div>`
      );
      register('ui/my-select', hbs`<div class='stub-select'></div>`);
      register(
        'ui/error-box',
        hbs`<div class='stub-error'>{{@error}}
          <button type='button' class='dismiss' {{on 'click' @resetError}}>x</button>
        </div>`
      );

      // Seed one existing collaborator (user-1) via the permissions attr; the
      // component's collaborators getter derives ids from it.
      const workspace = store.createRecord('workspace', {
        id: 'ws-1',
        name: 'Test Workspace',
        workspaceType: 'individual',
        permissions: [
          {
            user: 'user-1',
            global: 'viewOnly',
            submissions: { all: true, userOnly: false, submissionIds: [] },
          },
        ],
      });
      workspace.save = () => Promise.resolve();

      store.createRecord('user', { id: 'user-1', username: 'existing' });
      store.createRecord('user', { id: 'user-2', username: 'newuser' });

      this.cancelCount = 0;
      this.set('onCancel', () => {
        this.cancelCount += 1;
      });
      this.set('workspace', workspace);
      this.set('originalCollaborators', A([]));
      this.set('customSubmissionIds', []);
      this.set('globalItems', {
        groupName: 'globalPermissionValue',
        groupLabel: 'Workspace Permissions',
        inputs: [],
      });
    });

    async function renderComponent(context) {
      return render(hbs`
        <WorkspaceInfoCollaboratorsNew
          @workspace={{this.workspace}}
          @createNewCollaborator={{true}}
          @cancelEditCollab={{this.onCancel}}
          @isShowingCustomViewer={{false}}
          @customSubmissionIds={{this.customSubmissionIds}}
          @originalCollaborators={{this.originalCollaborators}}
          @globalItems={{this.globalItems}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @selectedCollaborators={{this.selectedCollaborators}}
        />
      `);
    }

    test('renders the add-collaborator form with the user search, permission group, and Save/Cancel', async function (assert) {
      await renderComponent(this);

      assert.dom('#workspace-info-collaborators-new').exists();
      assert.dom('.stub-selectize').exists('renders the user search');
      assert.dom('.stub-radio').exists('renders the global permission group');
      assert.ok(findButtonByText('Save'), 'has a Save button');
      assert.ok(findButtonByText('Cancel'), 'has a Cancel button');
    });

    test('selecting a user who is already a collaborator shows the already-exists error', async function (assert) {
      await renderComponent(this);

      assert.dom('.stub-error').doesNotExist('no error initially');

      await click('.add-existing');

      assert
        .dom('.stub-error')
        .includesText('already exists', 'surfaces the existing-user error');
    });

    test('dismissing the existing-user error clears it', async function (assert) {
      await renderComponent(this);
      await click('.add-existing');
      assert.dom('.stub-error').exists('error is showing');

      await click('.stub-error .dismiss');

      assert.dom('.stub-error').doesNotExist('error is cleared');
    });

    test('choosing the custom global permission reveals the per-aspect selects', async function (assert) {
      await renderComponent(this);

      assert.dom('.stub-select').doesNotExist('no permission selects initially');

      await click('.pick-custom');

      assert
        .dom('.stub-select')
        .exists({ count: 5 }, 'shows submissions/selections/comments/folders/feedback');
      assert.dom('.card-row').includesText('Submissions');
    });

    test('saving a valid new user adds a permission entry and closes the form', async function (assert) {
      await renderComponent(this);

      await click('.add-new');
      await click(findButtonByText('Save'));
      await settled();

      const permissions = this.workspace.permissions;
      assert.strictEqual(permissions.length, 2, 'appends a permission entry');
      assert.ok(
        permissions.some((p) => p.user === 'user-2'),
        'the new entry is for the selected user'
      );
      assert.strictEqual(this.cancelCount, 1, 'closes the form after saving');
    });
  }
);
