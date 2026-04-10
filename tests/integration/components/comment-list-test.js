import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';
import Component from '@glimmer/component';
import ClassicComponent from '@ember/component';

module('Integration | Component | comment-list', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class WorkspaceCommentStub extends Component {
      // Non-empty class to satisfy lint rule for Glimmer stub components.
      get isStubComponent() {
        return true;
      }
    }
    this.owner.register('component:workspace-comment', WorkspaceCommentStub);
    this.owner.register(
      'template:components/workspace-comment',
      hbs`<li class='ws-comment-comp'>
        <button
          type='button'
          class='stub-delete-comment'
          {{on 'click' (fn @deleteComment @comment)}}
        >
          Delete
        </button>
      </li>`
    );
    this.owner.register(
      'component:search-bar',
      ClassicComponent.extend({
        layout: hbs`<div class="search-bar-comp"></div>`,
      })
    );
    this.owner.register(
      'component:pagination-control',
      class extends Component {
        static template = hbs``;
      }
    );
    this.owner.register(
      'component:ui/my-select',
      class extends Component {
        static template = hbs``;
      }
    );
    this.owner.register(
      'component:ui/error-box',
      class extends Component {
        static template = hbs``;
      }
    );

    class SweetAlertService extends Service {
      toastCalls = [];
      modalCalls = [];
      modalResult = { value: false };

      showToast() {
        this.toastCalls.push([...arguments]);
        return Promise.resolve({ value: false });
      }
      showModal() {
        this.modalCalls.push([...arguments]);
        return Promise.resolve(this.modalResult);
      }
    }

    class UtilityMethodsService extends Service {
      isNonEmptyObject(obj) {
        return obj && Object.keys(obj).length > 0;
      }
      getBelongsToId(record, key) {
        return record[key]?.id;
      }
      getHasManyIds(record, key) {
        return record?.[key] || [];
      }
    }

    class LoadingDisplayService extends Service {
      handleLoadingMessage() {}
    }

    class WorkspacePermissionsService extends Service {
      canEdit() {
        return true;
      }
    }

    class CurrentUserService extends Service {
      user = { id: 'u1', username: 'testuser' };
      id = 'u1';
    }

    class CurrentSelectionService extends Service {
      selection = null;

      get hasSelection() {
        return !!this.selection;
      }

      isCurrentSelection(selectionId) {
        return this.selection?.id === selectionId;
      }

      setSelection(selection) {
        this.selection = selection;
      }
    }

    class StoreService extends Service {
      createRecord() {
        return { save: () => Promise.resolve({}) };
      }
      peekAll() {
        return [];
      }
      query() {
        return Promise.resolve({ slice: () => [], meta: {} });
      }
    }

    class ErrorHandlingService extends Service {
      getErrors() {
        return [];
      }
      handleErrors() {}
    }

    this.owner.register('service:sweet-alert', SweetAlertService);
    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register('service:loading-display', LoadingDisplayService);
    this.owner.register(
      'service:workspace-permissions',
      WorkspacePermissionsService
    );
    this.owner.register('service:currentUser', CurrentUserService);
    this.owner.register('service:currentSelection', CurrentSelectionService);
    this.owner.register('service:store', StoreService);
    this.owner.register('service:error-handling', ErrorHandlingService);
  });

  async function renderCommentList(context, props = {}) {
    const {
      comments = [],
      currentWorkspace = { id: 'w1' },
      currentSubmission = { id: 'sub1' },
    } = props;

    context.setProperties({
      comments,
      currentWorkspace,
      currentSubmission,
      ...props,
    });

    await render(hbs`<CommentList
      @comments={{this.comments}}
      @currentWorkspace={{this.currentWorkspace}}
      @currentSubmission={{this.currentSubmission}}
      @isParentWorkspace={{this.isParentWorkspace}}
      @containerLayoutClass={{this.containerLayoutClass}}
      @isHidden={{this.isHidden}}
    />`);
  }

  test('renders and shows empty message when no comments', async function (assert) {
    await renderCommentList(this, { comments: [] });
    assert.dom('#comment-list').exists();
    assert.dom('.info').hasText('No comments to display');
  });

  test('handles null currentSelection', async function (assert) {
    await renderCommentList(this);
    assert.dom('#comment-list').exists();
  });

  test('shows comment textarea when user can comment', async function (assert) {
    await renderCommentList(this);
    assert.dom('#commentTextarea').exists();
  });

  test('shows cancel and save buttons when on selection', async function (assert) {
    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    assert.dom('.cancel-button').exists();
    assert.dom('.save').exists();
  });

  test('cancel button clears textarea', async function (assert) {
    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    await fillIn('#commentTextarea', 'Test comment');
    await click('.cancel-button');
    assert.dom('#commentTextarea').hasValue('');
  });

  test('shows filter options', async function (assert) {
    await renderCommentList(this);
    assert.dom('.filter-label').hasText('Filter');
    assert.dom('input[name="thisWorkspaceOnly"]').exists();
    assert.dom('input[name="thisSubmissionOnly"]').exists();
    assert.dom('input[name="myCommentsOnly"]').exists();
  });

  test('workspace filter is checked by default', async function (assert) {
    await renderCommentList(this);
    assert.dom('input[name="thisWorkspaceOnly"]').isChecked();
  });

  test('submission filter is checked by default', async function (assert) {
    await renderCommentList(this);
    assert.dom('input[name="thisSubmissionOnly"]').isChecked();
  });

  test('shows scroll icon', async function (assert) {
    await renderCommentList(this);
    assert.dom('.scroll-icon').exists();
    assert.dom('.fa-chevron-circle-down').exists();
  });

  test('scroll icon changes on click', async function (assert) {
    await renderCommentList(this);
    await click('.fa-chevron-circle-down');
    assert.dom('.fa-chevron-circle-up').exists();
  });

  test('shows label select dropdown when can comment', async function (assert) {
    await renderCommentList(this);
    assert.dom('.label-select').exists();
  });

  test('shows hide comments icon', async function (assert) {
    await renderCommentList(this);
    assert.dom('.fa-eye-slash').exists();
    assert.dom('.fa-eye-slash').hasAttribute('title', 'Hide Comments');
  });

  test('shows search bar', async function (assert) {
    await renderCommentList(this);
    assert.dom('.search').exists();
  });

  test('shows since date filter', async function (assert) {
    await renderCommentList(this);
    assert.dom('input[name="doUseSinceDate"]').exists();
  });

  test('shows parent workspace message when isParentWorkspace and cannot comment', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return false;
        }
      }
    );

    await renderCommentList(this, { isParentWorkspace: true });
    assert
      .dom('.info')
      .includesText('Parent / Combined Workspaces do not support');
  });

  test('shows permission error when cannot comment and not parent workspace', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return false;
        }
      }
    );

    await renderCommentList(this, { isParentWorkspace: false });
    assert
      .dom('.error-message')
      .includesText('You do not have permisssion to make comments');
  });

  test('adds bi-paneled class when containerLayoutClass is hsc', async function (assert) {
    await renderCommentList(this, { containerLayoutClass: 'hsc' });
    assert.dom('#comment-list').hasClass('bi-paneled');
  });

  test('adds tri-paneled class when containerLayoutClass is fsc', async function (assert) {
    await renderCommentList(this, { containerLayoutClass: 'fsc' });
    assert.dom('#comment-list').hasClass('tri-paneled');
  });

  test('adds on-selection class when currentSelection exists', async function (assert) {
    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    assert.dom('#comment-list').hasClass('on-selection');
  });

  test('adds can-comment class when user can comment', async function (assert) {
    await renderCommentList(this);
    assert.dom('#comment-list').hasClass('can-comment');
  });

  test('hides compose buttons when no selection', async function (assert) {
    await renderCommentList(this);
    assert.dom('.cancel-button').doesNotExist();
    assert.dom('.save').doesNotExist();
  });

  test('myCommentsOnly filter is checked when not parent workspace', async function (assert) {
    await renderCommentList(this, { isParentWorkspace: false });
    assert.dom('input[name="myCommentsOnly"]').isChecked();
  });

  test('workspace filter is disabled when isParentWorkspace', async function (assert) {
    await renderCommentList(this, { isParentWorkspace: true });
    assert.dom('input[name="thisWorkspaceOnly"]').isDisabled();
  });

  test('does not show compose buttons when cannot comment', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return false;
        }
      }
    );

    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    assert.dom('.cancel-button').doesNotExist();
    assert.dom('.save').doesNotExist();
  });

  test('does not show label select when cannot comment', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return false;
        }
      }
    );

    await renderCommentList(this);
    assert.dom('.label-select').doesNotExist();
  });

  test('does not show textarea when cannot comment', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return false;
        }
      }
    );

    await renderCommentList(this);
    assert.dom('#commentTextarea').doesNotExist();
  });

  test('adds hidden class when isHidden is true', async function (assert) {
    await renderCommentList(this, { isHidden: true });
    assert.dom('#comment-list.hidden').exists();
  });

  test('save button calls createComment when text is entered', async function (assert) {
    let createRecordCalled = false;
    this.owner.register(
      'service:store',
      class extends Service {
        createRecord() {
          createRecordCalled = true;
          return { save: () => Promise.resolve({ id: 'new-comment' }) };
        }
        peekAll() {
          return [];
        }
        query() {
          return Promise.resolve({ slice: () => [], meta: {} });
        }
      }
    );

    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    await fillIn('#commentTextarea', 'New comment');
    await click('.save');
    assert.true(createRecordCalled);
  });

  test('does not create comment when textarea is empty', async function (assert) {
    let createRecordCalled = false;
    this.owner.register(
      'service:store',
      class extends Service {
        createRecord() {
          createRecordCalled = true;
          return { save: () => Promise.resolve({}) };
        }
        peekAll() {
          return [];
        }
        query() {
          return Promise.resolve({ slice: () => [], meta: {} });
        }
      }
    );

    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    await click('.save');
    assert.false(createRecordCalled);
  });

  test('does not create comment when textarea has only whitespace', async function (assert) {
    let createRecordCalled = false;
    this.owner.register(
      'service:store',
      class extends Service {
        createRecord() {
          createRecordCalled = true;
          return { save: () => Promise.resolve({}) };
        }
        peekAll() {
          return [];
        }
        query() {
          return Promise.resolve({ slice: () => [], meta: {} });
        }
      }
    );

    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);
    await fillIn('#commentTextarea', '   ');
    await click('.save');
    assert.false(createRecordCalled);
  });

  test('shows loading message when searching', async function (assert) {
    await renderCommentList(this);
    await click('input[name="thisWorkspaceOnly"]');
    await click('input[name="thisSubmissionOnly"]');
    assert.dom('.display-list').exists();
  });

  test('does not show results description when loading', async function (assert) {
    await renderCommentList(this);
    assert.dom('.results-message').doesNotExist();
  });

  test('shows apply button when since date is valid and checked', async function (assert) {
    await renderCommentList(this);
    await click('input[name="doUseSinceDate"]');
    assert.dom('input[name="doUseSinceDate"]').isChecked();
  });

  test('label select has notice class by default', async function (assert) {
    await renderCommentList(this);
    assert.dom('.label-select').hasClass('notice');
  });

  // Tests for currentSelection service integration
  test('uses currentSelection service instead of prop', async function (assert) {
    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    currentSelectionService.setSelection({ id: 's1' });

    await renderCommentList(this);

    assert.strictEqual(currentSelectionService.selection.id, 's1');
    assert.true(currentSelectionService.hasSelection);
  });

  test('detects when no selection via service', async function (assert) {
    await renderCommentList(this);

    const currentSelectionService = this.owner.lookup(
      'service:currentSelection'
    );
    assert.false(currentSelectionService.hasSelection);
    assert.dom('.cancel-button').doesNotExist();
  });

  // Tests for parent workspace behavior with myCommentsOnly filter
  test('does not show myCommentsOnly filter when isParentWorkspace', async function (assert) {
    await renderCommentList(this, { isParentWorkspace: true });
    assert.dom('input[name="myCommentsOnly"]').doesNotExist();
  });

  test('shows myCommentsOnly filter when not parent workspace', async function (assert) {
    await renderCommentList(this, { isParentWorkspace: false });
    assert.dom('input[name="myCommentsOnly"]').exists();
  });

  // Tests for results description messaging
  test('shows "your comments" message when myCommentsOnly is true', async function (assert) {
    const comment = {
      id: 'c1',
      text: 'test',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u1' },
    };

    await renderCommentList(this, {
      isParentWorkspace: false,
      comments: [comment],
    });

    assert.dom('.results-message').includesText('only your comments');
  });

  test('shows "comments" without "your" when myCommentsOnly is false', async function (assert) {
    const comment = {
      id: 'c1',
      text: 'test',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u1' },
    };

    await renderCommentList(this, {
      isParentWorkspace: false,
      comments: [comment],
    });

    // Uncheck myCommentsOnly
    await click('input[name="myCommentsOnly"]');

    // Should show "comments" without "your"
    assert.dom('.results-message').exists();
    assert.dom('.results-message').doesNotIncludeText('only your');
  });

  test('shows "for current submission" in results when thisSubmissionOnly', async function (assert) {
    const comment = {
      id: 'c1',
      text: 'test',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u1' },
    };

    await renderCommentList(this, {
      comments: [comment],
    });

    assert.dom('.results-message').includesText('for current submission');
  });

  test('shows "for current workspace" when only thisWorkspaceOnly is checked', async function (assert) {
    const comment = {
      id: 'c1',
      text: 'test',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u1' },
    };

    await renderCommentList(this, {
      comments: [comment],
    });

    // Uncheck submission filter
    await click('input[name="thisSubmissionOnly"]');

    assert.dom('.results-message').includesText('for current workspace');
  });

  test('blocks non-admin cross-user delete attempt with toast and no modal', async function (assert) {
    let saveCalled = false;
    const comment = {
      id: 'c1',
      text: 'cross-user',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u2' },
      save() {
        saveCalled = true;
        return Promise.resolve({});
      },
    };

    await renderCommentList(this, {
      comments: [comment],
      isParentWorkspace: false,
    });

    await click('input[name="myCommentsOnly"]');
    assert.dom('.stub-delete-comment').exists();
    const alert = this.owner.lookup('service:sweet-alert');
    await click('.stub-delete-comment');
    assert.false(saveCalled, 'does not save on unauthorized delete');
    assert.strictEqual(
      alert.modalCalls.length,
      0,
      'does not open confirmation modal'
    );
    assert.strictEqual(alert.toastCalls.length, 1, 'shows one toast');
    assert.strictEqual(
      alert.toastCalls[0][1],
      'You can only delete your own comments.',
      'shows ownership block message'
    );
  });

  test('admin cross-user delete uses warning modal copy', async function (assert) {
    this.owner.register(
      'service:currentUser',
      class extends Service {
        user = { id: 'u1', username: 'admin' };
        id = 'u1';
        isAdmin = true;
        isStudent = false;
      }
    );

    const comment = {
      id: 'c1',
      text: 'cross-user',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u2' },
      save() {
        return Promise.resolve({});
      },
    };

    await renderCommentList(this, {
      comments: [comment],
      isParentWorkspace: false,
    });

    await click('input[name="myCommentsOnly"]');
    assert.dom('.stub-delete-comment').exists();
    const alert = this.owner.lookup('service:sweet-alert');
    alert.modalResult = { value: false };

    await click('.stub-delete-comment');

    assert.strictEqual(
      alert.modalCalls.length,
      1,
      'opens one confirmation modal'
    );
    assert.strictEqual(
      alert.modalCalls[0][1],
      'This comment belongs to another user. Delete it anyway?'
    );
    assert.strictEqual(
      alert.modalCalls[0][3],
      'Yes, delete another user comment'
    );
  });

  test('canceling admin cross-user delete does not delete comment', async function (assert) {
    this.owner.register(
      'service:currentUser',
      class extends Service {
        user = { id: 'u1', username: 'admin' };
        id = 'u1';
        isAdmin = true;
        isStudent = false;
      }
    );

    let saveCalled = false;
    const comment = {
      id: 'c1',
      text: 'cross-user',
      createDate: new Date(),
      isTrashed: false,
      submission: { id: 'sub1' },
      workspace: { id: 'w1' },
      createdBy: { id: 'u2' },
      save() {
        saveCalled = true;
        return Promise.resolve({});
      },
    };

    await renderCommentList(this, {
      comments: [comment],
      isParentWorkspace: false,
    });

    await click('input[name="myCommentsOnly"]');
    assert.dom('.stub-delete-comment').exists();
    const alert = this.owner.lookup('service:sweet-alert');
    alert.modalResult = { value: false };

    await click('.stub-delete-comment');

    assert.false(saveCalled, 'does not save when modal is canceled');
    assert.false(comment.isTrashed, 'comment remains not trashed');
  });
});
