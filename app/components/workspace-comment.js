import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class WsCommentComponent extends Component {
  @service currentUser;
  @service('workspace-permissions') permissions;
  @service('utility-methods') utils;

  get originalWorkspace() {
    return this.args.comment.originalComment?.workspace;
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
    return childrenIds.length;
  }

  get isOwnComment() {
    const creatorId = this.utils.getBelongsToId(this.args.comment, 'createdBy');
    return creatorId === this.currentUser.id;
  }

  get canDelete() {
    return this.permissions.canEdit(this.args.currentWorkspace, 'comments', 4);
  }

  get permittedToComment() {
    return this.permissions.canEdit(this.args.currentWorkspace, 'comments', 2);
  }

  get relevanceClass() {
    return `relevance-${this.args.comment.relevance}`;
  }

  get isFromCurrentSelection() {
    const selectionId = this.utils.getBelongsToId(
      this.args.comment,
      'selection'
    );
    return selectionId === this.args.currentSelection?.id;
  }
}
