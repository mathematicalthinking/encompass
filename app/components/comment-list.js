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
Encompass.CommentListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'comment-list',
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  myCommentsOnly: true,
  // thisWorkspaceOnly: true,
  thisSubmissionOnly: true,
  commentFilterText: '',
  filterComments: false,
  newComment: '',
  newCommentLabel: 'notice',
  newCommentParent: null,
  queryErrors: [],
  createRecordErrors: [],
  uploadRecordErrors: [],
  labels: {
    notice: {
      placeholder: 'I notice...'
    },
    wonder: {
      placeholder: 'I wonder...'
    },
    feedback: {
      placeholder:['Interesting...', 'Did you try...', 'What about...', 'I am interested in...',
        'I would like...', 'Seems promising...', 'What if...', 'How do you know...', 'Can you say more...'],
      useForResponse: true
    }
  },

  init: function() {
    this._super(...arguments);
    const htmlFormat = 'YYYY-MM-DD';
    let oneYearAgo = moment().subtract(365, 'days').calendar();
    let oneYearAgoDate = new Date(oneYearAgo);
    let htmlDate = moment(oneYearAgoDate).format(htmlFormat);

    this.set('sinceDate', htmlDate);
  },

  newCommentPlaceholder: function() {
    var placeholder = this.labels[this.get('newCommentLabel')].placeholder;
    if(_.isArray(placeholder)) {
      placeholder = placeholder[_.random(0, placeholder.length - 1)];
    }
    return placeholder;
  }.property('newCommentLabel'),

  filteredComments: function() {
    var filtered = this.comments.filterBy('isTrashed', false);

    if( this.myCommentsOnly ){
      filtered = filtered.filterBy( 'createdBy.content', this.get('currentUser') );
    }

    if (this.thisSubmissionOnly) {
      filtered = filtered.filterBy('submission.id', this.get('currentSubmission.id'));
    }

    return filtered.sortBy('createDate').reverse();
  }.property('comments.@each.isTrashed', 'thisSubmissionOnly', 'myCommentsOnly', 'filterComments', 'commentFilterText', 'currentSubmission.id'),

  commentSearchResults: function() {
    if (!this.get('isSearching')) {
      return;
    }
    let searchText = this.get('commentFilterText');
    if (searchText.length < 5) {
      return [];
    }
    this.set('isLoadingSearchResults', true);
    return this.get('store').query('comment', {
      text: searchText,
      myCommentsOnly: this.get('myCommentsOnly'),
      since: this.get('sinceDate')
    }).then((comments) => {
      this.set('searchResults', comments);
      this.set('isLoadingSearchResults', false);
    }).catch((err) => {
      this.set('isLoadingSearchResults', false);
      this.handleErrors(err, 'queryErrors');
    });
  }.observes('commentFilterText', 'myCommentsOnly', 'sinceDate'),

  displayList: function() {
    if (this.get('isSearching')) {
      return this.get('searchResults');
    }

    return this.get('filteredComments');
  }.property('isSearching', 'searchResults.[]', 'filteredComments.[]'),

  clearCommentParent: function() {
    if(this.get('newCommentParent')) {
      this.set('newCommentParent.inReuse', false);
      this.set('newCommentParent', null);
    }
  },

  textContainsTag: function(){
    return !!this.get('tags.length');
  }.property('tags'),

  tags: function(){
    var text = this.get('newComment');
    var tags = [];
    text.split(/\s+/).forEach(function(word){
      if(word.match(/^#\S+/)){
        tags.push(word.substring(1).toLowerCase());
      }
    });
    return tags;
  }.property('newComment'),

  onSelection: function() {
    return !!this.get('currentSelection');
  }.property('currentSelection'),

  canComment: function() {
    let ws = this.currentWorkspace;
    return this.get('permissions').canEdit(ws);
  }.property('onSelection', 'allowedToComment'),

  handleLoadingMessage: function() {
    const that = this;
    if (!this.get('isLoadingSearchResults')) {
      this.set('showLoadingMessage', false);
      return;
    }
    Ember.run.later(function() {
      if (that.isDestroyed || that.isDestroying || !that.get('isLoadingSearchResults')) {
        return;
      }
      that.set('showLoadingMessage', true);
    }, 500);

  }.observes('isLoadingSearchResults'),

  actions: {
    cancelComment: function() {
      this.clearCommentParent();
      this.set('newComment', '');
      this.sendAction('resetComment');
    },

    madeSelection: function() {
      if (this.get('onSelection')) {
        this.send('createComment');
      } else {
        this.get('alert').showToast('error', 'Please choose a selection first', 'bottom-end', 3000, false, null);
      }
    },

    createComment: function() {
      var currentUser = this.get('currentUser');
      var label = this.get('newCommentLabel');
      var text = this.get('newComment');
      var useForResponse = this.labels[label].useForResponse;
      //var controller = this;
      if (!text || !text.trim()) { return; }

      //var selection = this.currentWorkspace.get('currentSelection');
      var selection = this.currentSelection;
      var currentSubmission = this.get('currentSubmission');

      var data = {
        text: text,
        label: label,
        selection: selection,
        submission: currentSubmission,
        workspace: this.currentWorkspace,
        parent: this.get('newCommentParent'),
        useForResponse: !!useForResponse,
        createdBy: currentUser,
      };
      var comment = this.get('store').createRecord('comment', data);

      //TODO push comment onto origin's derivatives

      if(this.get('textContainsTag')) {
        this.send('tagSelection', selection, this.get('tags'));
      }

      var newCommentParent = this.get('newCommentParent');
      var comp = this;
      this.set('alerts', this.get('alert'));

      comment.save().then((record) => {
        this.get('alerts').showToast('success', 'Comment Created', 'bottom-end', 2000, false, null);
        //controller.get('currentSelection.comments').addObject(record);
        selection.get('comments').then(function(comments){
          comments.addObject(record);
        });
        currentSubmission.get('comments').then(function(comments){
          comments.addObject(record);
        });
        if( newCommentParent ) {
          newCommentParent.get('children').then(function(comments){
            comments.addObject(record);
          });
        }
        comp.set('newComment', ''); //clear out the comment
        comp.clearCommentParent();
        comp.get('comments').pushObject(record);
      }).catch((err) => {
        console.log('error creating comment', err);
        this.handleErrors(err, 'createRecordErrors');
      });
    },

    deleteComment: function(comment) {
      comment.get('submission').then((submission) => {
        comment.set('isTrashed', true);
        this.set('alerting', this.get('alert'));
        comment.save()
        .then(() => {
          this.get('alerting').showToast('success', 'Comment Deleted', 'bottom-end', 3000, true, 'Undo').then((result) => {
            if (result.value) {
              comment.set('isTrashed', false);
              comment.save().then(() => {
                this.get('alerting').showToast('success', 'Comment Restored', 'bottom-end', 2000, false, null);
              });
            }
          });
          // this.set('commentDeleteSuccess', true);
        }).catch((err) => {
          console.log('error deleting comment', err);
          this.handleErrors(err, 'updateRecordErrors');
        });
      });
    },

    reuseComment: function(comment) {

      //copy the comment text to the input
      this.set('newComment', this.get('newComment') + ' ' + comment.get('text'));
      //set the comment label to match, right?
      this.set('newCommentLabel', comment.get('label'));
      //record that the comment is being reused
      this.clearCommentParent();
      this.set('newCommentParent', comment);
      comment.set('inReuse', true);

      $('#commentTextarea').focus();
    },

    setCommentLabel: function(label) {
      this.set('newCommentLabel', label);
    },

    toggleFilter: function() {
      this.toggleProperty('showFilter');
      if (this.get('showFilter') && this.get('isSearching')) {
        this.set('isSearching', false);
      }
    },

    toggleSearch: function() {
      this.toggleProperty('isSearching');

      if (this.get('isSearching') && this.get('showFilter')) {
        this.set('showFilter', false);
      }
    }
  }
});

