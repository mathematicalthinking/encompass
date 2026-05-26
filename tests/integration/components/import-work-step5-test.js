import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

class UtilityMethodsStub extends Service {
  isNonEmptyObject(value) {
    return (
      !!value && typeof value === 'object' && Object.keys(value).length > 0
    );
  }

  isNullOrUndefined(value) {
    return value === null || value === undefined;
  }
}

class SweetAlertStub extends Service {
  toastCalls = [];

  showToast(...args) {
    this.toastCalls.push(args);
  }
}

class SelectizeInputStub extends Component {
  get isStub() {
    return true;
  }
}

class ErrorBoxStub extends Component {
  get isStub() {
    return true;
  }
}

module('Integration | Component | import-work-step5', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    const ownerRecord = { id: 'user-1', username: 'teacher_owner' };
    const folderSetRecord = { id: 'folder-set-1', name: 'Default Folders' };
    this.ownerRecord = ownerRecord;
    this.folderSetRecord = folderSetRecord;

    this.owner.register('service:utility-methods', UtilityMethodsStub);
    this.owner.register('service:sweet-alert', SweetAlertStub);
    this.owner.register(
      'service:store',
      class extends Service {
        peekRecord(modelName, id) {
          if (modelName === 'user' && id === 'user-1') {
            return ownerRecord;
          }
          if (modelName === 'folder-set' && id === 'folder-set-1') {
            return folderSetRecord;
          }
          return null;
        }
      }
    );

    this.owner.register('component:selectize-input', SelectizeInputStub);
    this.owner.register(
      'template:components/selectize-input',
      hbs`
        <div class='selectize-input-stub' data-input-id={{@inputId}}>
          <ul class='stub-initial-items'>
            {{#each @initialItems as |item|}}
              <li class='stub-item'>{{item}}</li>
            {{/each}}
          </ul>
          <button
            type='button'
            class='stub-add-item'
            data-input-id={{@inputId}}
            {{on
              'click'
              (fn
                @onItemAdd
                (if (is-equal @inputId 'owner-select') 'user-1' 'folder-set-1')
                (hash added=true)
                @propToUpdate
                @model
              )
            }}
          >
            Add
          </button>
          <button
            type='button'
            class='stub-remove-item'
            data-input-id={{@inputId}}
            {{on
              'click'
              (fn
                @onItemRemove
                (if (is-equal @inputId 'owner-select') 'user-1' 'folder-set-1')
                null
                @propToUpdate
                @model
              )
            }}
          >
            Remove
          </button>
        </div>
      `
    );

    this.owner.register('component:ui/error-box', ErrorBoxStub);
    this.owner.register(
      'template:components/ui/error-box',
      hbs`
        <div class='error-box-stub'>
          <span class='error-text'>{{@error}}</span>
          <button
            type='button'
            class='dismiss-error'
            {{on 'click' @resetError}}
          >
            Dismiss
          </button>
        </div>
      `
    );
  });

  async function renderComponent(context, overrides = {}) {
    context.setProperties({
      currentUser: { id: 'teacher-1', isStudent: false, isAdmin: false },
      users: [{ id: 'user-1', username: 'teacher_owner' }],
      selectedOwner: null,
      selectedFolderSet: null,
      createAssignmentValue: false,
      doCreateWs: false,
      selectedMode: 'private',
      folderSets: [{ id: 'folder-set-1', name: 'Default Folders' }],
      selectedSection: { id: 'section-1', name: 'Algebra 1' },
      workspaceName: null,
      assignmentName: null,
      proceedPayload: null,
      proceedCount: 0,
      backDirections: [],
      onProceed: (payload) => {
        context.proceedPayload = payload;
        context.proceedCount += 1;
      },
      onBack: (direction) => {
        context.backDirections = [...context.backDirections, direction];
      },
      ...overrides,
    });

    await render(hbs`
      <ImportWorkStep5
        @currentUser={{this.currentUser}}
        @users={{this.users}}
        @selectedOwner={{this.selectedOwner}}
        @selectedFolderSet={{this.selectedFolderSet}}
        @createAssignmentValue={{this.createAssignmentValue}}
        @doCreateWs={{this.doCreateWs}}
        @selectedMode={{this.selectedMode}}
        @folderSets={{this.folderSets}}
        @selectedSection={{this.selectedSection}}
        @workspaceName={{this.workspaceName}}
        @assignmentName={{this.assignmentName}}
        @onBack={{this.onBack}}
        @onProceed={{this.onProceed}}
      />
    `);
  }

  test('it passes selected owner and folder set ids into initial selectize items', async function (assert) {
    await renderComponent(this, {
      selectedOwner: { id: 'user-1', username: 'teacher_owner' },
      selectedFolderSet: { id: 'folder-set-1', name: 'Default Folders' },
      doCreateWs: true,
    });

    assert
      .dom('.selectize-input-stub[data-input-id="owner-select"] .stub-item')
      .hasText('user-1');
    assert
      .dom('.selectize-input-stub[data-input-id="folderset-select"] .stub-item')
      .hasText('folder-set-1');
  });

  test('it calls onBack with -1 from Back button', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container .cancel-button');

    assert.deepEqual(this.backDirections, [-1], 'back callback receives -1');
  });

  test('it proceeds with no-workspace payload when create workspace is set to no', async function (assert) {
    await renderComponent(this, {
      doCreateWs: true,
      workspaceName: 'Legacy Name',
      selectedOwner: { id: 'user-1', username: 'teacher_owner' },
    });

    await click('input[name="createWs"][value="false"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.strictEqual(this.proceedCount, 1, 'onProceed is called once');
    assert.false(this.proceedPayload.doCreateWs, 'workspace creation is off');
    assert.strictEqual(
      this.proceedPayload.workspaceName,
      null,
      'workspace name is cleared in payload'
    );
    assert.strictEqual(
      this.proceedPayload.workspaceOwner,
      null,
      'workspace owner is cleared in payload'
    );
    assert.strictEqual(
      this.proceedPayload.folderSet,
      null,
      'folder set is cleared in payload'
    );
  });

  test('it blocks proceed and shows name/owner validation when create workspace is enabled with missing fields', async function (assert) {
    await renderComponent(this);

    await click('input[name="createWs"][value="true"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    const alertService = this.owner.lookup('service:sweet-alert');

    assert.strictEqual(this.proceedCount, 0, 'onProceed is not called');
    assert.dom('.error-box-stub').exists({ count: 2 });
    const errorTexts = [...document.querySelectorAll('.error-text')].map(
      (element) => element.textContent.trim()
    );
    assert.true(
      errorTexts.includes('Please provide a name for your workspace'),
      'name validation error is shown'
    );
    assert.true(
      errorTexts.includes('Please provide an owner for your workspace'),
      'owner validation error is shown'
    );
    assert.strictEqual(
      alertService.toastCalls.length,
      1,
      'validation toast is shown once'
    );
    assert.strictEqual(
      alertService.toastCalls[0][1],
      'Workspace name and owner are required to continue',
      'toast message matches expected copy'
    );
  });

  test('it dismisses workspace validation errors via Ui::ErrorBox reset callbacks', async function (assert) {
    await renderComponent(this);

    await click('input[name="createWs"][value="true"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');
    assert.dom('.error-box-stub').exists({ count: 2 });

    await click('.dismiss-error');
    assert.dom('.error-box-stub').exists({ count: 1 });
  });

  test('it proceeds with create-workspace payload when workspace data is valid', async function (assert) {
    await renderComponent(this);

    await click('input[name="createWs"][value="true"]');
    await fillIn('#ws-new-name', '  Imported Workspace  ');
    await click(
      '.selectize-input-stub[data-input-id="owner-select"] .stub-add-item'
    );
    await click(
      '.selectize-input-stub[data-input-id="folderset-select"] .stub-add-item'
    );
    await click('input[name="mode"][value="org"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.strictEqual(this.proceedCount, 1, 'onProceed is called once');
    assert.true(this.proceedPayload.doCreateWs, 'workspace creation is on');
    assert.strictEqual(
      this.proceedPayload.workspaceName,
      'Imported Workspace',
      'workspace name is trimmed'
    );
    assert.strictEqual(
      this.proceedPayload.workspaceOwner,
      this.ownerRecord,
      'owner record is included in payload'
    );
    assert.strictEqual(
      this.proceedPayload.folderSet,
      this.folderSetRecord,
      'folder set record is included in payload'
    );
    assert.strictEqual(
      this.proceedPayload.workspaceMode,
      'org',
      'mode selection is propagated'
    );
  });

  test('it blocks proceed when assignment creation is enabled without assignment name', async function (assert) {
    await renderComponent(this);

    await click('input[name="createAssignment"][value="true"]');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    const alertService = this.owner.lookup('service:sweet-alert');

    assert.strictEqual(this.proceedCount, 0, 'onProceed is not called');
    assert.dom('.error-box-stub').exists({ count: 1 });
    assert
      .dom('.error-text')
      .hasText('Please provide a name for your assignment');
    assert.strictEqual(
      alertService.toastCalls.length,
      1,
      'assignment validation toast is shown'
    );
    assert.strictEqual(
      alertService.toastCalls[0][1],
      'Assignment name is required to continue',
      'toast message matches expected copy'
    );
  });

  test('it proceeds with assignment payload when assignment name is present', async function (assert) {
    await renderComponent(this);

    await click('input[name="createAssignment"][value="true"]');
    await fillIn('#assignment-name', '  Assignment A  ');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.strictEqual(this.proceedCount, 1, 'onProceed is called once');
    assert.true(
      this.proceedPayload.createAssignmentValue,
      'assignment flag is true'
    );
    assert.strictEqual(
      this.proceedPayload.assignmentName,
      'Assignment A',
      'assignment name is trimmed in payload'
    );
    assert.false(
      this.proceedPayload.doCreateWs,
      'workspace creation remains off'
    );
  });

  test('it hides assignment controls for students', async function (assert) {
    await renderComponent(this, {
      currentUser: { id: 'student-1', isStudent: true, isAdmin: false },
    });

    assert
      .dom('input[name="createAssignment"]')
      .doesNotExist('assignment radio group is hidden for students');
  });
});
