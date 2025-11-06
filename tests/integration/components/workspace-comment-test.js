import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | workspace-comment', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    class UtilityMethodsService extends Service {
      getBelongsToId(record, key) {
        return record[key]?.id;
      }
      getHasManyIds(record, key) {
        return record[key] || [];
      }
    }

    class WorkspacePermissionsService extends Service {
      canEdit() {
        return true;
      }
    }

    class CurrentUserService extends Service {
      user = { id: 'u1', username: 'testuser' };
    }

    this.owner.register('service:utility-methods', UtilityMethodsService);
    this.owner.register(
      'service:workspace-permissions',
      WorkspacePermissionsService
    );
    this.owner.register('service:current-user', CurrentUserService);
  });

  function createComment(overrides = {}) {
    return {
      id: 'c1',
      text: 'Test comment text',
      label: 'notice',
      relevance: 'high',
      inReuse: false,
      selection: { id: 's1', link: 'http://example.com' },
      workspace: { id: 'w1', name: 'Test Workspace' },
      createdBy: { id: 'u1', username: 'testuser' },
      children: [],
      ...overrides,
    };
  }

  async function renderWorkspaceComment(context, props = {}) {
    const {
      comment = createComment(),
      currentWorkspace = { id: 'w1' },
      currentSelection = { id: 's1' },
      isParentWorkspace = false,
    } = props;

    context.setProperties({
      comment,
      currentWorkspace,
      currentSelection,
      isParentWorkspace,
      deleteComment: props.deleteComment || (() => {}),
      reuseComment: props.reuseComment || (() => {}),
    });

    await render(hbs`<WorkspaceComment
      @comment={{this.comment}}
      @currentWorkspace={{this.currentWorkspace}}
      @currentSelection={{this.currentSelection}}
      @isParentWorkspace={{this.isParentWorkspace}}
      @deleteComment={{this.deleteComment}}
      @reuseComment={{this.reuseComment}}
    />`);
  }

  // --- Basic Rendering ---
  test('renders comment with basic structure', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('li.ws-comment-comp').exists();
    assert.dom('.comment-flex-item.text').exists();
    assert.dom('.comment-flex-item.actions').exists();
  });

  test('displays comment text', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('.comment-text').hasText('Test comment text');
  });

  test('displays creator username', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('.creator').hasText('testuser');
  });

  test('displays workspace name', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('.workspace').hasText('Test Workspace');
  });

  // --- CSS Classes ---
  test('adds label class to li element', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ label: 'wonder' }),
    });
    assert.dom('li').hasClass('wonder');
  });

  test('adds relevance class to li element', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ relevance: 'high' }),
    });
    assert.dom('li').hasClass('relevance-high');
  });

  test('adds inReuse class when comment is in reuse', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ inReuse: true }),
    });
    assert.dom('li').hasClass('inReuse');
  });

  test('adds is-for-cs class when comment is from current selection', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ selection: { id: 's1' } }),
      currentSelection: { id: 's1' },
    });
    assert.dom('li').hasClass('is-for-cs');
  });

  // --- Permissions ---
  test('shows delete button when user can delete', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('.delete_button').exists();
  });

  test('hides delete button when user cannot delete', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit() {
          return false;
        }
      }
    );
    await renderWorkspaceComment(this);
    assert.dom('.delete_button').doesNotExist();
  });

  test('shows reuse button when user can comment', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('a[title="reuse this comment"]').exists();
  });

  test('hides reuse button when user cannot comment', async function (assert) {
    this.owner.register(
      'service:workspace-permissions',
      class extends Service {
        canEdit(ws, type, level) {
          return level !== 2;
        }
      }
    );
    await renderWorkspaceComment(this);
    assert.dom('a[title="reuse this comment"]').doesNotExist();
  });

  test('displays children count when comment has children', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ children: [{ id: 'c2' }, { id: 'c3' }] }),
    });
    assert.dom('a[title="reuse this comment"]').hasText('2');
  });

  test('displays plus icon when comment has no children', async function (assert) {
    await renderWorkspaceComment(this);
    assert.dom('a[title="reuse this comment"] .fa-plus').exists();
  });

  // --- Actions ---
  test('calls deleteComment action when delete button clicked', async function (assert) {
    let deletedComment = null;
    await renderWorkspaceComment(this, {
      deleteComment: (comment) => {
        deletedComment = comment;
      },
    });
    await click('.delete_button');
    assert.strictEqual(deletedComment.id, 'c1');
  });

  test('calls reuseComment action when reuse button clicked', async function (assert) {
    let reusedComment = null;
    await renderWorkspaceComment(this, {
      reuseComment: (comment) => {
        reusedComment = comment;
      },
    });
    await click('a[title="reuse this comment"]');
    assert.strictEqual(reusedComment.id, 'c1');
  });

  // --- Parent Workspace Mode ---
  test('displays original comment info in parent workspace', async function (assert) {
    const comment = createComment({
      originalComment: {
        createdBy: { username: 'originaluser' },
        workspace: { name: 'Original Workspace' },
      },
    });
    await renderWorkspaceComment(this, { comment, isParentWorkspace: true });
    assert.dom('.creator').hasText('originaluser');
    assert.dom('.workspace').hasText('Original Workspace');
  });

  test('renders external link when not for current workspace', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ workspace: { id: 'w2' } }),
      currentWorkspace: { id: 'w1' },
    });
    assert.dom('a.newWindow').exists();
    assert.dom('a.newWindow').hasAttribute('target', '_blank');
  });

  // --- Group Workspace Selection Matching ---
  test('handles missing selection', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ selection: null }),
    });
    assert.dom('li.ws-comment-comp').exists();
  });

  test('handles group workspace with original selection', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ selection: { id: 's2' } }),
      currentSelection: {
        id: 's1',
        originalSelection: { id: 's2' },
      },
      currentWorkspace: { id: 'w1', workspaceType: 'group' },
    });
    assert.dom('li').hasClass('is-for-cs');
  });

  test('does not add is-for-cs class in parent workspace when selections do not match', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ selection: { id: 's2' } }),
      currentSelection: { id: 's1' },
      currentWorkspace: { id: 'w1', workspaceType: 'parent' },
    });
    assert.dom('li').doesNotHaveClass('is-for-cs');
  });

  // --- Edge Cases ---
  test('handles missing workspace gracefully', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ workspace: null }),
    });
    assert.dom('li.ws-comment-comp').exists();
  });

  test('handles missing createdBy gracefully', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ createdBy: null }),
    });
    assert.dom('li.ws-comment-comp').exists();
  });

  test('renders with empty relevance', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ relevance: '' }),
    });
    assert.dom('li').hasClass('relevance-');
  });

  test('renders LinkTo when comment is for current workspace', async function (assert) {
    await renderWorkspaceComment(this, {
      comment: createComment({ workspace: { id: 'w1' } }),
      currentWorkspace: { id: 'w1' },
    });
    assert.dom('a.comment-text').exists();
  });
});
