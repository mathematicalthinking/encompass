import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setOwner } from '@ember/application';
import Service from '@ember/service';

/**
 * COMPREHENSIVE UNIT TEST SUITE: workspace-submission component
 *
 * This test suite validates all core functionality of the workspace-submission component:
 * - Selection visibility and filtering
 * - Permission-based access control
 * - Submission-specific filtering
 * - UI state management
 * - CSS class application
 * - Action handlers
 *
 * Critical Bug Fix Validation:
 * The areNoSelections getter previously returned undefined instead of boolean,
 * breaking UI rendering for workspace owners. Tests validate the fix.
 */
module('Unit | Component | workspace-submission', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    // Default permissions function
    let permissionsCanEdit = () => true;

    // Mock workspace-permissions service
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit(workspace, recordType, level) {
          return permissionsCanEdit(workspace, recordType, level);
        }
      }
    );

    // Helper to override permissions
    this.setPermissions = (canEditFn) => {
      permissionsCanEdit = canEditFn;
    };

    // Mock current-user service
    this.owner.register(
      'service:current-user',
      class extends Service {
        user = {
          id: 'user-1',
          username: 'testuser',
          accountType: 'T',
          isAdmin: false,
        };
      }
    );

    this.owner.register(
      'service:utility-methods',
      class extends Service {
        isNonEmptyArray(arr) {
          return Array.isArray(arr) && arr.length > 0;
        }
        getBelongsToId(record, relationshipName) {
          if (record && record[relationshipName]) {
            return typeof record[relationshipName] === 'object'
              ? record[relationshipName].id
              : record[relationshipName];
          }
          return null;
        }
        isValidMongoId(id) {
          return typeof id === 'string' && id.length > 0;
        }
        extractMsFromTimeString(timeStr) {
          if (!timeStr) return -1;
          const parts = timeStr.split(':');
          if (parts.length !== 3) return -1;
          const [h, m, s] = parts.map(Number);
          return (h * 3600 + m * 60 + s) * 1000;
        }
        getTimeStringFromMs(ms) {
          const totalSeconds = Math.floor(ms / 1000);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
        }
      }
    );

    this.owner.register(
      'service:current-selection',
      class extends Service {
        selection = null;
        setSelection(sel) {
          this.selection = sel;
        }
      }
    );

    this.owner.register(
      'service:navigation',
      class extends Service {
        toNewResponse() {}
      }
    );
  });

  // Test data builders
  function createSubmission(id, additionalProps = {}) {
    return {
      id,
      get(prop) {
        return this[prop];
      },
      ...additionalProps,
    };
  }

  function createSelection(
    id,
    submissionId,
    isTrashed = false,
    additionalProps = {}
  ) {
    return {
      id,
      text: `Selection ${id}`,
      isTrashed,
      submission: submissionId,
      get(prop) {
        return this[prop];
      },
      ...additionalProps,
    };
  }

  function createResponse(id, submissionId, additionalProps = {}) {
    return {
      id,
      submission: submissionId,
      text: `Response ${id}`,
      get(prop) {
        return this[prop];
      },
      ...additionalProps,
    };
  }

  function createWorkspace(id, owner = 'user-1', additionalProps = {}) {
    return {
      id,
      name: 'Test Workspace',
      owner,
      get(prop) {
        return this[prop];
      },
      ...additionalProps,
    };
  }

  function setupComponent(context, args = {}) {
    const WorkspaceSubmissionComponent = context.owner.factoryFor(
      'component:workspace-submission'
    ).class;

    const component = Object.create(WorkspaceSubmissionComponent.prototype);
    setOwner(component, context.owner);

    // Set component args with defaults
    component.args = {
      currentSubmission: args.currentSubmission || createSubmission('sub-1'),
      currentWorkspace: args.currentWorkspace || createWorkspace('ws-1'),
      selections: args.selections || [],
      responses: args.responses || [],
      canSeeSubmission:
        args.canSeeSubmission !== undefined ? args.canSeeSubmission : true,
      addSelection: args.addSelection || (() => {}),
      deleteSelection: args.deleteSelection || (() => {}),
    };

    return component;
  }

  module('Selection Visibility - Bug Fix Tests', function () {
    test('areNoSelections returns boolean false when selections exist', function (assert) {
      const submission = createSubmission('sub-1');
      const selection1 = createSelection('sel-1', 'sub-1', false);
      const selection2 = createSelection('sel-2', 'sub-1', false);
      const workspace = createWorkspace('ws-1');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [selection1, selection2],
      });

      // CRITICAL BUG FIX VALIDATION
      // Before fix: this.canSeeSelections (undefined) && !length > 0 => undefined
      // After fix: this.canSelect (true) && length === 0 => false
      const result = component.areNoSelections;

      assert.strictEqual(
        typeof result,
        'boolean',
        'areNoSelections must return boolean, not undefined'
      );

      assert.strictEqual(
        result,
        false,
        'areNoSelections should be false when selections exist'
      );
    });

    test('areNoSelections returns boolean true when no selections exist', function (assert) {
      const submission = createSubmission('sub-2');
      const workspace = createWorkspace('ws-2');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [],
      });

      const result = component.areNoSelections;

      assert.strictEqual(
        typeof result,
        'boolean',
        'areNoSelections must return boolean type'
      );

      assert.strictEqual(
        result,
        true,
        'areNoSelections should be true when no selections exist'
      );
    });

    test('areNoSelections considers trashed selections as selections', function (assert) {
      const submission = createSubmission('sub-3');
      const trashedSelection = createSelection('sel-trash-1', 'sub-3', true);
      const workspace = createWorkspace('ws-3');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [trashedSelection],
      });

      // workspaceSelections includes trashed items (filtered by submission ID only)
      const result = component.areNoSelections;

      assert.strictEqual(
        typeof result,
        'boolean',
        'areNoSelections returns boolean with trashed selections'
      );

      assert.strictEqual(
        result,
        false,
        'areNoSelections should be false when trashed selections exist'
      );
    });

    test('areNoSelections depends on canSelect permission', function (assert) {
      const submission = createSubmission('sub-4');
      const workspace = createWorkspace('ws-4');

      // Test with permission denied
      this.setPermissions(() => false);

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [],
      });

      // When canSelect is false and no selections: false && true = false
      assert.strictEqual(
        component.areNoSelections,
        false,
        'areNoSelections should be false when user cannot select'
      );
    });
  });

  module('Selection Filtering', function () {
    test('workspaceSelections filters selections by submission ID', function (assert) {
      const submission = createSubmission('sub-5');
      const selection1 = createSelection('sel-5-1', 'sub-5', false);
      const selection2 = createSelection('sel-5-2', 'sub-5', false);
      const otherSelection = createSelection('sel-other', 'sub-other', false);
      const workspace = createWorkspace('ws-5');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [selection1, selection2, otherSelection],
      });

      const filtered = component.workspaceSelections;

      assert.strictEqual(
        filtered.length,
        2,
        'workspaceSelections should only include selections for current submission'
      );

      assert.ok(
        filtered.includes(selection1),
        'workspaceSelections should include selection1'
      );
      assert.ok(
        filtered.includes(selection2),
        'workspaceSelections should include selection2'
      );
      assert.notOk(
        filtered.includes(otherSelection),
        'workspaceSelections should NOT include selections from other submissions'
      );
    });

    test('workspaceSelections includes both trashed and non-trashed', function (assert) {
      const submission = createSubmission('sub-6');
      const activeSelection = createSelection('sel-active', 'sub-6', false);
      const trashedSelection = createSelection('sel-trashed', 'sub-6', true);
      const workspace = createWorkspace('ws-6');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [activeSelection, trashedSelection],
      });

      const filtered = component.workspaceSelections;

      assert.strictEqual(
        filtered.length,
        2,
        'workspaceSelections should include both trashed and non-trashed'
      );
    });

    test('trashedSelections filters only trashed selections', function (assert) {
      const submission = createSubmission('sub-7');
      const activeSelection = createSelection('sel-active', 'sub-7', false);
      const trashedSelection1 = createSelection('sel-trashed-1', 'sub-7', true);
      const trashedSelection2 = createSelection('sel-trashed-2', 'sub-7', true);
      const workspace = createWorkspace('ws-7');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        selections: [activeSelection, trashedSelection1, trashedSelection2],
      });

      const trashed = component.trashedSelections;

      assert.strictEqual(
        trashed.length,
        2,
        'trashedSelections should only include trashed selections'
      );

      assert.ok(
        trashed.includes(trashedSelection1),
        'should include trashedSelection1'
      );
      assert.ok(
        trashed.includes(trashedSelection2),
        'should include trashedSelection2'
      );
      assert.notOk(
        trashed.includes(activeSelection),
        'should not include active selection'
      );
    });
  });

  module('Response Filtering', function () {
    test('submissionResponses filters responses by submission ID', function (assert) {
      const submission = createSubmission('sub-8');
      const response1 = createResponse('resp-1', 'sub-8');
      const response2 = createResponse('resp-2', 'sub-8');
      const otherResponse = createResponse('resp-other', 'sub-other');
      const workspace = createWorkspace('ws-8');

      const component = setupComponent(this, {
        currentSubmission: submission,
        currentWorkspace: workspace,
        responses: [response1, response2, otherResponse],
      });

      const filtered = component.submissionResponses;

      assert.strictEqual(
        filtered.length,
        2,
        'submissionResponses should only include responses for current submission'
      );

      assert.ok(
        filtered.includes(response1),
        'submissionResponses should include response1'
      );
      assert.ok(
        filtered.includes(response2),
        'submissionResponses should include response2'
      );
      assert.notOk(
        filtered.includes(otherResponse),
        'submissionResponses should NOT include responses from other submissions'
      );
    });
  });

  module('Permission-Based Getters', function () {
    test('canSelect returns true when user has selection edit permission', function (assert) {
      this.setPermissions((ws, recordType, level) => {
        if (recordType === 'selections' && level === 2) return true;
        return false;
      });

      const workspace = createWorkspace('ws-9');
      const component = setupComponent(this, {
        currentWorkspace: workspace,
      });

      assert.strictEqual(
        component.canSelect,
        true,
        'canSelect should be true when user has permission'
      );
    });

    test('canSelect returns false when user lacks selection edit permission', function (assert) {
      this.setPermissions((ws, recordType, level) => {
        if (recordType === 'selections' && level === 2) return false;
        return true;
      });

      const workspace = createWorkspace('ws-10');
      const component = setupComponent(this, {
        currentWorkspace: workspace,
      });

      assert.strictEqual(
        component.canSelect,
        false,
        'canSelect should be false when user lacks permission'
      );
    });

    test('canDeleteSelection returns true when user has delete permission', function (assert) {
      this.setPermissions((ws, recordType, level) => {
        if (recordType === 'selections' && level === 4) return true;
        return false;
      });

      const workspace = createWorkspace('ws-11');
      const component = setupComponent(this, {
        currentWorkspace: workspace,
      });

      assert.strictEqual(
        component.canDeleteSelection,
        true,
        'canDeleteSelection should be true when user has delete permission'
      );
    });

    test('canDeleteSelection returns false when user lacks delete permission', function (assert) {
      this.setPermissions((ws, recordType, level) => {
        if (recordType === 'selections' && level === 4) return false;
        return true;
      });

      const workspace = createWorkspace('ws-12');
      const component = setupComponent(this, {
        currentWorkspace: workspace,
      });

      assert.strictEqual(
        component.canDeleteSelection,
        false,
        'canDeleteSelection should be false when user lacks delete permission'
      );
    });
  });

  module('UI State Getters', function () {
    test('selectionBoxClass returns "no-selections" when no selections exist', function (assert) {
      const component = setupComponent(this, {
        selections: [],
      });

      assert.strictEqual(
        component.selectionBoxClass,
        'no-selections',
        'should return "no-selections" class when no selections exist'
      );
    });

    test('selectionBoxClass returns "expanded" when selections box is expanded', function (assert) {
      const selection = createSelection('sel-1', 'sub-1', false);
      const component = setupComponent(this, {
        selections: [selection],
      });

      component.isSelectionsBoxExpanded = true;

      assert.strictEqual(
        component.selectionBoxClass,
        'expanded',
        'should return "expanded" class when box is expanded'
      );
    });

    test('selectionBoxClass returns empty string for default state', function (assert) {
      const selection = createSelection('sel-1', 'sub-1', false);
      const component = setupComponent(this, {
        selections: [selection],
      });

      component.isSelectionsBoxExpanded = false;

      assert.strictEqual(
        component.selectionBoxClass,
        '',
        'should return empty string for default state'
      );
    });

    test('showSelectionsInfo returns correct info when showing selections', function (assert) {
      const component = setupComponent(this);
      component.showingSelections = true;

      const info = component.showSelectionsInfo;

      assert.strictEqual(
        info.text,
        'Hide Selections',
        'text should be "Hide Selections"'
      );
      assert.strictEqual(
        info.icon,
        'far fa-eye-slash',
        'icon should be eye-slash'
      );
      assert.strictEqual(
        info.title,
        'Hide Selections',
        'title should be "Hide Selections"'
      );
    });

    test('showSelectionsInfo returns correct info when hiding selections', function (assert) {
      const component = setupComponent(this);
      component.showingSelections = false;

      const info = component.showSelectionsInfo;

      assert.strictEqual(
        info.text,
        'Show Selections',
        'text should be "Show Selections"'
      );
      assert.strictEqual(info.icon, 'far fa-eye', 'icon should be eye');
      assert.strictEqual(
        info.title,
        'Show Selections',
        'title should be "Show Selections"'
      );
    });

    test('toggleSelectionInfo returns correct info when expanded', function (assert) {
      const component = setupComponent(this);
      component.isSelectionsBoxExpanded = true;

      const info = component.toggleSelectionInfo;

      assert.strictEqual(
        info.imgName,
        'chevrons-down.svg',
        'imgName should be chevrons-down'
      );
      assert.strictEqual(
        info.className,
        'shrink-selection-box',
        'className should be shrink'
      );
      assert.strictEqual(info.title, 'collapse', 'title should be collapse');
    });

    test('toggleSelectionInfo returns correct info when collapsed', function (assert) {
      const component = setupComponent(this);
      component.isSelectionsBoxExpanded = false;

      const info = component.toggleSelectionInfo;

      assert.strictEqual(
        info.imgName,
        'chevrons-up.svg',
        'imgName should be chevrons-up'
      );
      assert.strictEqual(
        info.className,
        'expand-selection-box',
        'className should be expand'
      );
      assert.strictEqual(info.title, 'expand', 'title should be expand');
    });

    test('showExpandSelections returns true when selections exist and not hidden', function (assert) {
      const selection = createSelection('sel-1', 'sub-1', false);
      const component = setupComponent(this, {
        selections: [selection],
      });

      component.areSelectionsHidden = false;

      assert.strictEqual(
        component.showExpandSelections,
        true,
        'should return true when selections exist and are not hidden'
      );
    });

    test('showExpandSelections returns false when no selections', function (assert) {
      const component = setupComponent(this, {
        selections: [],
      });

      component.areSelectionsHidden = false;

      assert.strictEqual(
        component.showExpandSelections,
        false,
        'should return false when no selections exist'
      );
    });

    test('showExpandSelections returns false when selections are hidden', function (assert) {
      const selection = createSelection('sel-1', 'sub-1', false);
      const component = setupComponent(this, {
        selections: [selection],
      });

      component.areSelectionsHidden = true;

      assert.strictEqual(
        component.showExpandSelections,
        false,
        'should return false when selections are hidden'
      );
    });
  });

  module('Actions', function () {
    test('toggleShow toggles showingSelections state', function (assert) {
      const component = setupComponent(this);

      component.showingSelections = false;
      component.toggleShow();
      assert.strictEqual(
        component.showingSelections,
        true,
        'should toggle from false to true'
      );

      component.toggleShow();
      assert.strictEqual(
        component.showingSelections,
        false,
        'should toggle from true to false'
      );
    });

    test('showSelections sets showingSelections to true', function (assert) {
      const component = setupComponent(this);

      component.showingSelections = false;
      component.showSelections();
      assert.strictEqual(
        component.showingSelections,
        true,
        'should set to true'
      );
    });

    test('hideSelections sets showingSelections to false', function (assert) {
      const component = setupComponent(this);

      component.showingSelections = true;
      component.hideSelections();
      assert.strictEqual(
        component.showingSelections,
        false,
        'should set to false'
      );
    });

    test('toggleSelectionBox toggles isSelectionsBoxExpanded state', function (assert) {
      const component = setupComponent(this);

      component.isSelectionsBoxExpanded = false;
      component.toggleSelectionBox();
      assert.strictEqual(
        component.isSelectionsBoxExpanded,
        true,
        'should toggle from false to true'
      );

      component.toggleSelectionBox();
      assert.strictEqual(
        component.isSelectionsBoxExpanded,
        false,
        'should toggle from true to false'
      );
    });

    test('deleteSelection marks component as dirty and calls args.deleteSelection', function (assert) {
      assert.expect(2);

      const selection = createSelection('sel-delete', 'sub-1', false);
      const component = setupComponent(this, {
        deleteSelection: (sel) => {
          assert.strictEqual(
            sel,
            selection,
            'should call with correct selection'
          );
        },
      });

      component.isDirty = false;
      component.deleteSelection(selection);

      assert.strictEqual(
        component.isDirty,
        true,
        'should mark component as dirty'
      );
    });

    test('addSelection marks component as dirty for non-VMT', function (assert) {
      const selection = createSelection('sel-add', 'sub-1', false);
      const submission = createSubmission('sub-1');

      // Create submission without VMT info (isVmt will return false)
      const component = setupComponent(this, {
        currentSubmission: submission,
        addSelection: () => {
          assert.step('addSelection called');
        },
      });

      component.isDirty = false;
      component.addSelection(selection, false);

      assert.strictEqual(
        component.isDirty,
        true,
        'should mark component as dirty'
      );
      assert.verifySteps(
        ['addSelection called'],
        'should call args.addSelection'
      );
    });
  });

  module('Current Selection', function () {
    test('currentSelection getter returns value from currentSelectionService', function (assert) {
      const testSelection = createSelection('sel-current', 'sub-1', false);
      const currentSelectionService = this.owner.lookup(
        'service:current-selection'
      );
      currentSelectionService.selection = testSelection;

      const component = setupComponent(this);

      assert.strictEqual(
        component.currentSelection,
        testSelection,
        'should return selection from service'
      );
    });

    test('currentSelectionService can be updated through service', function (assert) {
      const testSelection = createSelection('sel-set', 'sub-1', false);
      const currentSelectionService = this.owner.lookup(
        'service:current-selection'
      );

      const component = setupComponent(this);

      // Update through service (since component only has getter, not setter)
      currentSelectionService.setSelection(testSelection);

      assert.strictEqual(
        component.currentSelection,
        testSelection,
        'should reflect selection from service'
      );
      assert.strictEqual(
        currentSelectionService.selection,
        testSelection,
        'should update selection in service'
      );
    });
  });

  module('Property Validation', function () {
    test('canSeeSelections property does not exist (validates bug fix)', function (assert) {
      const component = setupComponent(this);

      assert.strictEqual(
        component.canSeeSelections,
        undefined,
        'canSeeSelections should not exist - it was the source of the bug'
      );
    });

    test('makingSelection tracked property exists and defaults to true', function (assert) {
      const component = setupComponent(this);

      assert.strictEqual(
        component.makingSelection,
        true,
        'makingSelection should default to true'
      );
    });

    test('showingSelections tracked property exists and defaults to false', function (assert) {
      const component = setupComponent(this);

      assert.strictEqual(
        component.showingSelections,
        false,
        'showingSelections should default to false'
      );
    });

    test('shouldCheck getter returns makingSelection value', function (assert) {
      const component = setupComponent(this);

      component.makingSelection = true;
      assert.strictEqual(
        component.shouldCheck,
        true,
        'shouldCheck should match makingSelection'
      );

      component.makingSelection = false;
      assert.strictEqual(
        component.shouldCheck,
        false,
        'shouldCheck should match makingSelection'
      );
    });
  });
});
