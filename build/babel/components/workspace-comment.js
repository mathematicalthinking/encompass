'use strict';

Encompass.WorkspaceCommentComponent = Ember.Component.extend({
  tagName: 'li',
  currentWorkspace: null,
  classNameBindings: ['comment.label', 'relevanceClass', 'comment.inReuse'],

  //TODO: bind these to real properties:
  permittedToComment: true,
  canDelete: true,

  isForCurrentWorkspace: function () {
    return Ember.isEqual(this.get('currentWorkspace.id'), this.comment.get('workspace.id'));
  }.property('currentWorkspace', 'comment.workspace'),

  relevanceClass: function () {
    return 'relevance-' + this.get('comment.relevance');
  }.property('comment.relevance'),

  actions: {
    deleteComment: function deleteComment(comment) {
      this.sendAction('action', comment);
    }
  }
});
//# sourceMappingURL=workspace-comment.js.map
