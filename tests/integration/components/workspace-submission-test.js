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

    this.setCanEdit = (fn) => {
      canEditImpl = fn;
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

    this.owner.register(
      'service:current-user',
      class extends Service {
        id = 'u1';
        user = { id: 'u1', username: 'test-user' };
      }
    );
    this.owner.register(
      'service:currentUser',
      class extends Service {
        id = 'u1';
        user = { id: 'u1', username: 'test-user' };
      }
    );

    this.owner.register(
      'service:current-selection',
      class extends Service {
        selection = null;

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

    this.owner.register(
      'component:selectable-area',
      class extends Component {
        static template = hbs`<div class='selectable-area-stub'>{{yield}}</div>`;
      }
    );

    this.owner.register(
      'component:draggable-selection',
      class extends Component {
        static template = hbs`<div
          class='draggable-selection-stub'
          data-selection-id={{@selection.id}}
          data-can-delete={{if @canDeleteSelections 'true' 'false'}}
        >
          <button
            type='button'
            class='trigger-delete-selection'
            {{on 'click' (fn @deleteSelection @selection)}}
          >
            Delete Selection
          </button>
        </div>`;
      }
    );

    this.owner.register(
      'component:undraggable-selection',
      class extends Component {
        static template = hbs`<div
          class='undraggable-selection-stub'
        >Undraggable Selection</div>`;
      }
    );
  });

  async function renderWorkspaceSubmission(context, overrides = {}) {
    const defaultSelection = {
      id: 'sel-1',
      text: 'x + 1',
      isTrashed: false,
      createdBy: { id: 'u1' },
      submission: { id: 'sub-1' },
      workspace: { id: 'ws-1' },
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
    return {
      id: 'sel-default',
      text: 'selection text',
      isTrashed: false,
      createdBy: { id: 'u1' },
      submission: { id: 'sub-1' },
      workspace: { id: 'ws-1' },
      ...overrides,
    };
  }

  test('passes canDeleteSelections=true to DraggableSelection when delete permission is granted', async function (assert) {
    this.setCanEdit(() => true);

    await renderWorkspaceSubmission(this);

    assert.dom('.draggable-selection-stub').exists();
    assert
      .dom('.draggable-selection-stub')
      .hasAttribute('data-can-delete', 'true');
  });

  test('passes canDeleteSelections=false to DraggableSelection when delete permission is denied', async function (assert) {
    this.setCanEdit((workspace, area, level) => {
      if (area === 'selections' && level === 4) {
        return false;
      }
      return true;
    });

    await renderWorkspaceSubmission(this);

    assert.dom('.draggable-selection-stub').exists();
    assert
      .dom('.draggable-selection-stub')
      .hasAttribute('data-can-delete', 'false');
  });

  test('wires child delete action to parent deleteSelection callback', async function (assert) {
    let deletedSelection = null;
    const selection = {
      id: 'sel-2',
      text: 'delete me',
      isTrashed: false,
      createdBy: { id: 'u1' },
      submission: { id: 'sub-1' },
      workspace: { id: 'ws-1' },
    };

    await renderWorkspaceSubmission(this, {
      selections: [selection],
      deleteSelection: (sel) => {
        deletedSelection = sel;
      },
    });

    await click('.trigger-delete-selection');

    assert.strictEqual(
      deletedSelection,
      selection,
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

    assert.dom('.draggable-selection-stub').doesNotExist();
    assert.dom('.undraggable-selection-stub').exists();
  });

  test('mySelectionsOnly filter hides non-owner selections by default and shows them after toggle', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [
        selection({ id: 'sel-owner', createdBy: { id: 'u1' } }),
        selection({ id: 'sel-other', createdBy: { id: 'u2' } }),
      ],
    });

    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-owner"]')
      .exists();
    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-other"]')
      .doesNotExist();

    await click('[title="Filter selections"]');
    await click('input[name="mySelectionsOnly"]');

    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-owner"]')
      .exists();
    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-other"]')
      .exists();
  });

  test('thisSubmissionOnly filter excludes other submission selections until toggled off', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [
        selection({ id: 'sel-sub-1', submission: { id: 'sub-1' } }),
        selection({ id: 'sel-sub-2', submission: { id: 'sub-2' } }),
      ],
    });

    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-sub-1"]')
      .exists();
    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-sub-2"]')
      .doesNotExist();

    await click('[title="Filter selections"]');
    await click('input[name="thisSubmissionOnly"]');

    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-sub-1"]')
      .exists();
    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-sub-2"]')
      .exists();
  });

  test('thisWorkspaceOnly filter excludes other workspace selections until toggled off', async function (assert) {
    await renderWorkspaceSubmission(this, {
      selections: [
        selection({ id: 'sel-ws-1', workspace: { id: 'ws-1' } }),
        selection({ id: 'sel-ws-2', workspace: { id: 'ws-2' } }),
      ],
    });

    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-ws-1"]')
      .exists();
    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-ws-2"]')
      .doesNotExist();

    await click('[title="Filter selections"]');
    await click('input[name="thisWorkspaceOnly"]');

    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-ws-1"]')
      .exists();
    assert
      .dom('.draggable-selection-stub[data-selection-id="sel-ws-2"]')
      .exists();
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
});
