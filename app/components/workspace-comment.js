import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
/* eslint-disable */
export default Component.extend({
  currentUser: service('current-user'),
  tagName: 'li',

  permissions: service('workspace-permissions'),
  utils: service('utility-methods'),

  currentWorkspace: null,
  classNames: ['ws-comment-comp'],
  classNameBindings: [
    'comment.label',
    'relevanceClass',
    'comment.inReuse',
    'isFromCurrentSelection:is-for-cs',
  ],

  originalWorkspace: alias('comment.originalComment.workspace'),

  isForCurrentWorkspace: computed(
    'currentWorkspace.id',
    'comment',
    function () {
      let workspaceId = this.utils.getBelongsToId(this.comment, 'workspace');
      return workspaceId === this.get('currentWorkspace.id');
    }
  ),

  childrenLength: computed('comment.children.[]', function () {
    let childrenIds = this.utils.getHasManyIds(this.comment, 'children');
    return childrenIds.get('length');
  }),

  isOwnComment: computed('comment', 'currentUser.user.id', function () {
    let creatorId = this.utils.getBelongsToId(this.comment, 'createdBy');
    return creatorId === this.get('currentUser.user.id');
  }),

  canDelete: computed(
    'currentWorkspace.permissions.@each.{global,comments}',
    function () {
      let ws = this.currentWorkspace;
      return this.permissions.canEdit(ws, 'comments', 4);
    }
  ),

  permittedToComment: computed(
    'currentWorkspace.permissions.@each.{global,comments}',
    function () {
      let ws = this.currentWorkspace;
      return this.permissions.canEdit(ws, 'comments', 2);
    }
  ),

  relevanceClass: computed('comment.relevance', function () {
    return 'relevance-' + this.get('comment.relevance');
  }),

  isFromCurrentSelection: computed(
    'currentSelection',
    'comment.selection',
    // TO DO:
    // Original function had the selection from the comment model.
    // Last two digits of ID were mutating - need to investiage further.

    // Checks below if workspace type is parent to avoid issues with css
    // If its a group workspace, will make the selection/comment display together.

    function () {
      if (this.currentWorkspace.workspaceType !== 'parent') {
        if (this.currentSelection) {
          const groupSelection = this.currentSelection.originalSelection;
          if (groupSelection.get('id')) {
            return (
              this.utils.getBelongsToId(this.comment, 'selection') ===
              groupSelection.get('id')
            );
          }
        }
      }

      return (
        this.utils.getBelongsToId(this.comment, 'selection') ===
        this.get('currentSelection.id')
      );
    }
  ),

  actions: {
    deleteComment: function (comment) {
      this.sendAction('action', comment);
    },
  },
});
