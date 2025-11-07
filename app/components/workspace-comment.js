import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class WorkspaceCommentComponent extends Component {
  @service('current-user') currentUser;
  @service('workspace-permissions') permissions;
  @service('utility-methods') utils;

  get originalWorkspace() {
    return this.args.comment?.originalComment?.workspace;
  }

  get isForCurrentWorkspace() {
    const workspaceId = this.utils.getBelongsToId(
      this.args.comment,
      'workspace'
    );
    return workspaceId === this.args.currentWorkspace?.id;
  }

  get childrenLength() {
    const childrenIds = this.utils.getHasManyIds(this.args.comment, 'children');
    return childrenIds?.length || 0;
  }

  get isOwnComment() {
    const creatorId = this.utils.getBelongsToId(this.args.comment, 'createdBy');
    return creatorId === this.currentUser.id;
  }

  get canDelete() {
    return this._canEditComments(4);
  }

  get permittedToComment() {
    return this._canEditComments(2);
  }

  get relevanceClass() {
    return `relevance-${this.args.comment?.relevance || ''}`;
  }

  // TODO: Known issues with selection matching:
  // 1. Selection IDs from comment model had last two digits mutating - needs investigation
  // 2. For group workspaces: matches against originalSelection.id to display comment with selection
  // 3. For parent workspaces: skips group selection logic to avoid CSS issues
  // 4. Some group workspaces don't order matching comments to top of list
  get isFromCurrentSelection() {
    if (!this.args.comment) return false;

    const commentSelectionId = this.utils.getBelongsToId(
      this.args.comment,
      'selection'
    );

    // For non-parent workspaces, check against group's original selection
    if (this.args.currentWorkspace?.workspaceType !== 'parent') {
      const groupSelectionId =
        this.args.currentSelection?.originalSelection?.id;
      if (groupSelectionId) {
        return commentSelectionId === groupSelectionId;
      }
    }

    // Default: check against current selection
    return commentSelectionId === this.args.currentSelection?.id;
  }

  get commentClasses() {
    const classes = ['ws-comment-comp'];
    if (this.args.comment?.label) classes.push(this.args.comment.label);
    if (this.relevanceClass) classes.push(this.relevanceClass);
    if (this.args.comment?.inReuse) classes.push('inReuse');
    if (this.isFromCurrentSelection) classes.push('is-for-cs');
    return classes.join(' ');
  }

  // Helper method to check comment edit permissions
  _canEditComments(level) {
    if (!this.args.currentWorkspace) return false;
    return this.permissions.canEdit(
      this.args.currentWorkspace,
      'comments',
      level
    );
  }

  @action
  deleteComment(comment) {
    this.args.deleteComment?.(comment);
  }

  @action
  reuseComment(comment) {
    this.args.reuseComment?.(comment);
  }
}
