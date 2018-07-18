Encompass.WorkspaceCommentComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'li',
  currentWorkspace: null,
  classNameBindings: ['comment.label', 'relevanceClass', 'comment.inReuse' ],

  //TODO: bind these to real properties:
  permittedToComment: true,
  canDelete: true,

  isForCurrentWorkspace: function() {
    return Ember.isEqual(this.get('currentWorkspace.id'), this.comment.get('workspace.id'));
  }.property('currentWorkspace', 'comment.workspace'),

  relevanceClass: function(){
    return 'relevance-' + this.get('comment.relevance');
  }.property('comment.relevance'),

  actions: {
    deleteComment: function( comment ){
      this.sendAction('action', comment);
    }
  }
});

