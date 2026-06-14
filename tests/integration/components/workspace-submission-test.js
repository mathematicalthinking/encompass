import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';

module('Integration | Component | workspace-submission', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    let canEditImpl = () => true;
    let currentUserState = {
      id: 'u1',
      username: 'test-user',
      isAdmin: false,
      isStudent: false,
    };

    this.setCanEdit = (fn) => {
      canEditImpl = fn;
    };

    this.setCurrentUser = (overrides = {}) => {
      currentUserState = {
        ...currentUserState,
        ...overrides,
      };
    };

    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit(workspace, area, level) {
          return canEditImpl(workspace, area, level);
        }
      }
    );

    this.owner.register(
      'service:utility-methods',
      class extends Service {
        getBelongsToId(record, key) {
          if (!record || !key) {
            return null;
          }
          const value = record[key];
          if (!value) {
            return null;
          }
          if (typeof value === 'object') {
            return value.id ?? null;
          }
          return value;
        }

        isValidMongoId(value) {
          return typeof value === 'string' && value.length === 24;
        }

        getTimeStringFromMs(ms) {
          return String(ms ?? '');
        }
      }
    );

    class CurrentUserService extends Service {
      get id() {
        return currentUserState.id;
      }

      get user() {
        return {
          id: currentUserState.id,
          username: currentUserState.username,
        };
      }

      get isAdmin() {
        return currentUserState.isAdmin;
      }

      get isStudent() {
        return currentUserState.isStudent;
      }
    }

    this.owner.unregister('service:current-user');
    this.owner.unregister('service:currentUser');
    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:currentUser', CurrentUserService);

    this.owner.register(
      'service:current-selection',
      class extends Service {
        selection = null;

        isCurrentSelection(selectionId) {
          return this.selection?.id === selectionId;
        }

        setSelection(selection) {
          this.selection = selection;
        }
      }
    );
    this.owner.unregister('service:currentSelection');
    this.owner.register(
      'service:currentSelection',
      class extends Service {
        selection = null;

        isCurrentSelection(selectionId) {
          return this.selection?.id === selectionId;
        }

        setSelection(selection) {
          this.selection = selection;
        }
      }
    );

    this.owner.register(
      'service:navigation',
      class extends Service {
        toNewResponse() {}
        openProblem() {}
      }
    );

    this.owner.unregister('service:sweet-alert');
    this.owner.register(
      'service:sweet-alert',
      class extends Service {
        showModal() {
          return Promise.resolve({ value: true });
        }
        showToast() {}
      }
    );

    // Keep selectable-area lightweight for this integration suite.
    this.owner.unregister('component:selectable-area');
    this.owner.unregister('template:components/selectable-area');

    this.owner.register(
      'component:selectable-area',
      class extends Component {
        static template = hbs`<div class='selectable-area-stub'>{{yield}}</div>`;
      }
    );
  });

  async function renderWorkspaceSubmission(context, overrides = {}) {
    const buildWorkspaceRef = (workspace = {}) => {
      const normalized = {
        workspaceType: 'individual',
        ...workspace,
      };
      if (typeof normalized.get !== 'function') {
        normalized.get = function (key) {
          return this[key];
        };
      }
      return normalized;
    };

    const defaultSelection = {
      id: 'sel-1',
      text: 'x + 1',
      isTrashed: false,
      createDate: new Date().toISOString(),
      createdBy: { id: 'u1' },
      submission: { id: 'sub-1' },
      workspace: buildWorkspaceRef({ id: 'ws-1' }),
    };

    context.setProperties({
      currentSubmission: {
        id: 'sub-1',
        puzzle: { title: 'Test Assignment' },
        answer: { answer: '', explanation: '' },
        shortAnswer: 'short answer',
        longAnswer: 'long answer',
        uploadedFile: {},
      },
      currentWorkspace: {
        id: 'ws-1',
        workspaceType: 'individual',
        get(key) {
          return this[key];
        },
        save() {
          return Promise.resolve(this);
        },
      },
      isParentWorkspace: false,
      selections: [defaultSelection],
      responses: [],
      canRespond: false,
      addSelection: () => {},
      deleteSelection: () => {},
      ...overrides,
    });

    await render(hbs`<WorkspaceSubmission
      @currentSubmission={{this.currentSubmission}}
      @currentWorkspace={{this.currentWorkspace}}
      @selections={{this.selections}}
      @responses={{this.responses}}
      @canRespond={{this.canRespond}}
      @isParentWorkspace={{this.isParentWorkspace}}
      @addSelection={{this.addSelection}}
      @deleteSelection={{this.deleteSelection}}
    />`);
  }

  function selection(overrides = {}) {
    const buildWorkspaceRef = (workspace = {}) => {
      const normalized = {
        workspaceType: 'individual',
        ...workspace,
      };
      if (typeof normalized.get !== 'function') {
        normalized.get = function (key) {
          return this[key];
        };
      }
      return normalized;
    };

    const record = {
      id: 'sel-default',
      text: 'selection text',
      isTrashed: false,
      createDate: new Date().toISOString(),
      createdBy: { id: 'u1' },
      submission: { id: 'sub-1' },
      workspace: buildWorkspaceRef({ id: 'ws-1' }),
      ...overrides,
    };

    record.workspace = buildWorkspaceRef(record.workspace);
    return record;
  }

  test('passes canDeleteSelections=true to DraggableSelection when delete permission is granted', async function (assert) {
    this.setCurrentUser({ id: 'admin-1', isAdmin: true, isStudent: false });
    this.setCanEdit(() => true);

    await renderWorkspaceSubmission(this, {
      selections: [
        selection({
          id: 'sel-other-user',
          text: 'other-user-selection',
          createdBy: { id: 'owner-2' },
        }),
      ],
    });

    await click('[title="Filter selections"]');
    await click('input[name="mySelectionsOnly"]');

    assert.dom('.draggable-selection').exists();
    assert
      .dom('.draggable-selection .fa-minus-circle')
      .exists(
        'admin can see delete control when level-4 permission is granted'
      );
  });

  test('passes canDeleteSelections=false to DraggableSelection when delete permission is denied', async function (assert) {
    this.setCurrentUser({ id: 'admin-1', isAdmin: true, isStudent: false });
    this.setCanEdit((workspace, area, level) => {
      if (area === 'selections' && level === 4) {
        return false;
      }
      return true;
    });

    await renderWorkspaceSubmission(this, {
      selections: [
        selection({
          id: 'sel-other-user',
          text: 'other-user-selection',
          createdBy: { id: 'owner-2' },
        }),
      ],
    });

    await click('[title="Filter selections"]');
    await click('input[name="mySelectionsOnly"]');

    assert.dom('.draggable-selection').exists();
    assert
      .dom('.draggable-selection .fa-minus-circle')
      .doesNotExist(
        'admin cannot see delete control when level-4 permission is denied'
      );
  });

  test('wires child delete action to parent deleteSelection callback', async function (assert) {
    let deletedSelection = null;
    const deleteCandidate = selection({
      id: 'sel-2',
      text: 'delete me',
      createdBy: { id: 'u1' },
    });

    await renderWorkspaceSubmission(this, {
      selections: [deleteCandidate],
      deleteSelection: (sel) => {
        deletedSelection = sel;
      },
    });

    await click('.draggable-selection .fa-minus-circle');

    assert.strictEqual(
      deletedSelection,
      deleteCandidate,
      'deleteSelection callback receives the selected record from child action'
    );
  });

  test('renders UndraggableSelection when user cannot create selections', async function (assert) {
    this.setCanEdit((workspace, area, level) => {
      if (area === 'selections' && level === 2) {
        return false;
      }
      return true;
    });

    await renderWorkspaceSubmission(this);

    assert.dom('.draggable-selection').doesNotExist();
    assert.dom('.unundraggable-selection').exists();
  });

  test('mySelectionsOnly filter hides non-owner selections by default and shows them after toggle', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [
        selection({
          id: 'sel-owner',
          text: 'owner-selection',
          createdBy: { id: 'u1' },
        }),
        selection({
          id: 'sel-other',
          text: 'other-selection',
          createdBy: { id: 'u2' },
        }),
      ],
    });

    assert.dom('#submission_selections').includesText('owner-selection');
    assert.dom('#submission_selections').doesNotIncludeText('other-selection');

    await click('[title="Filter selections"]');
    await click('input[name="mySelectionsOnly"]');

    assert.dom('#submission_selections').includesText('owner-selection');
    assert.dom('#submission_selections').includesText('other-selection');
  });

  test('thisSubmissionOnly filter excludes other submission selections until toggled off', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [
        selection({
          id: 'sel-sub-1',
          text: 'submission-one',
          submission: { id: 'sub-1' },
        }),
        selection({
          id: 'sel-sub-2',
          text: 'submission-two',
          submission: { id: 'sub-2' },
        }),
      ],
    });

    assert.dom('#submission_selections').includesText('submission-one');
    assert.dom('#submission_selections').doesNotIncludeText('submission-two');

    await click('[title="Filter selections"]');
    await click('input[name="thisSubmissionOnly"]');

    assert.dom('#submission_selections').includesText('submission-one');
    assert.dom('#submission_selections').includesText('submission-two');
  });

  test('thisWorkspaceOnly filter excludes other workspace selections until toggled off', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [
        selection({
          id: 'sel-ws-1',
          text: 'workspace-one',
          workspace: { id: 'ws-1' },
        }),
        selection({
          id: 'sel-ws-2',
          text: 'workspace-two',
          workspace: { id: 'ws-2' },
        }),
      ],
    });

    assert.dom('#submission_selections').includesText('workspace-one');
    assert.dom('#submission_selections').doesNotIncludeText('workspace-two');

    await click('[title="Filter selections"]');
    await click('input[name="thisWorkspaceOnly"]');

    assert.dom('#submission_selections').includesText('workspace-one');
    assert.dom('#submission_selections').includesText('workspace-two');
  });

  test('parent workspace renders non-selectable view and hides mySelectionsOnly filter option', async function (assert) {
    await renderWorkspaceSubmission(this, {
      currentWorkspace: {
        id: 'ws-parent',
        workspaceType: 'parent',
        save() {
          return Promise.resolve(this);
        },
      },
      isParentWorkspace: true,
    });

    assert.dom('#sel-view-header').doesNotExist();
    assert.dom('.non-selectable-sub').exists();

    await click('[title="Filter selections"]');
    assert.dom('input[name="mySelectionsOnly"]').doesNotExist();
  });

  test('respond button is disabled when no selections are visible', async function (assert) {
    await renderWorkspaceSubmission(this, {
      canRespond: true,
      selections: [],
    });

    assert.dom('button.action_button.new-response').isDisabled();
  });

  test('respond button is enabled when at least one selection is visible', async function (assert) {
    await renderWorkspaceSubmission(this, {
      canRespond: true,
      selections: [selection({ id: 'sel-present' })],
    });

    assert.dom('button.action_button.new-response').isNotDisabled();
  });

  test('shows empty selections message when there are no selections', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [],
    });

    assert
      .dom('#submission_selections .info')
      .includesText('No selections have been made yet.');
  });

  test('keeps an uploaded image inside the active submission view', async function (assert) {
    await renderWorkspaceSubmission(this, {
      currentSubmission: {
        id: 'sub-1',
        puzzle: { title: 'Test Assignment' },
        answer: { answer: '', explanation: '' },
        shortAnswer: 'short answer',
        longAnswer: 'long answer',
        uploadedFile: { savedFileName: 'student-work.png' },
        imageUrl: 'https://example.com/student-work.png',
      },
    });

    assert
      .dom('#submission_container #submission_images img')
      .hasAttribute('src', 'https://example.com/student-work.png');
    assert
      .dom('#submission_container #submission_images a')
      .hasAttribute('rel', 'noopener noreferrer');
    assert.dom('#submission_images').exists({ count: 1 });

    await click('input[name="is-selecting"]');

    assert
      .dom('.non-selectable-sub #submission_images img')
      .hasAttribute('src', 'https://example.com/student-work.png');
    assert.dom('#submission_images').exists({ count: 1 });
  });
});
