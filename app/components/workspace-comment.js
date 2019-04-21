Encompass.WorkspaceCommentComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'li',

  permissions: Ember.inject.service('workspace-permissions'),
  utils: Ember.inject.service('utility-methods'),

  currentWorkspace: null,
  classNames: ['ws-comment-comp'],
  classNameBindings: ['comment.label', 'relevanceClass', 'comment.inReuse' ],

  isForCurrentWorkspace: function() {
    let workspaceId = this.get('utils').getBelongsToId(this.get('comment'), 'workspace');
    return workspaceId === this.get('currentWorkspace.id');
  }.property('currentWorkspace.id', 'comment'),

  childrenLength: function() {
    let childrenIds = this.get('utils').getHasManyIds(this.get('comment'), 'children');
    return childrenIds.get('length');
  }.property('comment.children.[]'),

  isOwnComment: function() {
    let creatorId = this.get('utils').getBelongsToId(this.get('comment'), 'createdBy');
    return creatorId === this.get('currentUser.id');
  }.property('comment', 'currentUser.id'),

  canDelete: function () {
    let ws = this.get('currentWorkspace');
    return this.get('isOwnComment') || this.get('permissions').canEdit(ws, 'comments', 4);
  }.property('currentWorkspace.permissions.@each.{global,comments}', 'isOwnComment'),

  permittedToComment: function () {
    let ws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(ws, 'comments', 2);
  }.property('currentWorkspace.permissions.@each.{global,comments}'),

  relevanceClass: function(){
    return 'relevance-' + this.get('comment.relevance');
  }.property('comment.relevance'),

  actions: {
    deleteComment: function( comment ){
      this.sendAction('action', comment);
    }
  }
});

