import Component from '@ember/component';
import { computed } from '@ember/object';
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
/*global _:false */
import { and, equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'comment-list',
  alert: service('sweet-alert'),
  utils: service('utility-methods'),
  loading: service('loading-display'),

  classNames: ['workspace-flex-item', 'comments'],
  classNameBindings: [
    'canComment:can-comment',
    'isHidden:hidden',
    'onSelection:on-selection',
    'isBipaneled:bi-paneled',
    'isTripaneled:tri-paneled',
  ],

  permissions: service('workspace-permissions'),
  thisSubmissionOnly: true,
  thisWorkspaceOnly: true,
  commentFilterText: '',
  filterComments: false,
  newComment: '',
  newCommentLabel: 'notice',
  newCommentParent: null,
  queryErrors: [],
  createRecordErrors: [],
  uploadRecordErrors: [],
  showFilter: true,
  scrollBottom: true,

  labels: {
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
  },
  labelOptions: ['notice', 'wonder', 'feedback'],

  isBipaneled: equal('containerLayoutClass', 'hsc'),
  isTripaneled: equal('containerLayoutClass', 'fsc'),

  searchConstraints: {
    query: {
      length: {
        minimum: 0,
        maximum: 500,
      },
    },
  },

  showComposeButtons: and('canComment', 'onSelection'),

  myCommentsOnly: computed('isParentWorkspace', function () {
    return !this.isParentWorkspace;
  }),

  init: function () {
    this._super(...arguments);
    let oneYearAgo = moment().subtract(365, 'days').calendar();
    let oneYearAgoDate = new Date(oneYearAgo);
    let htmlDate = moment(oneYearAgoDate).format('L');

    this.set('sinceDate', htmlDate);
  },

  didInsertElement() {
    $(window).on('resize.commentScroll', function () {
      this.$('.scroll-icon:visible').hide();
    });

    this._super(...arguments);
  },

  willDestroyElement() {
    $(window).off('resize.commentScroll');
    this._super(...arguments);
  },

  newCommentPlaceholder: computed('newCommentLabel', 'labels', function () {
    let newCommentLabel = this.newCommentLabel;
    let path = `labels.${newCommentLabel}.placeholder`;
    let placeholder = this.get(path);

    if (_.isArray(placeholder)) {
      placeholder = placeholder[_.random(0, placeholder.length - 1)];
    }
    return placeholder;
  }),

  filteredComments: computed(
    'comments.[]',
    'thisSubmissionOnly',
    'myCommentsOnly',
    'commentFilterText',
    'currentSubmission.id',
    'thisWorkspaceOnly',
    'currentWorkspace.id',
    'searchResults.[]',
    'currentSelection',
    function () {
      let results;

      let isOwnOnly = this.myCommentsOnly;
      let isSubOnly = this.thisSubmissionOnly;
      let isWsOnly = this.thisWorkspaceOnly;

      let isSearchQuery = this.commentFilterText.length > 0;

      let doFilter = isSubOnly || isWsOnly;
      if (doFilter) {
        results = this.comments.filter((comment) => {
          let creatorId = this.utils.getBelongsToId(comment, 'createdBy');

          let isYours = creatorId === this.currentUser.id;

          let subId = this.utils.getBelongsToId(comment, 'submission');

          let doesBelongToSub = subId === this.currentSubmission.id;

          let workspaceId = this.utils.getBelongsToId(comment, 'workspace');

          let doesBelongToWs = workspaceId === this.currentWorkspace.id;

          if (isWsOnly) {
            if (!doesBelongToWs) {
              return false;
            }
          }

          if (isOwnOnly) {
            if (!isYours) {
              return false;
            }
          }
          if (isSubOnly) {
            if (!doesBelongToSub) {
              return false;
            }
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

        return searchResults.concat(currentSelectionComments);
      }
      return results.sortBy('createDate').reverse();
    }
  ),

  displayList: computed('filteredComments.@each.isTrashed', function () {
    return this.filteredComments.rejectBy('isTrashed');
  }),

  clearCommentParent: function () {
    if (this.newCommentParent) {
      this.set('newCommentParent.inReuse', false);
      this.set('newCommentParent', null);
    }
  },

  textContainsTag: computed('tags', function () {
    return !!this.tags.length;
  }),

  tags: computed('newComment', function () {
    var text = this.newComment;
    var tags = [];
    text.split(/\s+/).forEach(function (word) {
      if (word.match(/^#\S+/)) {
        tags.push(word.substring(1).toLowerCase());
      }
    });
    return tags;
  }),

  onSelection: computed('currentSelection', function () {
    return this.utils.isNonEmptyObject(this.currentSelection);
  }),

  canComment: computed('onSelection', 'allowedToComment', function () {
    let ws = this.currentWorkspace;
    return this.permissions.canEdit(ws, 'comments', 2);
  }),

  toggleDisplayText: computed('isHidden', function () {
    if (this.isHidden) {
      return 'Show Comments';
    }
    return 'Hide Comments';
  }),

  filterOptions: computed('isParentWorkspace', function () {
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
  }),

  emptyResultsMessage: computed('commentFilterText', function () {
    if (this.commentFilterText) {
      return `No results found for "${this.commentFilterText}" `;
    }
    return 'No comments to display';
  }),

  resultsDescription: computed(
    'commentFilterText',
    'thisWorkspaceOnly',
    'thisSubmissionOnly',
    'myCommentsOnly',
    'commentsMetadata',
    function () {
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
  ),

  showResultsDescription: computed(
    'displayList.[]',
    'doShowLoadingMessage',
    function () {
      return !this.doShowLoadingMessage && this.displayList.length > 0;
    }
  ),

  isSinceDateValid: computed('sinceDate', function () {
    let input = this.sinceDate;
    if (typeof input !== 'string' || !input.length > 0) {
      return false;
    }
    let split = input.split('/');

    if (split.length !== 3) {
      return false;
    }
    let month = split[0];
    let monthInt = parseInt(month, 10);
    if (_.isNaN(monthInt) || monthInt > 12 || monthInt < 1) {
      return false;
    }
    let day = split[1];
    let dayInt = parseInt(day, 10);

    if (_.isNaN(dayInt) || dayInt < 1 || dayInt > 31) {
      return false;
    }

    let year = split[2];
    let yearInt = parseInt(year, 10);

    if (_.isNaN(yearInt) || yearInt < 1000 || yearInt > 9999) {
      return false;
    }
    return true;
  }),

  showApplyDate: computed('isSinceDateValid', 'doUseSinceDate', function () {
    return this.doUseSinceDate && this.isSinceDateValid;
  }),

  sortedDisplayList: computed(
    'displayList.[]',
    'currentSelection',
    function () {
      return this.displayList.sort((a, b) => {
        let currentSelectionId = this.currentSelection.id;

        let aSelectionId = this.utils.getBelongsToId(a, 'selection');
        let bSelectionId = this.utils.getBelongsToId(b, 'selection');

        let isAForCurrentSelection = aSelectionId === currentSelectionId;
        let isBForCurrentSelection = bSelectionId === currentSelectionId;

        if (isAForCurrentSelection && !isBForCurrentSelection) {
          return -1;
        }
        if (isBForCurrentSelection && !isAForCurrentSelection) {
          return 1;
        }
        return 0;
      });
    }
  ),

  showPaginationControl: computed(
    'thisWorkspaceOnly',
    'thisSubmissionOnly',
    function () {
      return !this.thisWorkspaceOnly && !this.thisSubmissionOnly;
    }
  ),

  actions: {
    cancelComment: function () {
      this.clearCommentParent();
      this.set('newComment', '');
      this.sendAction('resetComment');
    },

    madeSelection: function () {
      if (this.onSelection) {
        this.send('createComment');
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
    },

    createComment: function () {
      let currentUser = this.currentUser;
      let label = this.newCommentLabel;
      let text = this.newComment;
      let useForResponse = this.labels[label].useForResponse;
      if (!text || !text.trim()) {
        return;
      }

      let selection = this.currentSelection;
      let currentSubmission = this.currentSubmission;

      let data = {
        text: text,
        label: label,
        selection: selection,
        submission: currentSubmission,
        workspace: this.currentWorkspace,
        parent: this.newCommentParent,
        useForResponse: !!useForResponse,
        createdBy: currentUser,
      };
      let comment = this.store.createRecord('comment', data);

      //TODO push comment onto origin's derivatives

      if (this.textContainsTag) {
        this.send('tagSelection', selection, this.tags);
      }

      var newCommentParent = this.newCommentParent;
      var comp = this;
      this.set('alerts', this.alert);

      comment
        .save()
        .then((record) => {
          this.alerts.showToast(
            'success',
            'Comment Created',
            'bottom-end',
            2000,
            false,
            null
          );
          //controller.get('currentSelection.comments').addObject(record);
          selection.get('comments').then(function (comments) {
            comments.addObject(record);
          });
          currentSubmission.get('comments').then(function (comments) {
            comments.addObject(record);
          });
          if (newCommentParent) {
            newCommentParent.get('children').then(function (comments) {
              comments.addObject(record);
            });
          }
          comp.set('newComment', ''); //clear out the comment
          comp.clearCommentParent();
          comp.get('comments').pushObject(record);
        })
        .catch((err) => {
          this.handleErrors(err, 'createRecordErrors');
        });
    },

    deleteComment: function (comment) {
      return this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this comment?',
          null,
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            comment.get('submission').then((submission) => {
              comment.set('isTrashed', true);
              comment
                .save()
                .then(() => {
                  this.alert
                    .showToast(
                      'success',
                      'Comment Deleted',
                      'bottom-end',
                      3000,
                      true,
                      'Undo'
                    )
                    .then((result) => {
                      if (result.value) {
                        comment.set('isTrashed', false);
                        comment.save().then(() => {
                          this.alert.showToast(
                            'success',
                            'Comment Restored',
                            'bottom-end',
                            2000,
                            false,
                            null
                          );
                        });
                      }
                    });
                  // this.set('commentDeleteSuccess', true);
                })
                .catch((err) => {
                  this.handleErrors(err, 'updateRecordErrors');
                });
            });
          }
        });
    },

    reuseComment: function (comment) {
      //copy the comment text to the input
      this.set('newComment', this.newComment + ' ' + comment.get('text'));
      //set the comment label to match, right?
      this.set('newCommentLabel', comment.get('label'));
      //record that the comment is being reused
      this.clearCommentParent();
      this.set('newCommentParent', comment);
      comment.set('inReuse', true);

      $('#commentTextarea').focus();
    },

    setCommentLabel: function (label) {
      this.set('newCommentLabel', label);
    },

    toggleFilter: function () {
      this.toggleProperty('showFilter');
      if (this.showFilter && this.isSearching) {
        this.set('isSearching', false);
      }
    },

    toggleSearch: function () {
      this.toggleProperty('isSearching');

      if (this.isSearching && this.showFilter) {
        this.set('showFilter', false);
      }
    },
    hideComments() {
      this.hideComments();
    },
    updateFilter(prop) {
      this.toggleProperty(prop);
      this.send('searchComments');
    },
    searchComments(query, page) {
      // no need to fetch
      if (this.thisSubmissionOnly || this.thisWorkspaceOnly) {
        return;
      }
      // clear current selection
      this.send('cancelComment');

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isLoadingSearchResults',
        'doShowLoadingMessage'
      );

      let options = {
        text: query || '',
      };

      if (this.myCommentsOnly) {
        options.createdBy = this.currentUser.id;
      }

      options.page = page || 1;

      if (this.doUseSinceDate) {
        let dateInput = this.sinceDate;
        let parsedDate = Date.parse(dateInput);

        if (_.isNaN(parsedDate)) {
          return this.set('invalidDateError', 'Please enter a valid date');
        }
        options.sinceDate = dateInput;
      }
      return this.store
        .query('comment', options)
        .then((comments) => {
          this.set('searchResults', comments.toArray());
          this.set('commentsMetadata', comments.get('meta'));
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isLoadingSearchResults',
            'doShowLoadingMessage'
          );
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isLoadingSearchResults',
            'doShowLoadingMessage'
          );
          this.handleErrors(err, 'queryErrors');
        });
    },
    initiatePageChange(page) {
      this.set('isChangingPage', true);
      this.send('searchComments', this.commentFilterText, page);
    },
    applySinceDate() {
      this.send('searchComments', this.commentFilterText);
    },
    superScroll: function (direction) {
      //should only show scroll option after the user scrolls a little
      let maxScroll = this.$('.display-list')[0].scrollHeight;

      if (!this.scrollBottom) {
        $('.display-list').animate({
          scrollTop: 0,
        });
      } else {
        $('.display-list').animate({
          scrollTop: maxScroll,
        });
      }
      this.set('scrollBottom', !this.scrollBottom);
    },
    clearSearchResults() {
      this.send('searchComments');
    },
  },
});
