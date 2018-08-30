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
Encompass.CommentListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  myCommentsOnly: true,
  // thisWorkspaceOnly: true,
  thisSubmissionOnly: true,
  commentFilterText: '',
  filterComments: false,
  newComment: '',
  newCommentLabel: 'notice',
  newCommentParent: null,
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
      // let newComments = [];
      // filtered.forEach((comment) => {
      //   let commentSubId = comment.get('submission').get('id');
      //   let currentSubmissionId = this.get('currentSubmission').get('id');
      //   if (commentSubId === currentSubmissionId) {
      //     newComments.push(comment);
      //   }
      // });
      // console.log('new comments are', newComments);
      // return newComments;
      filtered = filtered.filterBy('submission.id', this.get('currentSubmission.id'));
    }

    if(this.filterComments){
      //change this to query the comments vs filter what is viewable?
      var regexp = new RegExp(this.commentFilterText, "i");
      filtered = filtered.filter( function(comment){
        //item.get('url').match(regExp);
        return regexp.test( comment.get('text') );
      });
    }
    return filtered.sortBy('createDate').reverse();
  }.property('comments.@each.isTrashed', 'thisSubmissionOnly', 'myCommentsOnly', 'filterComments', 'commentFilterText', 'currentSubmission.id'),

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

  //canComment: true,
  canComment: function() {
    console.log("Folder List onSelection: " + this.get('onSelection') + ", allowedToComment: " + this.get('allowedToComment') );
    return (this.get('onSelection') && this.get('allowedToComment'));
  }.property('onSelection', 'allowedToComment'),

  actions: {
    cancelComment: function() {
      this.clearCommentParent();
      this.set('newComment', '');
      this.sendAction('resetComment');
    },

    createComment: function() {
      var currentUser = this.get('currentUser');
      var label = this.get('newCommentLabel');
      var text = this.get('newComment');
      console.log("Create Comment text: " + text );
      var useForResponse = this.labels[label].useForResponse;
      //var controller = this;
      if (!text || !text.trim()) { return; }

      //var selection = this.currentWorkspace.get('currentSelection');
      var selection = this.currentSelection;
      var currentSubmission = this.get( 'currentSubmission' );
      console.log("Sumbission: " + currentSubmission.get("submissionId") );
      console.log("Selection: " + selection.get("selectionId") );

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

      console.log("New comment data:\n" + JSON.stringify(data) );
      var comment = this.get('store').createRecord('comment', data);

      //TODO push comment onto origin's derivatives

      if(this.get('textContainsTag')) {
        this.send('tagSelection', selection, this.get('tags'));
      }

      var newCommentParent = this.get('newCommentParent');
      var comp = this;

      comment.save().then(function(record) {
        //controller.get('currentSelection.comments').addObject(record);
        selection.get('comments').then(function(comments){
          comments.addObject(record);
        });
        currentSubmission.get('comments').then(function(comments){
          comments.addObject(record);
        });
        if( newCommentParent ) {
          newCommentParent.get( 'children' ).then(function(comments){
            comments.addObject(record);
          });
        }
        comp.set('newComment', ''); //clear out the comment
        comp.clearCommentParent();
        comp.get('comments').pushObject(record);
      });
    },

    deleteComment: function(comment) {
      comment.get('submission').then(function(submission){
        console.log("Comment to delete submission: " + submission.get('submissionId'));
        comment.set('isTrashed', true);
        comment.save();
      });
    },

    reuseComment: function(comment) {
      console.log("Reuse Comment in Comment-list: " + comment.get('label') );
      var controller = this;

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
    }
  }
});

