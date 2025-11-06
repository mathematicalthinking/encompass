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
    return creatorId === this.currentUser.user?.id;
  }

  get canDelete() {
    if (!this.args.currentWorkspace) return false;
    return this.permissions.canEdit(this.args.currentWorkspace, 'comments', 4);
  }

  get permittedToComment() {
    if (!this.args.currentWorkspace) return false;
    return this.permissions.canEdit(this.args.currentWorkspace, 'comments', 2);
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
    if (this.args.currentWorkspace?.workspaceType !== 'parent') {
      if (this.args.currentSelection) {
        const groupSelection = this.args.currentSelection.originalSelection;
        if (groupSelection?.id) {
          return (
            this.utils.getBelongsToId(this.args.comment, 'selection') ===
            groupSelection.id
          );
        }
      }
    }
    return (
      this.utils.getBelongsToId(this.args.comment, 'selection') ===
      this.args.currentSelection?.id
    );
  }

  get commentClasses() {
    const classes = ['ws-comment-comp'];
    if (this.args.comment?.label) classes.push(this.args.comment.label);
    if (this.relevanceClass) classes.push(this.relevanceClass);
    if (this.args.comment?.inReuse) classes.push('inReuse');
    if (this.isFromCurrentSelection) classes.push('is-for-cs');
    return classes.join(' ');
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
