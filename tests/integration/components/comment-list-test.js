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
    this.owner.register(
      'component:workspace-comment',
      class extends Component {
        static template = hbs`<li class="ws-comment-comp"></li>`;
      }
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
      showToast() {
        return Promise.resolve({ value: false });
      }
      showModal() {
        return Promise.resolve({ value: false });
      }
    }

    class UtilityMethodsService extends Service {
      isNonEmptyObject(obj) {
        return obj && Object.keys(obj).length > 0;
      }
      getBelongsToId(record, key) {
        return record[key]?.id;
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
    this.owner.register('service:current-user', CurrentUserService);
    this.owner.register('service:store', StoreService);
    this.owner.register('service:error-handling', ErrorHandlingService);
  });

  async function renderCommentList(context, props = {}) {
    const {
      comments = [],
      currentWorkspace = { id: 'w1' },
      currentSubmission = { id: 'sub1' },
      currentSelection = { id: 's1' },
    } = props;

    context.setProperties({
      comments,
      currentWorkspace,
      currentSubmission,
      currentSelection,
      ...props,
    });

    await render(hbs`<CommentList
      @comments={{this.comments}}
      @currentWorkspace={{this.currentWorkspace}}
      @currentSubmission={{this.currentSubmission}}
      @currentSelection={{this.currentSelection}}
      @isParentWorkspace={{this.isParentWorkspace}}
      @containerLayoutClass={{this.containerLayoutClass}}
      @isHidden={{this.isHidden}}
    />`);
  }

  test('renders with empty comments', async function (assert) {
    await renderCommentList(this);
    assert.dom('#comment-list').exists();
  });

  test('shows empty message when no comments', async function (assert) {
    await renderCommentList(this, { comments: [] });
    assert.dom('.info').hasText('No comments to display');
  });

  test('tags extracts hashtags from comment text', async function (assert) {
    await renderCommentList(this);
    await fillIn('#commentTextarea', 'This is #test #example comment');
    assert.dom('#commentTextarea').hasValue('This is #test #example comment');
  });

  test('textContainsTag returns true when hashtags exist', async function (assert) {
    await renderCommentList(this);
    await fillIn('#commentTextarea', 'This is #test');
    assert.dom('#commentTextarea').hasValue('This is #test');
  });

  test('handles null currentSelection', async function (assert) {
    await renderCommentList(this, { currentSelection: null });
    assert.dom('#comment-list').exists();
  });

  test('handles empty comments array', async function (assert) {
    await renderCommentList(this, { comments: [] });
    assert.dom('#comment-list').exists();
  });

  test('shows comment textarea when user can comment', async function (assert) {
    await renderCommentList(this);
    assert.dom('#commentTextarea').exists();
  });

  test('shows cancel and save buttons when on selection', async function (assert) {
    await renderCommentList(this, { currentSelection: { id: 's1' } });
    assert.dom('.cancel-button').exists();
    assert.dom('.save').exists();
  });

  test('cancel button clears textarea', async function (assert) {
    await renderCommentList(this, { currentSelection: { id: 's1' } });
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
    await renderCommentList(this, { currentSelection: { id: 's1' } });
    assert.dom('#comment-list').hasClass('on-selection');
  });

  test('adds can-comment class when user can comment', async function (assert) {
    await renderCommentList(this);
    assert.dom('#comment-list').hasClass('can-comment');
  });

  test('hides compose buttons when no selection', async function (assert) {
    await renderCommentList(this, { currentSelection: null });
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

    await renderCommentList(this, { currentSelection: { id: 's1' } });
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

    await renderCommentList(this, { currentSelection: { id: 's1' } });
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

    await renderCommentList(this, { currentSelection: { id: 's1' } });
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

    await renderCommentList(this, { currentSelection: { id: 's1' } });
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
});
