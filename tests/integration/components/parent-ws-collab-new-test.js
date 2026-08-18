import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import templateOnly from '@ember/component/template-only';
import Service from '@ember/service';

module(
  'Integration | Component | parent-ws-collab-new',
  function (hooks) {
    setupRenderingTest(hooks);

    function findButtonByText(text) {
      return Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent.trim() === text
      );
    }

    hooks.beforeEach(function () {
      const store = this.owner.lookup('service:store');

      class UtilsStub extends Service {
        isNonEmptyObject(o) {
          return o && typeof o === 'object' && Object.keys(o).length > 0;
        }
        isNonEmptyArray(a) {
          return Array.isArray(a) && a.length > 0;
        }
      }
      class AlertStub extends Service {
        showToast() {
          return Promise.resolve();
        }
      }
      this.owner.register('service:utility-methods', UtilsStub);
      this.owner.register('service:sweet-alert', AlertStub);

      const register = (name, tmpl) => {
        this.owner.register(`template:components/${name}`, tmpl);
        this.owner.register(`component:${name}`, templateOnly());
      };
      register('ui/radio-group', hbs`<div class='stub-radio'></div>`);
      register('ui/checkbox-list', hbs`<div class='stub-checkbox-list'></div>`);
      register(
        'selectize-input',
        hbs`<div class='stub-selectize'>
          <button type='button' class='add-existing' {{on 'click' (fn @onItemAdd 'user-existing')}}>ex</button>
          <button type='button' class='add-new' {{on 'click' (fn @onItemAdd 'user-new')}}>new</button>
        </div>`
      );
      register(
        'ui/error-box',
        hbs`<div class='stub-error'>{{@error}}
          <button type='button' class='dismiss' {{on 'click' @resetError}}>x</button>
        </div>`
      );

      const owner = store.createRecord('user', { id: 'owner-1' });
      store.createRecord('user', { id: 'user-existing', username: 'exists' });
      store.createRecord('user', { id: 'user-new', username: 'newbie' });

      // Seed one existing collaborator via permissions (the workspace's
      // `collaborators` getter derives ids from it).
      const workspace = store.createRecord('workspace', {
        id: 'pws-1',
        workspaceType: 'parent',
        owner,
        permissions: [
          {
            user: 'user-existing',
            global: 'custom',
            submissions: { all: true, userOnly: false, submissionIds: [] },
          },
        ],
      });
      workspace.save = () => Promise.resolve();

      this.cancelCount = 0;
      this.set('onCancel', () => {
        this.cancelCount += 1;
      });
      this.set('workspace', workspace);
      this.set('originalCollaborators', A([]));
      this.set('students', A([]));
      this.set('childWorkspaces', A([]));
    });

    async function renderComponent(context) {
      return render(hbs`
        <ParentWsCollabNew
          @workspace={{this.workspace}}
          @students={{this.students}}
          @childWorkspaces={{this.childWorkspaces}}
          @originalCollaborators={{this.originalCollaborators}}
          @cancelEditCollab={{this.onCancel}}
          @initialCollabOptions={{this.initialCollabOptions}}
          @selectedCollaborators={{this.selectedCollaborators}}
        />
      `);
    }

    test('renders the individual add form with the permission group and Save/Cancel', async function (assert) {
      await renderComponent(this);

      assert.dom('#parent-ws-collab-new').exists();
      assert.dom('.stub-selectize').exists('individual add shows the user search');
      assert.ok(findButtonByText('Save'), 'has Save');
      assert.ok(findButtonByText('Cancel'), 'has Cancel');
    });

    test('selecting an already-existing collaborator surfaces the existing-user error', async function (assert) {
      await renderComponent(this);

      assert.dom('.stub-error').doesNotExist();
      await click('.add-existing');

      assert.dom('.stub-error').includesText('already exists');
    });

    test('dismissing the existing-user error clears it', async function (assert) {
      await renderComponent(this);
      await click('.add-existing');
      assert.dom('.stub-error').exists();

      await click('.stub-error .dismiss');

      assert.dom('.stub-error').doesNotExist();
    });

    test('saving with no user selected shows the missing-user error', async function (assert) {
      await renderComponent(this);

      await click(findButtonByText('Save'));

      assert.dom('.stub-error').includesText('Please select a user');
    });

    test('saving a valid user appends a read-only permission, updates originalCollaborators in place, and closes', async function (assert) {
      await renderComponent(this);

      await click('.add-new');
      await click(findButtonByText('Save'));

      const perms = this.workspace.permissions;
      const added = perms.find((p) => p.user === 'user-new');
      assert.ok(added, 'a permission entry was appended for the new user');
      assert.strictEqual(added.global, 'custom', 'parent collab is custom/read-only');
      assert.strictEqual(added.feedback, 'approver', 'feedback workaround preserved');

      assert.ok(
        this.originalCollaborators.some((u) => u.id === 'user-new'),
        'the new user was added to originalCollaborators in place (no arg reassignment)'
      );
      assert.strictEqual(this.cancelCount, 1, 'the form closes after saving');
    });
  }
);
