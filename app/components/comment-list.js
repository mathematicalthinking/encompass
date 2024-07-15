// Import necessary dependencies
import Component from '@glimmer/component';
import { tracked } from '@ember/object';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
import { isArray, random } from 'lodash';

export default class CommentsComponent extends Component {
  // Injecting services
  @service currentUser;
  @service('sweetAlert') alert;
  @service('utility-methods') utils;
  @service loading;
  @service errorHandling;
  @service permissions;

  // Component properties
  elementId = 'comment-list';
  classNames = ['workspace-flex-item', 'comments'];

  classNameBindings = [
    'canComment:can-comment',
    'isHidden:hidden',
    'onSelection:on-selection',
    'isBipaneled:bi-paneled',
    'isTripaneled:tri-paneled',
  ];

  // Default state properties
  thisSubmissionOnly = true;
  thisWorkspaceOnly = true;
  commentFilterText = '';
  filterComments = false;
  newComment = '';
  newCommentLabel = 'notice';
  newCommentParent = null;
  queryErrors = [];
  createRecordErrors = [];
  uploadRecordErrors = [];
  showFilter = true;
  scrollBottom = true;

  // Labels definition
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

  // tracked properties using decorators
  @tracked('containerLayoutClass', 'hsc') isBipaneled;
  @tracked('containerLayoutClass', 'fsc') isTripaneled;
  @tracked('canComment', 'onSelection') showComposeButtons;

  // Initial setup in the constructor
  constructor() {
    super(...arguments);

    let oneYearAgo = moment().subtract(365, 'days').calendar();
    let oneYearAgoDate = new Date(oneYearAgo);
    let htmlDate = moment(oneYearAgoDate).format('L');

    this.sinceDate = htmlDate;
  }

  // Lifecycle hook: didInsertElement
  didInsertElement() {
    $(window).on('resize.commentScroll', () => {
      this.$('.scroll-icon:visible').hide();
    });

    super.didInsertElement(...arguments);
  }

  // Lifecycle hook: willDestroyElement
  willDestroyElement() {
    $(window).off('resize.commentScroll');
    super.willDestroyElement(...arguments);
  }

  // tracked property: newCommentPlaceholder
  @tracked('newCommentLabel', 'labels')
  get newCommentPlaceholder() {
    let newCommentLabel = this.newCommentLabel;
    let path = `labels.${newCommentLabel}.placeholder`;
    let placeholder = this.get(path);

    if (isArray(placeholder)) {
      placeholder = placeholder[random(0, placeholder.length - 1)];
    }
    return placeholder;
  }

  // tracked property: filteredComments
  @tracked(
    'comments.[]',
    'thisSubmissionOnly',
    'myCommentsOnly',
    'commentFilterText',
    'currentSubmission.id',
    'thisWorkspaceOnly',
    'currentWorkspace.id',
    'searchResults.[]',
    'currentSelection'
  )
  get filteredComments() {
    let results;
    let isOwnOnly = !this.isParentWorkspace;
    let isSubOnly = this.thisSubmissionOnly;
    let isWsOnly = this.thisWorkspaceOnly;

    let isSearchQuery = this.commentFilterText.length > 0;

    let doFilter = isSubOnly || isWsOnly;
    if (doFilter) {
      results = this.comments.filter((comment) => {
        let creatorId = this.utils.getBelongsToId(comment, 'createdBy');
        let isYours = creatorId === this.currentUser.user.id;

        let subId = this.utils.getBelongsToId(comment, 'submission');
        let doesBelongToSub = subId === this.currentSubmission.id;

        let workspaceId = this.utils.getBelongsToId(comment, 'workspace');
        let doesBelongToWs = workspaceId === this.currentWorkspace.id;

        if (isWsOnly && !doesBelongToWs) {
          return false;
        }
        if (isOwnOnly && !isYours) {
          return false;
        }
        if (isSubOnly && !doesBelongToSub) {
          return false;
        }

        if (isSearchQuery) {
          let text = this.commentFilterText;
          return (
            comment.get('label').includes(text) ||
            comment.get('text').includes(text)
          );
        }
        return true;
      });
    } else {
      // check store to see if comments related to current selection are available
      let currentSelectionComments = this.store
        .peekAll('comment')
        .filter((comment) => {
          let selId = this.utils.getBelongsToId(comment, 'selection');
          return selId === this.currentSelection.id;
        });

      let searchResults = this.searchResults || [];

      results = searchResults.concat(currentSelectionComments);
    }

    return results.sortBy('createDate').reverse();
  }

  // tracked property: displayList
  @tracked('filteredComments.@each.isTrashed')
  get displayList() {
    return this.filteredComments.rejectBy('isTrashed');
  }

  // Action method: clearCommentParent
  clearCommentParent() {
    if (this.newCommentParent) {
      this.newCommentParent.set('inReuse', false);
      this.set('newCommentParent', null);
    }
  }

  // tracked property: textContainsTag
  @tracked('tags.length')
  get textContainsTag() {
    return this.tags.length > 0;
  }

