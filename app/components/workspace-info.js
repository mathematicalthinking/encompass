import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import _ from 'underscore';
// import { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WorkspaceInfoComponent extends ErrorHandlingComponent {
  @service('current-user') currentUser;
  // comments: controller(),
  @service('sweet-alert') alert;
  @service store;
  @service('workspace-permissions') permissions;
  @service('utility-methods') utils;
  @tracked updateRecordErrors = [];
  @tracked isShowingCustomViewer = false;
  @tracked customSubmissionIds = [];
  constructor() {
    super(...arguments);

    const collaborators = this.args.workspace.get('collaborators');
    // array of Ids, query for users;

    if (!this.utils.isNonEmptyArray(collaborators)) {
      this.originalCollaborators = [];
      return;
    }

    return this.store
      .query('user', {
        ids: collaborators,
      })
      .then((users) => {
        this.originalCollaborators = users.toArray();
      })
      .catch((err) => {
        this.handleErrors(err, 'queryErrors');
      });
  }

  get canEdit() {
    let workspace = this.args.workspace;
    // let ownerId = workspace.get('owner.id');
    let creatorId = workspace.get('createdBy.id');
    let currentUser = this.currentUser.user;
    let accountType = currentUser.accountType;
    let isAdmin = accountType === 'A';
    // let isOwner = ownerId === currentUser.id;
    let isCreator = creatorId === currentUser.id;

    return isAdmin || isCreator;
  }

  get canEditCollaborators() {
    if (this.canEdit) {
      return true;
    }
    return this.args.workspace
      .get('feedbackAuthorizers')
      .includes(this.currentUser.user.id);
  }

  get initialCollabOptions() {
    let peeked = this.store.peekAll('user');
    let collabs = this.selectedCollaborators;

    if (!_.isObject(peeked)) {
      return [];
    }
    let filtered = peeked.reject((record) => {
      return collabs[record.get('id')];
    });
    return filtered.map((obj) => {
      return {
        id: obj.get('id'),
        username: obj.get('username'),
      };
    });
  }

  get selectedCollaborators() {
    let hash = {};
    let wsOwnerId = this.args.workspace.get('owner.id');

    // no reason to set owner as a collaborator
    if (wsOwnerId) {
      hash[wsOwnerId] = true;
    }
    const originalCollaborators = this.originalCollaborators;

    if (!this.utils.isNonEmptyArray(originalCollaborators)) {
      return hash;
    }
    originalCollaborators.forEach((user) => {
      if (_.isString(user)) {
        hash[user] = true;
      } else if (_.isObject(user)) {
        hash[user.get('id')] = true;
      }
    });
    return hash;
  }

  @action removeErrorString(arrayPropName, errorString) {
    let errors = this[arrayPropName];
    if (Array.isArray(errors)) {
      errors.removeObject(errorString);
    }
  }
  @action updateCustomSubs(id) {
    if (!this.utils.isNonEmptyArray(this.customSubmissionIds)) {
      this.customSubmissionIds = [];
    }
    const customSubmissionIds = this.customSubmissionIds;

    const isIn = customSubmissionIds.includes(id);
    if (isIn) {
      customSubmissionIds.removeObject(id);
    } else {
      customSubmissionIds.addObject(id);
    }
  }
  @action selectAllSubmissions() {
    this.customSubmissionIds = this.args.workspace
      .get('submissions')
      .mapBy('id');
  }
  @action deselectAllSubmissions() {
    this.customSubmissionIds = [];
  }
  @action toggleIsShowingCustomViewer() {
    this.isShowingCustomViewer = !this.isShowingCustomViewer;
  }
}
