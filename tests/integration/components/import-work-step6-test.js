import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Component from '@glimmer/component';

class ErrorBoxStub extends Component {
  get isStub() {
    return true;
  }
}

module('Integration | Component | import-work-step6', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
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
      selectedProblem: { id: 'problem-1', title: 'Linear Functions' },
      selectedSection: { id: 'section-1', name: 'Algebra 1' },
      submissionCount: 4,
      workspaceName: null,
      workspaceOwner: { id: 'user-1', username: 'teacher_owner' },
      workspaceMode: 'private',
      folderSet: null,
      assignmentName: null,
      savingAssignment: false,
      isUploadingAnswer: false,
      isCreatingWorkspace: false,
      uploadedAnswers: false,
      createdWorkspace: null,
      createWorkspaceError: null,
      createdAssignment: null,
      createDate: new Date('2026-05-27T00:00:00.000Z'),
      proceedCount: 0,
      backDirections: [],
      resetWorkspaceErrorCount: 0,
      onProceed: () => {
        context.proceedCount += 1;
      },
      onBack: (direction) => {
        context.backDirections = [...context.backDirections, direction];
      },
      onResetWorkspaceError: () => {
        context.resetWorkspaceErrorCount += 1;
      },
      ...overrides,
    });

    await render(hbs`
      <ImportWorkStep6
        @selectedProblem={{this.selectedProblem}}
        @selectedSection={{this.selectedSection}}
        @submissionCount={{this.submissionCount}}
        @workspaceName={{this.workspaceName}}
        @workspaceOwner={{this.workspaceOwner}}
        @workspaceMode={{this.workspaceMode}}
        @folderSet={{this.folderSet}}
        @assignmentName={{this.assignmentName}}
        @savingAssignment={{this.savingAssignment}}
        @isUploadingAnswer={{this.isUploadingAnswer}}
        @isCreatingWorkspace={{this.isCreatingWorkspace}}
        @uploadedAnswers={{this.uploadedAnswers}}
        @createdWorkspace={{this.createdWorkspace}}
        @createWorkspaceError={{this.createWorkspaceError}}
        @createdAssignment={{this.createdAssignment}}
        @createDate={{this.createDate}}
        @onBack={{this.onBack}}
        @onProceed={{this.onProceed}}
        @onResetWorkspaceError={{this.onResetWorkspaceError}}
      />
    `);
  }

  test('it renders import summary and buttons by default', async function (assert) {
    await renderComponent(this);

    assert.dom('.import-review.summary').includesText('Import Summary');
    assert
      .dom('.import-review.summary')
      .includesText('will be created in EnCoMPASS as answers');
    assert.dom('.nav-btn-container .cancel-button').exists();
    assert
      .dom('.nav-btn-container .primary-button:not(.cancel-button)')
      .hasText('Create');
  });

  test('it calls onBack and onProceed from footer buttons', async function (assert) {
    await renderComponent(this);

    await click('.nav-btn-container .cancel-button');
    await click('.nav-btn-container .primary-button:not(.cancel-button)');

    assert.deepEqual(this.backDirections, [-1], 'back callback receives -1');
    assert.strictEqual(this.proceedCount, 1, 'proceed callback called once');
  });

  test('it shows answer upload loading state and hides buttons', async function (assert) {
    await renderComponent(this, {
      isUploadingAnswer: true,
      submissionCount: 7,
    });

    assert
      .dom('#import-work-step6')
      .includesText('Please wait, creating 7 submissions');
    assert
      .dom('.import-review.summary')
      .doesNotIncludeText('Import Summary', 'summary header hidden');
    assert.dom('.nav-btn-container').doesNotExist('buttons are hidden');
  });

  test('it shows workspace creation loading state and hides buttons', async function (assert) {
    await renderComponent(this, {
      isCreatingWorkspace: true,
    });

    assert
      .dom('#import-work-step6')
      .includesText('Please wait, creating workspace');
    assert.dom('.nav-btn-container').doesNotExist('buttons are hidden');
  });

  test('it shows assignment creation loading state and hides buttons', async function (assert) {
    await renderComponent(this, {
      savingAssignment: true,
    });

    assert
      .dom('#import-work-step6')
      .includesText('Please wait, creating assignment');
    assert.dom('.nav-btn-container').doesNotExist('buttons are hidden');
  });

  test('it shows uploaded-answers success summary and hides buttons', async function (assert) {
    await renderComponent(this, {
      uploadedAnswers: true,
      submissionCount: 6,
    });

    assert
      .dom('.import-review.summary')
      .includesText('6 submissions')
      .includesText('have successfully been created as answers');
    assert.dom('.nav-btn-container').doesNotExist('buttons are hidden');
  });

  test('it shows workspace-to-be-created details when workspace name is present', async function (assert) {
    await renderComponent(this, {
      workspaceName: 'Imported Workspace',
      workspaceOwner: { id: 'user-2', username: 'owner_two' },
      folderSet: { folders: [{ id: 1 }, { id: 2 }] },
      submissionCount: 9,
    });

    assert.dom('.import-review.workspace').exists();
    assert
      .dom('.import-review.workspace')
      .includesText('Workspace to be created');
    assert.dom('.item-card.name').includesText('Imported Workspace');
    assert.dom('.item-card.description').includesText('owner_two');
    assert.dom('.workspace-stats li:first-child .stat-number').hasText('9');
    assert.dom('.workspace-stats li:last-child .stat-number').hasText('2');
  });

  test('it builds workspace link with submission route when a submission exists', async function (assert) {
    await renderComponent(this, {
      workspaceName: 'Imported Workspace',
      createdWorkspace: {
        _id: 'workspace-1',
        submissions: ['submission-1'],
      },
    });

    assert.dom('.import-review.workspace').includesText('Created Workspace');
    assert
      .dom('.import-review.workspace a')
      .hasAttribute(
        'href',
        '/#/workspaces/workspace-1/submissions/submission-1'
      );
  });

  test('it builds workspace link with /work fallback when submissions are absent', async function (assert) {
    await renderComponent(this, {
      workspaceName: 'Imported Workspace',
      createdWorkspace: {
        _id: 'workspace-2',
        submissions: [],
      },
    });

    assert
      .dom('.import-review.workspace a')
      .hasAttribute('href', '/#/workspaces/workspace-2/work');
  });

  test('it invokes workspace error reset callback from Ui::ErrorBox', async function (assert) {
    await renderComponent(this, {
      workspaceName: 'Imported Workspace',
      createWorkspaceError: 'Workspace creation failed',
    });

    assert.dom('.error-box-stub').exists();
    assert.dom('.error-text').hasText('Workspace creation failed');

    await click('.dismiss-error');

    assert.strictEqual(
      this.resetWorkspaceErrorCount,
      1,
      'reset callback is called once'
    );
  });

  test('it renders assignment-to-be-created summary details', async function (assert) {
    await renderComponent(this, {
      assignmentName: 'Assignment A',
      selectedProblem: { id: 'problem-2', title: 'Quadratic Functions' },
      selectedSection: { id: 'section-2', name: 'Algebra 2' },
    });

    assert
      .dom('.import-review.assignment')
      .includesText('Assignment to be created')
      .includesText('Assignment A')
      .includesText('Quadratic Functions')
      .includesText('Algebra 2');
  });
});