  // tracked property: tags
  @tracked('newComment')
  get tags() {
    let text = this.newComment;
    let tags = [];
    text.split(/\s+/).forEach((word) => {
      if (word.match(/^#\S+/)) {
        tags.push(word.substring(1).toLowerCase());
      }
    });
    return tags;
  }

  // tracked property: onSelection
  @tracked('currentSelection')
  get onSelection() {
    return this.utils.isNonEmptyObject(this.currentSelection);
  }

  // tracked property: canComment
  @tracked('onSelection', 'allowedToComment')
  get canComment() {
    let ws = this.currentWorkspace;
    return this.permissions.canEdit(ws, 'comments', 2);
  }

  // tracked property: toggleDisplayText
  @tracked('isHidden')
  get toggleDisplayText() {
    return this.isHidden ? 'Show Comments' : 'Hide Comments';
  }

  // tracked property: filterOptions
  @tracked('isParentWorkspace')
  get filterOptions() {
    return {
      thisWorkspaceOnly: {
        label: 'This Workspace Only',
        relatedProp: 'thisWorkspaceOnly',
        isChecked: true,
        isDisabled: this.isParentWorkspace,
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
        isChecked: !this.isParentWorkspace,
        isDisabled: false,
      },
    };
  }

  // tracked property: emptyResultsMessage
  @tracked('commentFilterText')
  get emptyResultsMessage() {
    return this.commentFilterText
      ? `No results found for "${this.commentFilterText}" `
      : 'No comments to display';
  }

  // tracked property: resultsDescription
  @tracked(
    'commentFilterText',
    'thisWorkspaceOnly',
    'thisSubmissionOnly',
    'myCommentsOnly',
    'commentsMetadata'
  )
  get resultsDescription() {
    let query = this.commentFilterText;
    let displayCount = this.displayList.length;

    let resultsModifier = displayCount > 1 ? 'comments' : 'comment';

    let isWsOnly = this.thisWorkspaceOnly;
    let isSubOnly = this.thisSubmissionOnly;

    if (!isWsOnly && !isSubOnly && this.commentsMetadata) {
      let { total } = this.commentsMetadata;
      let base = `Found ${total} ${resultsModifier}`;

      if (this.myCommentsOnly) {
        base += ' created by you';
      }

      if (query) {
        base += ` for "${query}"`;
      }
      return base;
    }

    let base = 'Displaying';

    if (this.myCommentsOnly) {
      base += ' only your';
    }

    if (this.thisSubmissionOnly) {
      return base + ` comments for current submission`;
    }

    if (this.thisWorkspaceOnly) {
      return base + ` comments for current workspace`;
    }
  }

  // tracked property: showResultsDescription
  @tracked('displayList.length', 'doShowLoadingMessage')
  get showResultsDescription() {
    return !this.doShowLoadingMessage && this.displayList.length > 0;
  }

  // tracked property: noCommentsToShow
  @tracked('commentsMetadata.total', 'displayList.length')
  get noCommentsToShow() {
    return this.commentsMetadata.total === 0 && this.displayList.length === 0;
  }

  // Action method: clearFilters
  clearFilters() {
    this.set('commentFilterText', '');
  }

  // Action method: displayResults
  displayResults(searchValue) {
    this.set('commentFilterText', searchValue);
  }

  // Action method: onSearchUpdate
  onSearchUpdate(event) {
    let value = event.target.value;
    this.displayResults(value);
  }

  // Action method: onClickAddComment
  onClickAddComment(commentData) {
    this.createNewComment(commentData);
  }

  // Action method: updateComment
  updateComment(comment, editorState) {
    comment.set('content', editorState.getCurrentContent());
    this.loading.set('changing', true);

    return this.updateRecord(comment).catch((e) => {
      this.errorHandling.handle(e, 'update');
    });
  }

  // Action method: cancelSearch
  cancelSearch() {
    this.displayResults('');
  }

  // Action method: applyFilters
  applyFilters(value) {
    this.set('commentFilterText', value);
    this.set('filterComments', true);
  }

  // Action method: toggleComment
  toggleComment() {
    this.toggleProperty('isHidden');
  }

  // Action method: toggleListDisplay
  toggleListDisplay() {
    this.toggleProperty('isHidden');
  }

  // Action method: selectChange
  selectChange(action) {
    this.set('newCommentLabel', action);
  }

  // Action method: showComposePanel
  showComposePanel() {
    this.set('showFilter', true);
  }

  // Action method: hideComposePanel
  hideComposePanel() {
    this.set('showFilter', false);
  }

  // Action method: isBipaneled
  isBipaneled(action) {
    this.set('containerLayoutClass', action);
  }

  // Action method: isTripaneled
  isTripaneled(action) {
    this.set('containerLayoutClass', action);
  }

  // Action method: scrollToBottom
  scrollToBottom() {
    this.set('scrollBottom', true);
  }

  // Action method: onError
  onError() {
    this.set('error', null);
  }

  // Action method: onSuccess
  onSuccess() {
    this.set('success', null);
  }

  // Action method: didInsertElement
  didInsertElement() {
    $(window).on('resize.commentScroll', () => {
      this.$('.scroll-icon:visible').hide();
    });

    super.didInsertElement(...arguments);
  }

  // Action method: willDestroyElement
  willDestroyElement() {
    $(window).off('resize.commentScroll');
    super.willDestroyElement(...arguments);
  }
}
