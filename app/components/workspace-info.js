import Component from '@ember/component';
// import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  currentUser: service('current-user'),
  elementId: 'workspace-info',
  // comments: controller(),
  alert: service('sweet-alert'),
  store: service(),
  permissions: service('workspace-permissions'),
  utils: service('utility-methods'),
  updateRecordErrors: [],
  isShowingCustomViewer: false,
  customSubmissionIds: [],
  didReceiveAttrs() {
    this._super(...arguments);

    const collaborators = this.get('workspace.collaborators');
    // array of Ids, query for users;

    if (!this.utils.isNonEmptyArray(collaborators)) {
      this.set('originalCollaborators', []);
      return;
    }

    return this.store
      .query('user', {
        ids: collaborators,
      })
      .then((users) => {
        this.set('originalCollaborators', users.toArray());
      })
      .catch((err) => {
        this.handleErrors(err, 'queryErrors');
      });
  },

  canEdit: computed('workspace.id', function () {
    let workspace = this.workspace;
    let ownerId = workspace.get('owner.id');
    let creatorId = workspace.get('createdBy.id');
    let currentUser = this.currentUser.user;
    let accountType = currentUser.get('accountType');
    let isAdmin = accountType === 'A';
    let isOwner = ownerId === currentUser.id;
    let isCreator = creatorId === currentUser.id;

    return isAdmin || isCreator;
  }),

  canEditCollaborators: computed(
    'workspace.feedbackAuthorizers.[]',
    function () {
      if (this.canEdit) {
        return true;
      }
      return this.get('workspace.feedbackAuthorizers').includes(
        this.get('currentUser.user.id')
      );
    }
  ),

  initialCollabOptions: computed('selectedCollaborators', function () {
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
  }),

  selectedCollaborators: computed(
    'originalCollaborators.[]',
    'workspace.owner.id',
    function () {
      let hash = {};
      let wsOwnerId = this.get('workspace.owner.id');

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
  ),

  actions: {
    removeErrorString: function (arrayPropName, errorString) {
      let errors = this.get(arrayPropName);
      if (Array.isArray(errors)) {
        errors.removeObject(errorString);
      }
    },
    updateCustomSubs(id) {
      if (!this.utils.isNonEmptyArray(this.customSubmissionIds)) {
        this.set('customSubmissionIds', []);
      }
      const customSubmissionIds = this.customSubmissionIds;

      const isIn = customSubmissionIds.includes(id);
      if (isIn) {
        customSubmissionIds.removeObject(id);
      } else {
        customSubmissionIds.addObject(id);
      }
    },
    selectAllSubmissions: function () {
      this.set(
        'customSubmissionIds',
        this.get('workspace.submissions').mapBy('id')
      );
    },
    deselectAllSubmissions: function () {
      this.set('customSubmissionIds', []);
    },
  },
});
