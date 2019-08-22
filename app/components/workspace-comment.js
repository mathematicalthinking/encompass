Encompass.WorkspaceCommentComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'li',

  permissions: Ember.inject.service('workspace-permissions'),
  utils: Ember.inject.service('utility-methods'),

  currentWorkspace: null,
  classNames: ['ws-comment-comp'],
  classNameBindings: ['comment.label', 'relevanceClass', 'comment.inReuse', 'isFromCurrentSelection:is-for-cs',],

  workspaceType: Ember.computed.alias('comment.workspace.workspaceType'),

  originalWorkspace: Ember.computed.alias('comment.originalComment.workspace'),

  isParentWorkspace: Ember.computed.equal('workspaceType', 'parent'),

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

  isFromCurrentSelection: function() {
    return this.get('utils').getBelongsToId(this.get('comment'), 'selection') === this.get('currentSelection.id');
  }.property('currentSelection', 'comment.selection'),

  // metaText: function() {
  //   let creatorUsername = this.get('comment.createdBy.username');

  //   let workspaceType = this.get('workspaceType');

  //   let workspaceName = workspaceType === 'parent' ?
  //   this.get('originalWorkspace.name') : this.get('comment.workspace.name');
  //   return `by ${creatorUsername} in ${workspaceName}`;
  // }.property('workspaceType', 'comment.createdBy', 'comment.workspace.name', 'originalWorkspace.name'),
  actions: {
    deleteComment: function( comment ){
      this.sendAction('action', comment);
    }
  }
});

