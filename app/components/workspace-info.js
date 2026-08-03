import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import isObject from 'lodash-es/isObject';
import isString from 'lodash-es/isString';

export default class WorkspaceInfoComponent extends ErrorHandlingComponent {
  @service('current-user') currentUser;
  @service('sweet-alert') alert;
  @service store;
  @service('utility-methods') utils;
  @tracked updateRecordErrors = [];
  @tracked isShowingCustomViewer = false;
  @tracked customSubmissionIds = [];

  get canEdit() {
    const workspace = this.args.workspace;
    const creatorId = workspace.belongsTo('createdBy').id();
    const currentUser = this.currentUser.user;
    const isAdmin = currentUser.accountType === 'A';
    const isCreator = creatorId === currentUser.id;

    return isAdmin || isCreator;
  }

  get canEditCollaborators() {
    if (this.canEdit) {
      return true;
    }
    return this.args.workspace.feedbackAuthorizers.includes(
      this.currentUser.user.id
    );
  }

  get initialCollabOptions() {
    const peeked = this.store.peekAll('user');
    const collabs = this.selectedCollaborators;

    if (!isObject(peeked)) {
      return [];
    }
    return [...peeked]
      .filter((record) => !collabs[record.id])
      .map((obj) => ({ id: obj.id, username: obj.username }));
  }

  get selectedCollaborators() {
    const hash = {};
    const wsOwnerId = this.args.workspace.belongsTo('owner').id();

    // no reason to set owner as a collaborator
    if (wsOwnerId) {
      hash[wsOwnerId] = true;
    }
    const originalCollaborators = this.args.originalCollaborators;

    if (!this.utils.isNonEmptyArray(originalCollaborators)) {
      return hash;
    }
    originalCollaborators.forEach((user) => {
      if (isString(user)) {
        hash[user] = true;
      } else if (isObject(user)) {
        hash[user.id] = true;
      }
    });
    return hash;
  }

  @action
  removeErrorString(arrayPropName, errorString) {
    const errors = this[arrayPropName];
    if (Array.isArray(errors)) {
      this[arrayPropName] = errors.filter((e) => e !== errorString);
    }
  }

  @action
  updateCustomSubs(id) {
    const current = Array.isArray(this.customSubmissionIds)
      ? this.customSubmissionIds
      : [];
    this.customSubmissionIds = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
  }

  @action
  selectAllSubmissions() {
    this.customSubmissionIds = this.args.workspace.hasMany('submissions').ids();
  }

  @action
  deselectAllSubmissions() {
    this.customSubmissionIds = [];
  }

  @action
  toggleIsShowingCustomViewer() {
    this.isShowingCustomViewer = !this.isShowingCustomViewer;
  }
}
