import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import isArray from 'lodash-es/isArray';
import isString from 'lodash-es/isString';
import isObject from 'lodash-es/isObject';
import isNull from 'lodash-es/isNull';

export default class WsCopyPermissionsComponent extends Component {
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  @service store;

  @tracked permissions = [];
  @tracked selectedCollaborator = null;
  // set by ws-permissions-new via @onSubViewChange; hides Back/Next while the
  // custom submission viewer is open
  @tracked doHideNavButtons = false;

  constructor() {
    super(...arguments);
    // seed already-saved permissions (e.g. user went to a later step and came
    // back). This step is re-rendered fresh on each entry, so the constructor is
    // enough — no didReceiveAttrs needed.
    this.prefillPermissions();
  }

  prefillPermissions() {
    const newWsPermissions = this.args.newWsPermissions;
    if (!isArray(newWsPermissions)) {
      this.permissions = [];
      return;
    }
    let copy = [...newWsPermissions];
    // resolve the user record from the store so the collaborator list can show
    // a username
    copy.forEach((obj) => {
      let user = obj.user;
      if (isString(user)) {
        let record = this.store.peekRecord('user', user);
        if (record) {
          obj.user = record;
        }
      }
    });
    this.permissions = copy;
  }

  get initialCollabOptions() {
    let peeked = this.store.peekAll('user');
    let collabs = this.selectedCollaborators;

    if (!isObject(peeked)) {
      return [];
    }
    let filtered = peeked.reject((record) => collabs[record.get('id')]);
    return filtered.map((obj) => ({
      id: obj.get('id'),
      username: obj.get('username'),
    }));
  }

  get selectedCollaborators() {
    let hash = {};
    let newWsOwnerId = this.args.newWsOwner?.id;

    // no reason to set the owner as a collaborator
    if (newWsOwnerId) {
      hash[newWsOwnerId] = true;
    }

    const permissions = this.permissions;
    if (!this.utils.isNonEmptyArray(permissions)) {
      return hash;
    }
    permissions.forEach((permission) => {
      let user = permission.user;
      if (isString(user)) {
        hash[user] = true;
      } else if (isObject(user)) {
        hash[user.get('id')] = true;
      }
    });
    return hash;
  }

  // clears the selectize collaborator input without jQuery (see the DOM select
  // that selectize keeps by its id). Option B (a SelectizeInput clear api) is
  // documented in docs/selectize-clear-api-optionB.md.
  clearCollabSelect() {
    document.querySelector('select#collab-select')?.selectize?.clear();
  }

  @action setCollaborator(val, item) {
    if (!val) {
      return;
    }
    if (isNull(item)) {
      // removal
      this.selectedCollaborator = null;
      return;
    }
    this.selectedCollaborator = this.store.peekRecord('user', val);
  }

  @action removeCollab(permissionObj) {
    if (
      this.utils.isNonEmptyObject(permissionObj) &&
      Array.isArray(this.permissions)
    ) {
      this.permissions = this.permissions.filter((p) => p !== permissionObj);
    }
  }

  @action editCollab(permissionObj) {
    const utils = this.utils;
    if (utils.isNonEmptyObject(permissionObj)) {
      const user = permissionObj.user;
      if (utils.isNonEmptyObject(user)) {
        this.selectedCollaborator = user;
      }
    }
  }

  @action savePermissions(permissionsObject) {
    if (!this.utils.isNonEmptyObject(permissionsObject)) {
      return;
    }
    const permissions = this.permissions;
    // replace an existing entry for this user, if any
    let existingObj = Array.isArray(permissions)
      ? permissions.find((p) => p.user === permissionsObject.user)
      : null;
    let updatedPermissions = existingObj
      ? permissions.filter((p) => p !== existingObj)
      : permissions;

    this.permissions = [...updatedPermissions, permissionsObject];
    this.selectedCollaborator = null;
    this.clearCollabSelect();
  }

  @action stopEditing() {
    this.selectedCollaborator = null;
    this.clearCollabSelect();
  }

  @action next() {
    const selectedCollaborator = this.selectedCollaborator;
    if (!selectedCollaborator) {
      this.args.onProceed(this.permissions);
      return;
    }
    let title = 'Are you sure you want to proceed?';
    let text = `You are currently in the process of editing permissions for ${selectedCollaborator.get(
      'username'
    )}. You will lose any unsaved changes if you continue.`;

    return this.alert
      .showModal('warning', title, text, 'Proceed')
      .then((result) => {
        if (result.value) {
          this.selectedCollaborator = null;
          this.clearCollabSelect();
          this.args.onProceed(this.permissions);
        }
      });
  }

  @action back() {
    this.args.onBack(-1);
  }

  @action setSubViewState(isShowing) {
    this.doHideNavButtons = isShowing;
  }
}
