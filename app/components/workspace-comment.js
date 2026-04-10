import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class WorkspaceCommentComponent extends Component {
  @service currentUser;
  @service('workspace-permissions') permissions;
  @service('utility-methods') utils;
  @service currentSelection;

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
    const isAdmin = this.currentUser.isAdmin && !this.currentUser.isStudent;
    return this._canEditComments(4) && (this.isOwnComment || isAdmin);
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
    if (!this.args.isParentWorkspace) {
      const groupSelectionId =
        this.currentSelection.selection?.originalSelection?.id;
      if (groupSelectionId) {
        return commentSelectionId === groupSelectionId;
      }
    }

    // Default: check against current selection
    return this.currentSelection.isCurrentSelection(commentSelectionId);
  }

  get commentClasses() {
    const classes = ['ws-comment-comp'];
    if (this.args.comment?.label) classes.push(this.args.comment.label);
    if (this.relevanceClass) classes.push(this.relevanceClass);
    if (this.args.comment?.inReuse) classes.push('inReuse');
    if (this.isFromCurrentSelection) classes.push('is-for-cs');
    return classes.join(' ');
  }

  get commentSelection() {
    return this.args.comment?.selection;
  }

  get commentSubmissionId() {
    // Prefer the direct comment->submission id if present
    const fromComment = this.utils.getBelongsToId(
      this.args.comment,
      'submission'
    );
    if (fromComment) {
      return fromComment;
    }
    // Fallback: derive from the selection without forcing async load
    return this.utils.getBelongsToId(this.commentSelection, 'submission');
  }

  get commentSelectionModels() {
    const submissionId = this.commentSubmissionId;
    const selectionId = this.commentSelection?.id;

    if (!submissionId || !selectionId) {
      return null;
    }

    return [submissionId, selectionId];
  }

  get commentSelectionModelsWithWorkspace() {
    const workspaceId = this.commentWorkspace?.id;
    const submissionId = this.commentSubmissionId;
    const selectionId = this.commentSelection?.id;

    if (!workspaceId || !submissionId || !selectionId) {
      return null;
    }

    return [workspaceId, submissionId, selectionId];
  }

  get commentText() {
    return this.args.comment?.text;
  }

  get commentCreator() {
    return this.args.isParentWorkspace
      ? this.args.comment?.originalComment?.createdBy
      : this.args.comment?.createdBy;
  }

  get commentWorkspace() {
    return this.args.isParentWorkspace
      ? this.args.comment?.originalComment?.workspace
      : this.args.comment?.workspace;
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
  deleteComment() {
    if (!this.canDelete) {
      return;
    }

    this.args.deleteComment?.(this.args.comment);
  }

  @action
  reuseComment() {
    this.args.reuseComment?.(this.args.comment);
  }
}
