import Component from '@glimmer/component';
/**
 * Passed in by template:
 * - comments
 * - currentWorkspace
 * - currentUser
 * - currentSubmission
 * - currentSelection
 * - store
 *
 *   TODO:
 *   - Test the hashtag stuff to see if that is still working.
 */
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CommentListComponent extends Component {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service('loading-display') loading;
  @service('workspace-permissions') permissions;
  @service currentUser;
  @service store;
  @service errorHandling;

  @tracked thisSubmissionOnly = true;
  @tracked thisWorkspaceOnly = true;
  @tracked commentFilterText = '';
  @tracked newComment = '';
  @tracked newCommentLabel = 'notice';
  @tracked newCommentParent = null;
  @tracked showFilter = true;
  @tracked scrollBottom = true;
  @tracked sinceDate;
  @tracked isSearching = false;
  @tracked searchResults = [];
  @tracked commentsMetadata = null;
  @tracked doUseSinceDate = false;
  @tracked invalidDateError = null;
  @tracked isLoadingSearchResults = false;
  @tracked doShowLoadingMessage = false;
  @tracked isChangingPage = false;

  labels = {
    notice: {
      placeholder: 'I notice...',
    },
    wonder: {
      placeholder: 'I wonder...',
    },
    feedback: {
      placeholder: [
        'Interesting...',
        'Did you try...',
        'What about...',
        'I am interested in...',
        'I would like...',
        'Seems promising...',
        'What if...',
        'How do you know...',
        'Can you say more...',
      ],
      useForResponse: true,
    },
  };

  labelOptions = ['notice', 'wonder', 'feedback'];

  constructor() {
    super(...arguments);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    this.sinceDate = this.formatDate(oneYearAgo);
  }

  get createRecordErrors() {
    return this.errorHandling.getErrors('createRecordErrors');
  }

  get queryErrors() {
    return this.errorHandling.getErrors('queryErrors');
  }

  get updateRecordErrors() {
    return this.errorHandling.getErrors('updateRecordErrors');
  }

  get isBipaneled() {
    return this.args.containerLayoutClass === 'hsc';
  }

  get isTripaneled() {
    return this.args.containerLayoutClass === 'fsc';
  }

  get showComposeButtons() {
    return this.canComment && this.onSelection;
  }

  get myCommentsOnly() {
    return !this.args.isParentWorkspace;
  }

  get newCommentPlaceholder() {
    const placeholder = this.labels[this.newCommentLabel].placeholder;
    if (Array.isArray(placeholder)) {
      return placeholder[Math.floor(Math.random() * placeholder.length)];
    }
    return placeholder;
  }

  get filteredComments() {
    const isOwnOnly = this.myCommentsOnly;
    const isSubOnly = this.thisSubmissionOnly;
    const isWsOnly = this.thisWorkspaceOnly;
    const isSearchQuery = this.commentFilterText.length > 0;
    const doFilter = isSubOnly || isWsOnly;

    if (doFilter) {
      const results = this.args.comments.filter((comment) => {
        const creatorId = this.utils.getBelongsToId(comment, 'createdBy');
        const isYours = creatorId === this.currentUser.id;
        const subId = this.utils.getBelongsToId(comment, 'submission');
        const doesBelongToSub = subId === this.args.currentSubmission?.id;
        const workspaceId = this.utils.getBelongsToId(comment, 'workspace');
        const doesBelongToWs = workspaceId === this.args.currentWorkspace?.id;

        if (isWsOnly && !doesBelongToWs) return false;
        if (isOwnOnly && !isYours) return false;
        if (isSubOnly && !doesBelongToSub) return false;

        if (isSearchQuery) {
          return (
            comment.label?.includes(this.commentFilterText) ||
            comment.text?.includes(this.commentFilterText)
          );
        }
        return true;
      });
      return results.sort(
        (a, b) => new Date(b.createDate) - new Date(a.createDate)
      );
    }

    const currentSelectionComments = this.store
      .peekAll('comment')
      .filter((comment) => {
        const selId = this.utils.getBelongsToId(comment, 'selection');
        return selId === this.args.currentSelection?.id;
      });
    return [...this.searchResults, ...currentSelectionComments];
  }

  get displayList() {
    return this.filteredComments.filter((c) => !c.isTrashed);
  }

  get textContainsTag() {
    return this.tags.length > 0;
  }

  get tags() {
    return this.newComment
      .split(/\s+/)
      .filter((word) => word.match(/^#\S+/))
      .map((word) => word.substring(1).toLowerCase());
  }

  get onSelection() {
    return this.utils.isNonEmptyObject(this.args.currentSelection);
  }

  get canComment() {
    return this.permissions.canEdit(this.args.currentWorkspace, 'comments', 2);
  }

  get toggleDisplayText() {
    return this.args.isHidden ? 'Show Comments' : 'Hide Comments';
  }

  get filterOptions() {
    return {
      thisWorkspaceOnly: {
        label: 'This Workspace Only',
        relatedProp: 'thisWorkspaceOnly',
        isChecked: true,
        isDisabled: this.args.isParentWorkspace,
      },
      thisSubmissionOnly: {
        label: 'This Submission Only',
        relatedProp: 'thisSubmissionOnly',
        isChecked: true,
        isDisabled: false,
      },
      myCommentsOnly: {
        label: 'My Comments Only',
        relatedProp: 'myCommentsOnly',
        isChecked: !this.args.isParentWorkspace,
        isDisabled: false,
      },
    };
  }

  get emptyResultsMessage() {
    return this.commentFilterText
      ? `No results found for "${this.commentFilterText}"`
      : 'No comments to display';
  }

  get resultsDescription() {
    const query = this.commentFilterText;
    const displayCount = this.displayList.length;
    const resultsModifier = displayCount > 1 ? 'comments' : 'comment';
    const isWsOnly = this.thisWorkspaceOnly;
    const isSubOnly = this.thisSubmissionOnly;

    if (!isWsOnly && !isSubOnly && this.commentsMetadata) {
      const { total } = this.commentsMetadata;
      let base = `Found ${total} ${resultsModifier}`;
      if (this.myCommentsOnly) base += ' created by you';
      if (query) base += ` for "${query}"`;
      return base;
    }

    let base = 'Displaying';
    if (this.myCommentsOnly) base += ' only your';
    if (this.thisSubmissionOnly)
      return base + ` comments for current submission`;
    if (this.thisWorkspaceOnly) return base + ` comments for current workspace`;
    return base;
  }

  get showResultsDescription() {
    return !this.doShowLoadingMessage && this.displayList.length > 0;
  }

  get isSinceDateValid() {
    const input = this.sinceDate;
    if (typeof input !== 'string' || input.length === 0) return false;

    const split = input.split('/');
    if (split.length !== 3) return false;

    const monthInt = parseInt(split[0], 10);
    if (Number.isNaN(monthInt) || monthInt > 12 || monthInt < 1) return false;

    const dayInt = parseInt(split[1], 10);
    if (Number.isNaN(dayInt) || dayInt < 1 || dayInt > 31) return false;

    const yearInt = parseInt(split[2], 10);
    if (Number.isNaN(yearInt) || yearInt < 1000 || yearInt > 9999) return false;

    return true;
  }

  get showApplyDate() {
    return this.doUseSinceDate && this.isSinceDateValid;
  }

  get sortedDisplayList() {
    return [...this.displayList].sort((a, b) => {
      const currentSelectionId = this.args.currentSelection?.id;
      const aSelectionId = this.utils.getBelongsToId(a, 'selection');
      const bSelectionId = this.utils.getBelongsToId(b, 'selection');
      const isAForCurrentSelection = aSelectionId === currentSelectionId;
      const isBForCurrentSelection = bSelectionId === currentSelectionId;

      if (isAForCurrentSelection && !isBForCurrentSelection) return -1;
      if (isBForCurrentSelection && !isAForCurrentSelection) return 1;
      return 0;
    });
  }

  get showPaginationControl() {
    return !this.thisWorkspaceOnly && !this.thisSubmissionOnly;
  }

  formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  clearCommentParent() {
    if (this.newCommentParent) {
      this.newCommentParent.inReuse = false;
      this.newCommentParent = null;
    }
  }

  @action
  cancelComment() {
    this.clearCommentParent();
    this.newComment = '';
    this.args.resetComment?.();
  }

  @action
  madeSelection() {
    if (this.onSelection) {
      this.createComment();
    } else {
      this.alert.showToast(
        'error',
        'Please choose a selection first',
        'bottom-end',
        3000,
        false,
        null
      );
    }
  }

  @action
  async createComment() {
    const currentUser = this.currentUser;
    const label = this.newCommentLabel;
    const text = this.newComment;
    const useForResponse = this.labels[label].useForResponse;

    if (!text?.trim()) return;

    const selection = this.args.currentSelection;
    const currentSubmission = this.args.currentSubmission;

    const data = {
      text,
      label,
      selection,
      submission: currentSubmission,
      workspace: this.args.currentWorkspace,
      parent: this.newCommentParent,
      useForResponse: !!useForResponse,
      createdBy: this.currentUser.user, // actual db record so this.currentUser won't work
    };

    const comment = this.store.createRecord('comment', data);

    if (this.textContainsTag) {
      this.args.tagSelection?.(selection, this.tags);
    }

    const newCommentParent = this.newCommentParent;

    try {
      const record = await comment.save();
      this.alert.showToast(
        'success',
        'Comment Created',
        'bottom-end',
        2000,
        false,
        null
      );

      const selectionComments = await selection.comments;
      selectionComments.addObject(record);

      const submissionComments = await currentSubmission.comments;
      submissionComments.addObject(record);

      if (newCommentParent) {
        const parentChildren = await newCommentParent.children;
        parentChildren.addObject(record);
      }

      this.newComment = '';
      this.clearCommentParent();
      this.args.comments.pushObject(record);
    } catch (err) {
      this.errorHandling.handleErrors(err, 'createRecordErrors');
    }
  }

  @action
  async deleteComment(comment) {
    const result = await this.alert.showModal(
      'warning',
      'Are you sure you want to delete this comment?',
      null,
      'Yes, delete it'
    );

    if (result.value) {
      await comment.submission;
      comment.isTrashed = true;

      try {
        await comment.save();
        const undoResult = await this.alert.showToast(
          'success',
          'Comment Deleted',
          'bottom-end',
          3000,
          true,
          'Undo'
        );

        if (undoResult.value) {
          comment.isTrashed = false;
          await comment.save();
          this.alert.showToast(
            'success',
            'Comment Restored',
            'bottom-end',
            2000,
            false,
            null
          );
        }
      } catch (err) {
        this.errorHandling.handleErrors(err, 'updateRecordErrors');
      }
    }
  }

  @action
  reuseComment(comment) {
    this.newComment = this.newComment + ' ' + comment.text;
    this.newCommentLabel = comment.label;
    this.clearCommentParent();
    this.newCommentParent = comment;
    comment.inReuse = true;
    document.getElementById('commentTextarea')?.focus();
  }

  @action
  setCommentLabel(label) {
    this.newCommentLabel = label;
  }

  @action
  toggleFilter() {
    this.showFilter = !this.showFilter;
    if (this.showFilter && this.isSearching) {
      this.isSearching = false;
    }
  }

  @action
  toggleSearch() {
    this.isSearching = !this.isSearching;
    if (this.isSearching && this.showFilter) {
      this.showFilter = false;
    }
  }

  @action
  hideComments() {
    this.args.hideComments?.();
  }

  @action
  updateFilter(prop) {
    this[prop] = !this[prop];
    this.searchComments();
  }

  @action
  async searchComments(query, page) {
    if (this.thisSubmissionOnly || this.thisWorkspaceOnly) return;

    this.cancelComment();
    this.loading.handleLoadingMessage(
      this,
      'start',
      'isLoadingSearchResults',
      'doShowLoadingMessage'
    );

    const options = {
      text: query || '',
      page: page || 1,
    };

    if (this.myCommentsOnly) {
      options.createdBy = this.currentUser.id;
    }

    if (this.doUseSinceDate) {
      const parsedDate = Date.parse(this.sinceDate);
      if (Number.isNaN(parsedDate)) {
        this.invalidDateError = 'Please enter a valid date';
        return;
      }
      options.sinceDate = this.sinceDate;
    }

    try {
      const comments = await this.store.query('comment', options);
      this.searchResults = comments.slice();
      this.commentsMetadata = comments.meta;
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isLoadingSearchResults',
        'doShowLoadingMessage'
      );
    } catch (err) {
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isLoadingSearchResults',
        'doShowLoadingMessage'
      );
      this.errorHandling.handleErrors(err, 'queryErrors');
    }
  }

  @action
  initiatePageChange(page) {
    this.isChangingPage = true;
    this.searchComments(this.commentFilterText, page);
  }

  @action
  applySinceDate() {
    this.searchComments(this.commentFilterText);
  }

  @action
  superScroll() {
    const displayList = document.querySelector('.display-list');
    if (!displayList) return;

    const maxScroll = displayList.scrollHeight;
    const targetScroll = this.scrollBottom ? maxScroll : 0;

    displayList.scrollTo({ top: targetScroll, behavior: 'smooth' });
    this.scrollBottom = !this.scrollBottom;
  }

  @action
  clearSearchResults() {
    this.searchComments();
  }
}
