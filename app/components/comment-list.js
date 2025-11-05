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
  @tracked scrollBottom = true;
  @tracked sinceDate;
  @tracked searchResults = [];
  @tracked commentsMetadata = null;
  @tracked doUseSinceDate = false;
  @tracked invalidDateError = null;
  @tracked isLoadingSearchResults = false;
  @tracked doShowLoadingMessage = false;

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
    const doFilter = this.thisSubmissionOnly || this.thisWorkspaceOnly;

    if (doFilter) {
      return this._getFilteredAndSortedComments();
    }
    return this._getSelectionComments();
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
    if (this._isSearchMode) {
      return this._getSearchResultsDescription();
    }
    return this._getFilterResultsDescription();
  }

  get showResultsDescription() {
    return !this.doShowLoadingMessage && this.displayList.length > 0;
  }

  get isSinceDateValid() {
    return this.validateDateString(this.sinceDate);
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

  validateDateString(input) {
    if (typeof input !== 'string' || input.length === 0) return false;

    const split = input.split('/');
    if (split.length !== 3) return false;

    const [month, day, year] = split.map((num) => parseInt(num, 10));

    if (Number.isNaN(month) || month > 12 || month < 1) return false;
    if (Number.isNaN(day) || day < 1 || day > 31) return false;
    if (Number.isNaN(year) || year < 1000 || year > 9999) return false;

    return true;
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

  showToast(
    type,
    message,
    duration = 2000,
    showButton = false,
    buttonText = null
  ) {
    return this.alert.showToast(
      type,
      message,
      'bottom-end',
      duration,
      showButton,
      buttonText
    );
  }

  async updateCommentRelationships(record, selection, submission, parent) {
    const selectionComments = await selection.comments;
    selectionComments.addObject(record);

    const submissionComments = await submission.comments;
    submissionComments.addObject(record);

    if (parent) {
      const parentChildren = await parent.children;
      parentChildren.addObject(record);
    }
  }

  buildSearchOptions(query, page) {
    const options = {
      text: query || '',
      page: page || 1,
    };

    if (this.myCommentsOnly) {
      options.createdBy = this.currentUser.id;
    }

    if (this.doUseSinceDate) {
      options.sinceDate = this.sinceDate;
    }

    return options;
  }

  _matchesOwnerFilter(comment) {
    if (!this.myCommentsOnly) return true;
    const creatorId = this.utils.getBelongsToId(comment, 'createdBy');
    return creatorId === this.currentUser.id;
  }

  _matchesSubmissionFilter(comment) {
    if (!this.thisSubmissionOnly) return true;
    const subId = this.utils.getBelongsToId(comment, 'submission');
    return subId === this.args.currentSubmission?.id;
  }

  _matchesWorkspaceFilter(comment) {
    if (!this.thisWorkspaceOnly) return true;
    const workspaceId = this.utils.getBelongsToId(comment, 'workspace');
    return workspaceId === this.args.currentWorkspace?.id;
  }

  _matchesSearchQuery(comment) {
    if (!this.commentFilterText) return true;
    return (
      comment.label?.includes(this.commentFilterText) ||
      comment.text?.includes(this.commentFilterText)
    );
  }

  _sortByDateDescending(comments) {
    return comments.sort(
      (a, b) => new Date(b.createDate) - new Date(a.createDate)
    );
  }

  _getFilteredAndSortedComments() {
    const filtered = this.args.comments.filter((comment) => {
      return (
        this._matchesWorkspaceFilter(comment) &&
        this._matchesOwnerFilter(comment) &&
        this._matchesSubmissionFilter(comment) &&
        this._matchesSearchQuery(comment)
      );
    });
    return this._sortByDateDescending(filtered);
  }

  _getSelectionComments() {
    const currentSelectionComments = this.store
      .peekAll('comment')
      .filter((comment) => {
        const selId = this.utils.getBelongsToId(comment, 'selection');
        return selId === this.args.currentSelection?.id;
      });
    return [...this.searchResults, ...currentSelectionComments];
  }

  _buildCommentData() {
    return {
      text: this.newComment,
      label: this.newCommentLabel,
      selection: this.args.currentSelection,
      submission: this.args.currentSubmission,
      workspace: this.args.currentWorkspace,
      parent: this.newCommentParent,
      useForResponse: !!this.labels[this.newCommentLabel].useForResponse,
      createdBy: this.currentUser.user,
    };
  }

  async _handleCommentCreated(record) {
    this.showToast('success', 'Comment Created');

    await this.updateCommentRelationships(
      record,
      this.args.currentSelection,
      this.args.currentSubmission,
      this.newCommentParent
    );

    this.newComment = '';
    this.clearCommentParent();
    this.args.comments.pushObject(record);
  }

  _startLoadingSearch() {
    this.loading.handleLoadingMessage(
      this,
      'start',
      'isLoadingSearchResults',
      'doShowLoadingMessage'
    );
  }

  _endLoadingSearch() {
    this.loading.handleLoadingMessage(
      this,
      'end',
      'isLoadingSearchResults',
      'doShowLoadingMessage'
    );
  }

  get _isSearchMode() {
    return (
      !this.thisWorkspaceOnly &&
      !this.thisSubmissionOnly &&
      this.commentsMetadata
    );
  }

  _getSearchResultsDescription() {
    const { total } = this.commentsMetadata;
    const resultsModifier = total > 1 ? 'comments' : 'comment';
    let base = `Found ${total} ${resultsModifier}`;

    if (this.myCommentsOnly) base += ' created by you';
    if (this.commentFilterText) base += ` for "${this.commentFilterText}"`;

    return base;
  }

  _getFilterResultsDescription() {
    let base = 'Displaying';
    if (this.myCommentsOnly) base += ' only your';

    if (this.thisSubmissionOnly)
      return base + ` comments for current submission`;
    if (this.thisWorkspaceOnly) return base + ` comments for current workspace`;

    return base;
  }

  async _handleCommentDeletion(comment) {
    await comment.submission;
    comment.isTrashed = true;

    try {
      await comment.save();
      await this._handleUndoOption(comment);
    } catch (err) {
      this.errorHandling.handleErrors(err, 'updateRecordErrors');
    }
  }

  async _handleUndoOption(comment) {
    const undoResult = await this.showToast(
      'success',
      'Comment Deleted',
      3000,
      true,
      'Undo'
    );

    if (undoResult.value) {
      comment.isTrashed = false;
      await comment.save();
      this.showToast('success', 'Comment Restored');
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
      this.showToast('error', 'Please choose a selection first', 3000);
    }
  }

  @action
  async createComment() {
    if (!this.newComment?.trim()) return;

    const commentData = this._buildCommentData();
    const comment = this.store.createRecord('comment', commentData);

    if (this.textContainsTag) {
      this.args.tagSelection?.(this.args.currentSelection, this.tags);
    }

    try {
      const record = await comment.save();
      await this._handleCommentCreated(record);
    } catch (err) {
      this.errorHandling.handleErrors(err, 'createRecordErrors');
    }
  }

  @action
  async deleteComment(comment) {
    const confirmed = await this.alert.showModal(
      'warning',
      'Are you sure you want to delete this comment?',
      null,
      'Yes, delete it'
    );

    if (confirmed.value) {
      await this._handleCommentDeletion(comment);
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
    this._startLoadingSearch();

    if (this.doUseSinceDate && !this.validateDateString(this.sinceDate)) {
      this.invalidDateError = 'Please enter a valid date';
      return;
    }

    const options = this.buildSearchOptions(query, page);

    try {
      const comments = await this.store.query('comment', options);
      this.searchResults = comments.slice();
      this.commentsMetadata = comments.meta;
    } catch (err) {
      this.errorHandling.handleErrors(err, 'queryErrors');
    } finally {
      this._endLoadingSearch();
    }
  }

  @action
  initiatePageChange(page) {
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
